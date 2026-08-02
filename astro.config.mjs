// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

// NOTE: Expressive Code (code-block) theming lives in ./ec.config.mjs, not in
// the Starlight `expressiveCode` option below — starlight-openapi's plugin
// overwrites that option, so anything set there is silently discarded.

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.siteqwality.com',
	integrations: [
		starlight({
			title: 'SiteQwality Docs',
			description:
				'Documentation for SiteQwality — uptime monitoring, observability, incidents, and status pages.',
			logo: {
				light: './src/assets/atlas-logo-light.svg',
				dark: './src/assets/atlas-logo-dark.svg',
				alt: 'SiteQwality',
				replacesTitle: false,
			},
			favicon: '/favicon.svg',
			customCss: ['./src/styles/atlas.css'],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.siteqwality.com/og-feat.png' },
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/manrope-latin.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/jetbrains-mono-latin.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: true,
					},
				},
				{
					tag: 'meta',
					attrs: { name: 'theme-color', content: '#F0EBE0', media: '(prefers-color-scheme: light)' },
				},
				{
					tag: 'meta',
					attrs: { name: 'theme-color', content: '#1A1816', media: '(prefers-color-scheme: dark)' },
				},
				// iOS / Android home-screen icons + PWA manifest
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				{ tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
			],
			plugins: [
				starlightOpenAPI([
					{
						base: 'api-reference',
						label: 'API Reference',
						schema: './openapi.json',
						sidebar: { collapsed: true },
					},
				]),
			],
			sidebar: [
				{
					label: 'Getting Started',
					collapsed: true,
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Sign up & first monitor', slug: 'getting-started/signup-and-first-monitor' },
						{ label: 'Account & team setup', slug: 'getting-started/account-and-team' },
						{ label: 'Concepts & glossary', slug: 'getting-started/concepts' },
					],
				},
				{
					label: 'Uptime Monitoring',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'uptime-monitoring/overview' },
						{
							label: 'HTTP checks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/http-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/http-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/http-checks/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'uptime-monitoring/http-checks/how-to' },
								},
							],
						},
						{
							label: 'SSL/TLS checks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/ssl-tls-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/ssl-tls-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/ssl-tls-checks/reference' },
							],
						},
						{
							label: 'DNS checks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/dns-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/dns-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/dns-checks/reference' },
							],
						},
						{
							label: 'Cron checks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/cron-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/cron-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/cron-checks/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'uptime-monitoring/cron-checks/how-to' },
								},
							],
						},
						{
							label: 'Browser checks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/browser-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/browser-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/browser-checks/reference' },
							],
						},
					],
				},
				{
					label: 'Observability',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'observability/overview' },
						{
							label: 'Metrics',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'observability/metrics/overview' },
								{ label: 'Quickstart', slug: 'observability/metrics/quickstart' },
								{ label: 'Reference', slug: 'observability/metrics/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'observability/metrics/how-to' },
								},
							],
						},
						{
							label: 'Logs',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'observability/logs/overview' },
								{ label: 'Quickstart', slug: 'observability/logs/quickstart' },
								{ label: 'Reference', slug: 'observability/logs/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'observability/logs/how-to' },
								},
							],
						},
						{
							label: 'Traces',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'observability/traces/overview' },
								{ label: 'Quickstart', slug: 'observability/traces/quickstart' },
								{ label: 'Reference', slug: 'observability/traces/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'observability/traces/how-to' },
								},
							],
						},
						{
							label: 'RUM',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'observability/rum/overview' },
								{ label: 'Quickstart', slug: 'observability/rum/quickstart' },
								{ label: 'Reference', slug: 'observability/rum/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'observability/rum/how-to' },
								},
							],
						},
						{
							label: 'Session Replay',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'observability/replay/overview' },
								{ label: 'Quickstart', slug: 'observability/replay/quickstart' },
								{ label: 'Reference', slug: 'observability/replay/reference' },
							],
						},
					],
				},
				{
					label: 'Incident Management',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'incident-management/overview' },
						{
							label: 'Incidents',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'incident-management/incidents/overview' },
								{ label: 'Quickstart', slug: 'incident-management/incidents/quickstart' },
								{ label: 'Reference', slug: 'incident-management/incidents/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'incident-management/incidents/how-to' },
								},
							],
						},
						{
							label: 'On-call schedules',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'incident-management/on-call/overview' },
								{ label: 'Quickstart', slug: 'incident-management/on-call/quickstart' },
								{ label: 'Reference', slug: 'incident-management/on-call/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'incident-management/on-call/how-to' },
								},
							],
						},
						{
							label: 'Escalation policies',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'incident-management/escalation/overview' },
								{ label: 'Quickstart', slug: 'incident-management/escalation/quickstart' },
								{ label: 'Reference', slug: 'incident-management/escalation/reference' },
							],
						},
						{
							label: 'Notifications',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'incident-management/notifications/overview' },
								{ label: 'Channels reference', slug: 'incident-management/notifications/channels' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'incident-management/notifications/how-to' },
								},
							],
						},
						{
							label: 'Maintenance windows',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'incident-management/maintenance/overview' },
								{ label: 'Quickstart', slug: 'incident-management/maintenance/quickstart' },
								{ label: 'Reference', slug: 'incident-management/maintenance/reference' },
								{
									label: 'How-to guides',
									collapsed: true,
									autogenerate: { directory: 'incident-management/maintenance/how-to' },
								},
							],
						},
					],
				},
				{
					label: 'Status Pages',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'status-pages/overview' },
						{ label: 'Quickstart', slug: 'status-pages/quickstart' },
						{ label: 'Reference', slug: 'status-pages/reference' },
						{
							label: 'How-to guides',
							collapsed: true,
							autogenerate: { directory: 'status-pages/how-to' },
						},
					],
				},
				{
					label: 'Dashboards',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'dashboards/overview' },
						{ label: 'Quickstart', slug: 'dashboards/quickstart' },
						{ label: 'Widget reference', slug: 'dashboards/reference' },
					],
				},
				{
					label: 'Integrations',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'integrations/overview' },
						{ label: 'Slack', slug: 'integrations/slack' },
						{ label: 'Microsoft Teams', slug: 'integrations/microsoft-teams' },
						{ label: 'Discord', slug: 'integrations/discord' },
						{ label: 'Telegram', slug: 'integrations/telegram' },
						{ label: 'Google Chat', slug: 'integrations/google-chat' },
						{ label: 'Mattermost', slug: 'integrations/mattermost' },
						{ label: 'PagerDuty', slug: 'integrations/pagerduty' },
						{ label: 'OpsGenie', slug: 'integrations/opsgenie' },
						{ label: 'Pushover', slug: 'integrations/pushover' },
						{ label: 'Pushbullet', slug: 'integrations/pushbullet' },
						{ label: 'Webhooks', slug: 'integrations/webhooks' },
					],
				},
				{
					label: 'SDK Reference',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'sdk/overview' },
						{ label: 'Reference', slug: 'sdk/reference' },
					],
				},
				...openAPISidebarGroups,
			],
		}),
	],
});
