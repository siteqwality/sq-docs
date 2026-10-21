// Checks every curl example against api.siteqwality.com in the docs: the route exists in openapi.json
// and each JSON body uses known fields and sends the required ones.
// Usage: node scripts/api-examples.mjs [--live] [repo root]
// --live also sends each authenticated route to production without a key and expects 401 or 403, never 404.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const live = args.includes('--live');
const root = args.find((arg) => !arg.startsWith('--')) ?? '.';
const docs = join(root, 'src/content/docs');
const spec = JSON.parse(readFileSync(join(root, 'openapi.json'), 'utf8'));
const unlisted = JSON.parse(readFileSync(join(root, 'claims/unlisted-routes.json'), 'utf8'));
const API = 'https://api.siteqwality.com';

const routes = Object.entries(spec.paths).flatMap(([path, item]) =>
	Object.entries(item).map(([method, op]) => ({ method, path, op, public: !op.security?.length })),
);
for (const entry of unlisted) {
	const [method, path] = entry.route.split(' ');
	routes.push({ method: method.toLowerCase(), path, op: null, public: false, unlisted: true });
}
const pattern = (path) => new RegExp(`^${path.replace(/\{[^}]+\}/g, '[^/]+')}$`);
for (const route of routes) route.re = pattern(route.path);

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : /\.mdx?$/.test(name) ? [path] : [];
	});

// Request schema fields: known keys, required keys, and whether other keys are allowed.
const deref = (schema) => {
	while (schema?.$ref) schema = spec.components.schemas[schema.$ref.split('/').pop()];
	return schema;
};
const fields = (input) => {
	const schema = deref(input);
	if (!schema) return null;
	const out = { keys: new Set(), required: new Set(), open: false };
	const parts = schema.allOf ?? schema.oneOf ?? schema.anyOf;
	if (parts) {
		for (const part of parts.map(fields).filter(Boolean)) {
			part.keys.forEach((key) => out.keys.add(key));
			if (schema.allOf) part.required.forEach((key) => out.required.add(key));
			if (part.open) out.open = true;
		}
	}
	Object.keys(schema.properties ?? {}).forEach((key) => out.keys.add(key));
	if (!schema.oneOf && !schema.anyOf) (schema.required ?? []).forEach((key) => out.required.add(key));
	if (schema.additionalProperties || (schema.type === 'object' && !schema.properties && !parts)) out.open = true;
	return out;
};

const problems = [];
const seen = new Map();
let count = 0;
for (const file of walk(docs)) {
	const name = relative(docs, file);
	const text = readFileSync(file, 'utf8');
	for (const block of text.matchAll(/```[a-z]*\n([\s\S]*?)```/g)) {
		for (const command of block[1].replace(/\\\n/g, ' ').split('\n')) {
			const url = command.match(/curl\b.*?https:\/\/api\.siteqwality\.com(\/[^\s"'?]*)/);
			if (!url) continue;
			count++;
			const get = /\s(-G|--get)\b/.test(command);
			const data = command.match(/\s(?:-d|--data(?:-raw)?)\s+'([\s\S]*?)'(?=\s|$)/);
			const explicit = command.match(/\s(?:-X|--request)\s+([A-Z]+)/)?.[1];
			const method = (explicit ?? (get ? 'GET' : /\s(-d|--data|-F|--form)\b/.test(command) ? 'POST' : 'GET')).toLowerCase();
			const concrete = url[1].replace(/\$\{?[A-Za-z_]+\}?|<[^>]+>|\{[^}]+\}/g, 'x');
			const matches = routes.filter((route) => route.re.test(concrete));
			const route = matches.find((candidate) => candidate.method === method);
			const where = `${name}: ${method.toUpperCase()} ${url[1]}`;
			if (!route) {
				problems.push(`${where}: ${matches.length ? 'method not allowed on this path' : 'no such route'} in openapi.json`);
				continue;
			}
			if (!seen.has(`${method} ${route.path}`)) seen.set(`${method} ${route.path}`, { route, where });
			if (!data || get || !route.op) continue;
			let body;
			try {
				body = JSON.parse(data[1].replace(/(?<!")\$\{?[A-Za-z_]+\}?(?!")/g, '"x"'));
			} catch {
				problems.push(`${where}: the -d body is not valid JSON`);
				continue;
			}
			const schema = route.op.requestBody?.content?.['application/json']?.schema;
			if (!schema) {
				problems.push(`${where}: sends a JSON body, but the route takes none`);
				continue;
			}
			const known = fields(schema);
			if (!known || Array.isArray(body) || typeof body !== 'object') continue;
			const unknown = known.open ? [] : Object.keys(body).filter((key) => !known.keys.has(key));
			const missing = [...known.required].filter((key) => !(key in body));
			if (unknown.length) problems.push(`${where}: unknown field(s) ${unknown.join(', ')}`);
			if (missing.length) problems.push(`${where}: missing required field(s) ${missing.join(', ')}`);
		}
	}
}

if (live) {
	const sample = '00000000-0000-4000-8000-000000000000';
	for (const { route, where } of seen.values()) {
		if (route.public) continue;
		const path = route.path.replace(/\{[^}]+\}/g, sample);
		const response = await fetch(`${API}${path}`, { method: route.method.toUpperCase(), redirect: 'manual' });
		if (![401, 403].includes(response.status))
			problems.push(`${where}: live ${route.method.toUpperCase()} ${path} without a key returned ${response.status}, expected 401 or 403`);
	}
}

if (problems.length) {
	console.error(`API examples failed:\n${problems.map((p) => `- ${p}`).join('\n')}`);
	process.exit(1);
}
console.log(`API examples passed: ${count} curl commands, ${seen.size} distinct routes${live ? ', checked live' : ''}.`);
