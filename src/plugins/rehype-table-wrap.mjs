// Wraps every table in a scroll container so the frame spans the full width
// while wide tables still scroll sideways on narrow screens.
export default function rehypeTableWrap() {
	const wrap = (node) => {
		if (!node.children) return;
		node.children = node.children.map((child) => {
			if (child.type === 'element' && child.tagName === 'table') {
				markUrlBreaks(child, false);
				return {
					type: 'element',
					tagName: 'div',
					properties: { className: ['sl-table-wrap'] },
					children: [child],
				};
			}
			wrap(child);
			return child;
		});
	};
	return wrap;
}

// Long URLs in table code wrap at path boundaries: <wbr> after each lone "/", "?" or "&".
function markUrlBreaks(node, inCode) {
	if (!node.children) return;
	const here = inCode || (node.type === 'element' && node.tagName === 'code');
	node.children = node.children.flatMap((child) => {
		if (!(here && child.type === 'text')) {
			markUrlBreaks(child, here);
			return [child];
		}
		const parts = child.value.split(/(?<=[^/]\/|[?&])(?=[^/])/);
		return parts.flatMap((value, i) => [
			...(i ? [{ type: 'element', tagName: 'wbr', properties: {}, children: [] }] : []),
			{ type: 'text', value },
		]);
	});
}
