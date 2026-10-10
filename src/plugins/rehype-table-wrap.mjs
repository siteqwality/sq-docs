// Wraps every table in a scroll container so the frame spans the full width
// while wide tables still scroll sideways on narrow screens.
export default function rehypeTableWrap() {
	const wrap = (node) => {
		if (!node.children) return;
		node.children = node.children.map((child) => {
			if (child.type === 'element' && child.tagName === 'table') {
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
