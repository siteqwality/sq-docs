// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.siteqwality.com',
	integrations: [
		starlight({
			title: 'SiteQwality Docs',
			description:
				'Documentation for SiteQwality — uptime monitoring, observability, incidents, and status pages.',
			logo: {
				src: './src/assets/logo.png',
				alt: 'SiteQwality',
				replacesTitle: false,
			},
			favicon: '/favicon.ico',
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.siteqwality.com/og-feat.png' },
				},
			],
			plugins: [
				starlightOpenAPI([
					{
						base: 'api-reference',
						label: 'API Reference',
						schema: './openapi.json',
						sidebar: { collapsed: false },
					},
				]),
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Sign up & first monitor', slug: 'getting-started/signup-and-first-monitor' },
						{ label: 'Account & team setup', slug: 'getting-started/account-and-team' },
						{ label: 'Concepts & glossary', slug: 'getting-started/concepts' },
					],
				},
				{
					label: 'Uptime Monitoring',
					items: [
						{ label: 'Overview', slug: 'uptime-monitoring/overview' },
						{
							label: 'HTTP checks',
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/http-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/http-checks/quickstart' },
							],
						},
						{
							label: 'SSL/TLS checks',
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/ssl-tls-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/ssl-tls-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/ssl-tls-checks/reference' },
							],
						},
						{
							label: 'DNS checks',
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/dns-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/dns-checks/quickstart' },
								{ label: 'Reference', slug: 'uptime-monitoring/dns-checks/reference' },
							],
						},
						{
							label: 'Cron checks',
							items: [
								{ label: 'Overview', slug: 'uptime-monitoring/cron-checks/overview' },
								{ label: 'Quickstart', slug: 'uptime-monitoring/cron-checks/quickstart' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'uptime-monitoring/cron-checks/how-to' },
								},
							],
						},
						{
							label: 'Browser checks',
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
					items: [
						{ label: 'Overview', slug: 'observability/overview' },
						{
							label: 'Metrics',
							items: [
								{ label: 'Overview', slug: 'observability/metrics/overview' },
								{ label: 'Quickstart', slug: 'observability/metrics/quickstart' },
								{ label: 'Reference', slug: 'observability/metrics/reference' },
							],
						},
						{
							label: 'Logs',
							items: [
								{ label: 'Overview', slug: 'observability/logs/overview' },
								{ label: 'Quickstart', slug: 'observability/logs/quickstart' },
								{ label: 'Reference', slug: 'observability/logs/reference' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'observability/logs/how-to' },
								},
							],
						},
						{
							label: 'Traces',
							items: [
								{ label: 'Overview', slug: 'observability/traces/overview' },
								{ label: 'Quickstart', slug: 'observability/traces/quickstart' },
								{ label: 'Reference', slug: 'observability/traces/reference' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'observability/traces/how-to' },
								},
							],
						},
						{
							label: 'RUM',
							items: [
								{ label: 'Overview', slug: 'observability/rum/overview' },
								{ label: 'Quickstart', slug: 'observability/rum/quickstart' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'observability/rum/how-to' },
								},
							],
						},
						{
							label: 'Session Replay',
							items: [
								{ label: 'Overview', slug: 'observability/replay/overview' },
								{ label: 'Quickstart', slug: 'observability/replay/quickstart' },
							],
						},
					],
				},
				{
					label: 'Incident Management',
					items: [
						{ label: 'Overview', slug: 'incident-management/overview' },
						{
							label: 'Incidents',
							items: [
								{ label: 'Overview', slug: 'incident-management/incidents/overview' },
								{ label: 'Quickstart', slug: 'incident-management/incidents/quickstart' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'incident-management/incidents/how-to' },
								},
							],
						},
						{
							label: 'On-call schedules',
							items: [
								{ label: 'Overview', slug: 'incident-management/on-call/overview' },
								{ label: 'Quickstart', slug: 'incident-management/on-call/quickstart' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'incident-management/on-call/how-to' },
								},
							],
						},
						{
							label: 'Escalation policies',
							items: [
								{ label: 'Overview', slug: 'incident-management/escalation/overview' },
								{ label: 'Quickstart', slug: 'incident-management/escalation/quickstart' },
								{ label: 'Reference', slug: 'incident-management/escalation/reference' },
							],
						},
						{
							label: 'Notifications',
							items: [
								{ label: 'Overview', slug: 'incident-management/notifications/overview' },
								{ label: 'Channels reference', slug: 'incident-management/notifications/channels' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'incident-management/notifications/how-to' },
								},
							],
						},
						{
							label: 'Maintenance windows',
							items: [
								{ label: 'Overview', slug: 'incident-management/maintenance/overview' },
								{ label: 'Quickstart', slug: 'incident-management/maintenance/quickstart' },
								{
									label: 'How-to guides',
									autogenerate: { directory: 'incident-management/maintenance/how-to' },
								},
							],
						},
					],
				},
				{
					label: 'Status Pages',
					items: [
						{ label: 'Overview', slug: 'status-pages/overview' },
						{ label: 'Quickstart', slug: 'status-pages/quickstart' },
						{
							label: 'How-to guides',
							autogenerate: { directory: 'status-pages/how-to' },
						},
					],
				},
				{
					label: 'Dashboards',
					items: [
						{ label: 'Overview', slug: 'dashboards/overview' },
						{ label: 'Quickstart', slug: 'dashboards/quickstart' },
						{ label: 'Widget reference', slug: 'dashboards/reference' },
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'Overview', slug: 'integrations/overview' },
						{ label: 'Slack', slug: 'integrations/slack' },
						{ label: 'Microsoft Teams', slug: 'integrations/microsoft-teams' },
						{ label: 'Discord', slug: 'integrations/discord' },
						{ label: 'Telegram', slug: 'integrations/telegram' },
						{ label: 'Webhooks', slug: 'integrations/webhooks' },
					],
				},
				{
					label: 'SDK Reference',
					items: [
						{ label: 'Overview', slug: 'sdk/overview' },
					],
				},
				...openAPISidebarGroups,
				{
					label: 'Changelog',
					link: '/changelog/',
				},
			],
		}),
	],
});
