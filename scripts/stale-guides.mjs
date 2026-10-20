// Fails when a setup guide not backed by examples/ was last verified more than 180 days ago.
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'src/content/docs/observability/platforms';
const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
const stale = [];
for (const file of readdirSync(dir).filter((name) => name.endsWith('.mdx'))) {
	const text = readFileSync(`${dir}/${file}`, 'utf8');
	if (text.includes('/examples/') || file === 'overview.mdx') continue;
	const date = text.match(/^last_verified:\s*(\S+)/m)?.[1];
	if (!date || Date.parse(date) < cutoff) stale.push(`${file} (last verified ${date ?? 'never'})`);
}
if (stale.length) {
	console.error(`Re-check these guides against their platform, then bump last_verified:\n${stale.join('\n')}`);
	process.exit(1);
}
console.log('Every hand-maintained setup guide was verified in the last 180 days.');
