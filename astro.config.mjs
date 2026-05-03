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
					],
				},
				{
					label: 'Observability',
					items: [
						{ label: 'Overview', slug: 'observability/overview' },
					],
				},
				{
					label: 'Incident Management',
					items: [
						{ label: 'Overview', slug: 'incident-management/overview' },
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
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'Overview', slug: 'integrations/overview' },
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
