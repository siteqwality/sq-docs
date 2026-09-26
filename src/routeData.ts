import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// Starlight always emits its own generic `shortcut icon`. Drop it so every page
// links exactly the icon set siteqwality.com does (the `head` entries in
// astro.config.mjs); a trailing no-media SVG would override the dark variant.
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	route.head = route.head.filter((entry) => entry.attrs?.rel !== 'shortcut icon');
});
