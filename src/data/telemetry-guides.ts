// Setup guides shown in the "choose your language" grids, most popular first.
export type Signal = 'logs' | 'traces' | 'metrics';
export interface Guide {
	id: string;
	label: string;
	note?: string;
	logo?: string;
	signals: Signal[];
}

const all: Signal[] = ['logs', 'traces', 'metrics'];

export const LANGUAGES: Guide[] = [
	{ id: 'node', label: 'Node.js', note: 'JavaScript, TypeScript', logo: 'nodedotjs', signals: all },
	{ id: 'python', label: 'Python', logo: 'python', signals: all },
	{ id: 'java', label: 'Java', note: 'Kotlin, Scala', logo: 'openjdk', signals: all },
	{ id: 'dotnet', label: '.NET', note: 'C#', logo: 'dotnet', signals: all },
	{ id: 'php', label: 'PHP', logo: 'php', signals: all },
	{ id: 'go', label: 'Go', logo: 'go', signals: all },
	{ id: 'rust', label: 'Rust', logo: 'rust', signals: all },
	{ id: 'ruby', label: 'Ruby', logo: 'ruby', signals: all },
];

export const PLATFORMS: Guide[] = [
	{ id: 'kubernetes', label: 'Kubernetes', logo: 'kubernetes', signals: all },
	{ id: 'docker', label: 'Docker', logo: 'docker', signals: all },
	{ id: 'collector', label: 'OpenTelemetry Collector', logo: 'opentelemetry', signals: all },
	{ id: 'aws-lambda', label: 'AWS Lambda', signals: all },
	{ id: 'vercel', label: 'Vercel', logo: 'vercel', signals: ['logs', 'traces'] },
	{ id: 'cloudflare-workers', label: 'Cloudflare Workers', logo: 'cloudflareworkers', signals: ['logs'] },
	{ id: 'prometheus', label: 'Prometheus', logo: 'prometheus', signals: ['metrics'] },
	{ id: 'fluent-bit', label: 'Fluent Bit', logo: 'fluentbit', signals: ['logs'] },
	{ id: 'vector', label: 'Vector', signals: ['logs'] },
	{ id: 'heroku', label: 'Heroku', signals: ['logs'] },
	{ id: 'render', label: 'Render', logo: 'render', signals: all },
	{ id: 'fly', label: 'Fly.io', logo: 'flydotio', signals: ['logs'] },
	{ id: 'firehose', label: 'Amazon Data Firehose', signals: ['logs', 'metrics'] },
	{ id: 'cloudflare-logpush', label: 'Cloudflare Logpush', logo: 'cloudflare', signals: ['logs'] },
	{ id: 'statsd', label: 'StatsD', signals: ['metrics'] },
	{ id: 'curl', label: 'curl or any HTTP client', logo: 'curl', signals: all },
];

export const guideHref = (id: string) => `/observability/platforms/${id}/`;
