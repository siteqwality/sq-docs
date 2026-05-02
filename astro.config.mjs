// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
					],
				},
				{
					label: 'Uptime Monitoring',
					items: [
						{ label: 'Overview', slug: 'uptime-monitoring/overview' },
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
				{
					label: 'API Reference',
					items: [
						{ label: 'Coming soon', slug: 'api-reference/overview' },
					],
				},
				{
					label: 'Changelog',
					link: '/changelog/',
				},
			],
		}),
	],
});
