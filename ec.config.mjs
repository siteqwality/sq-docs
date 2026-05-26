/**
 * Expressive Code config — Atlas code blocks.
 *
 * This lives in ec.config.mjs rather than astro.config.mjs's Starlight
 * `expressiveCode` option on purpose: starlight-openapi's plugin overwrites
 * that option with `{ removeUnusedThemes: false }`, discarding any themes or
 * styleOverrides set there. astro-expressive-code merges ec.config.mjs in
 * separately, so this survives.
 *
 * Atlas code blocks are an always-dark ink panel (matching the landing page),
 * regardless of the site's light/dark theme. That is achieved by shipping two
 * visually identical dark themes — one typed `dark`, one typed `light` — so
 * whichever the site is in, the rendered panel is dark.
 */

// Warm syntax palette on the ink panel.
const tokenSettings = [
	{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#857F74', fontStyle: 'italic' } },
	{ scope: ['keyword', 'storage', 'keyword.control', 'keyword.operator', 'variable.language'], settings: { foreground: '#E78A66' } },
	{ scope: ['string', 'string.quoted', 'string.template', 'meta.attribute-selector'], settings: { foreground: '#A6C48F' } },
	{ scope: ['constant.numeric', 'constant.language', 'constant', 'support.constant'], settings: { foreground: '#E0A93A' } },
	{ scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: '#EDE6D6' } },
	{ scope: ['entity.name.tag', 'entity.name.tag.html'], settings: { foreground: '#E78A66' } },
	{ scope: ['entity.other.attribute-name', 'entity.name.tag.css'], settings: { foreground: '#E0A93A' } },
	{ scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: '#7FB3E0' } },
	{ scope: ['variable', 'variable.other', 'meta.object-literal.key'], settings: { foreground: '#DCD5C5' } },
	{ scope: ['punctuation', 'meta.brace', 'punctuation.separator'], settings: { foreground: '#8B857B' } },
];

const makeTheme = (name, type) => ({
	name,
	type,
	colors: {
		'editor.background': '#1A1816',
		'editor.foreground': '#DCD5C5',
	},
	settings: tokenSettings,
});

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
	// Two dark themes; the `light`-typed one keeps code dark in light mode too.
	themes: [makeTheme('atlas-dark', 'dark'), makeTheme('atlas-dark-alt', 'light')],
	// Don't let Starlight repaint the frame with the site's light UI palette.
	useStarlightUiThemeColors: false,
	styleOverrides: {
		borderRadius: '12px',
		borderColor: '#363029',
		codeFontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
		codeFontSize: '0.85rem',
		codeLineHeight: '1.7',
		frames: {
			editorActiveTabBackground: '#272320',
			editorActiveTabForeground: '#F0EBE0',
			editorActiveTabIndicatorTopColor: '#D14A2D',
			editorActiveTabIndicatorBottomColor: 'transparent',
			editorTabBarBackground: '#211E1B',
			editorTabBarBorderBottomColor: '#363029',
			editorBackground: '#1A1816',
			terminalBackground: '#1A1816',
			terminalTitlebarBackground: '#211E1B',
			terminalTitlebarForeground: '#8B857B',
			terminalTitlebarBorderBottomColor: '#363029',
			terminalTitlebarDotsForeground: '#6B665D',
			frameBoxShadowCssValue: '0 12px 32px -16px rgba(0, 0, 0, 0.5)',
			inlineButtonBorder: '#4A443B',
			inlineButtonForeground: '#8B857B',
			inlineButtonBackgroundHoverOrFocusOpacity: '0.12',
		},
	},
};
