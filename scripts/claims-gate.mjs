// Fails when a docs claim names a capability that is not live, or a page claims something the product does not do.
// Usage: node scripts/claims-gate.mjs [repo root]. See "Claims and capabilities" in README.md.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? '.';
const docs = join(root, 'src/content/docs');
const read = (path) => readFileSync(join(root, path), 'utf8');
const capabilities = JSON.parse(read('claims/capabilities.json'));
const claims = JSON.parse(read('claims/claims.json'));
const spec = JSON.parse(read('openapi.json'));
const problems = [];

const squash = (text) => text.replace(/\s+/g, ' ');
const pages = new Map();
const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : /\.mdx?$/.test(name) ? [path] : [];
	});
for (const path of walk(docs)) pages.set(relative(docs, path), readFileSync(path, 'utf8'));

// 1 and 2: every claim names live capabilities and is still on its page.
for (const [i, claim] of claims.entries()) {
	const where = `claims.json #${i + 1} (${claim.page})`;
	const page = pages.get(claim.page);
	if (!page) problems.push(`${where}: page not found`);
	else if (!squash(page).includes(squash(claim.text)))
		problems.push(`${where}: text no longer on the page, re-check the claim: "${claim.text}"`);
	if (!claim.needs?.length) problems.push(`${where}: names no capability`);
	for (const id of claim.needs ?? []) {
		const capability = capabilities[id];
		if (!capability) problems.push(`${where}: names capability "${id}", which is not in claims/capabilities.json`);
		else if (capability.status !== 'live')
			problems.push(`${where}: names capability "${id}", which is ${capability.status}, not live`);
	}
}

// 3: every capability is well formed, and a live one's API evidence is in the spec.
for (const [id, capability] of Object.entries(capabilities)) {
	if (!['live', 'held', 'absent'].includes(capability.status))
		problems.push(`capability "${id}": status must be live, held or absent`);
	if (!capability.summary) problems.push(`capability "${id}": no summary`);
	if (capability.status === 'live' && !capability.api?.length && !capability.source)
		problems.push(`capability "${id}": live capabilities need api or source evidence`);
	if (capability.status === 'absent' && !capability.patterns?.length)
		problems.push(`capability "${id}": absent capabilities need patterns`);
	for (const op of capability.status === 'live' ? (capability.api ?? []) : []) {
		const [method, path] = op.split(' ');
		if (!spec.paths[path]?.[method.toLowerCase()])
			problems.push(`capability "${id}": ${op} is not in openapi.json`);
	}
}

// 4: no page claims an absent capability. A sentence that negates it is fine.
const negation = /\b(no|not|never|none|nor|without|refused|cannot|isn't|aren't|doesn't|don't|won't)\b|n't\b/i;
const stripFrontmatter = (text) => text.replace(/^---\n[\s\S]*?\n---\n/, '');
for (const [id, capability] of Object.entries(capabilities)) {
	if (capability.status !== 'absent') continue;
	const patterns = capability.patterns.map((source) => new RegExp(source, 'gi'));
	for (const [file, text] of pages) {
		const body = stripFrontmatter(text);
		// Sentences, list items and table rows each stand alone.
		for (const sentence of body.split(/(?<=[.!?:;])\s+|\n\s*\n|\n(?=\s*[-*|]|\s*\d+\.)/)) {
			if (!patterns.some((re) => (re.lastIndex = 0, re.test(sentence)))) continue;
			if (negation.test(sentence)) continue;
			problems.push(`${file}: claims "${capability.summary}" (${id}): "${squash(sentence).trim().slice(0, 160)}"`);
		}
	}
}

if (problems.length) {
	console.error(`Claims gate failed:\n${problems.map((p) => `- ${p}`).join('\n')}`);
	process.exit(1);
}
const live = Object.values(capabilities).filter((c) => c.status === 'live').length;
console.log(`Claims gate passed: ${claims.length} claims, ${live} live capabilities, ${pages.size} pages scanned.`);
