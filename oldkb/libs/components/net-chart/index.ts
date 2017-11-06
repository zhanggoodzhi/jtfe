import {uniq} from 'lodash';
import * as d3 from 'd3';

interface IProps {
	svg: SVGElement;
	width: number;
	height: number;
}


interface IRel {
	label: string;
	uri: string;
}

interface INode {
	label: string;
	type: string;
	uri: string;
	rels: IRel[];
	hasLink?: boolean;
	idsOfLinksTo?: string[];
	idsOfLinksFrom?: string[];
	visible?: boolean;
	open?: boolean;
	x?: number;
	y?: number;
	active?: boolean;
}


interface ILink {
	id: string;
	label: string;
	source: INode;
	target: INode;
	visible?: boolean;
}


export class NetChart {
	private styles: {
		[key: string]: {
			marker: string;
			color: string;
		}
	} = {
		'has subclass': {
			marker: '#arrowhead-subclass',
			color: '#AE81FF'
		},
		'has individual': {
			marker: '#arrowhead-individual',
			color: '#E6DB74'
		}
	};
	private svg: d3.Selection<any, any, d3.BaseType, {}>;
	private g: d3.Selection<any, any, d3.BaseType, {}>;
	private nodesList: INode[] = [];
	private nodesMap: {
		[key: string]: INode;
	} = {};

	private linksList: ILink[] = [];

	private linksMap: {
		[key: string]: ILink;
	} = {};

	private links: d3.Selection<any, any, d3.BaseType, {}>;

	private nodes: d3.Selection<any, any, d3.BaseType, {}>;

	private positions: { x: number; y: number }[];

	public constructor(private props: IProps) {

		const svg = d3.select(props.svg),

			g = svg.append('g');

		svg
			.attr('width', props.width)
			.attr('height', props.height);

		this.links = g.append('g').selectAll('.link');

		this.nodes = g.append('g').selectAll('.node');

		this.g = g;

		this.svg = svg;

		this.init();
	}

	private fetchRootData() {
		const config = {
			url: '/onto_graf/node',
			type: 'POST'
		};

		return $.ajax(config)
			.then(res => {
				return this.insertNodes([res]);
			});
	}

	private fetchNodesData(nodes: INode[]) {
		const uris = this.getNodesRels(nodes);

		if (uris.length <= 0) {
			return jQuery.Deferred()
				.resolve({
					nodes: [],
					change: false
				});
		}

		const config = {
			type: 'POST',
			traditional: true,
			url: '/onto_graf/nodes',
			data: {
				uris
			}
		};

		return $.ajax(config)
			.then(res => {
				return this.insertNodes(res);
			});
	}


	private insertNodes(nodes: INode[]): {
		nodes: INode[],
		change: boolean;
	} {
		let change = false;
		const {positions} = this,
			len = positions.length,
			currentIndex = this.nodesList.length;
		nodes.forEach((node, index) => {
			if (!this.nodesMap.hasOwnProperty(node.uri)) {
				const position = positions[(currentIndex + index) % len];

				change = true;
				Object.assign(node, {
					visible: false,
					x: position.x,
					y: position.y
				} as INode);
				this.nodesList.push(node);
				this.nodesMap[node.uri] = node;
			}
		});

		this.nodesList.forEach(node => {
			const hasLink = node.rels && node.rels.length > 0;
			node.hasLink = hasLink;

			if (hasLink) {
				node.idsOfLinksTo = [];
				node.rels.forEach(rel => {
					const target = this.nodesMap[rel.uri];
					const id = node.uri + '-' + rel.uri;
					node.idsOfLinksTo.push(id);
					if (target && !this.linksMap.hasOwnProperty(id)) {
						if (!target.idsOfLinksFrom) {
							target.idsOfLinksFrom = [];
						}
						target.idsOfLinksFrom.push(id);
						const link: ILink = {
							visible: false,
							source: node,
							label: rel.label,
							target,
							id
						};

						this.linksList.push(link);
						this.linksMap[id] = link;
					}
				});
			}
		});

		return {
			nodes: nodes,
			change
		};
	}


	private ticked = () => {
		this.links
			.selectAll('line')
			.attr('x1', (d: ILink) => d.source.x)
			.attr('y1', (d: ILink) => d.source.y)
			.attr('x2', (d: ILink) => d.target.x)
			.attr('y2', (d: ILink) => d.target.y);

		this.links
			.selectAll('text')
			.attr('x', (d: ILink) => (d.source.x + d.target.x) / 2)
			.attr('y', (d: ILink) => (d.source.y + d.target.y) / 2);


		this.nodes.attr('transform', (d: INode) => `translate(${d.x},${d.y})`);
	}

	private closeLink = (id: string) => {
		const {linksMap} = this,
			link = linksMap[id];

		if (!link) {
			return;
		}

		const target = link.target;

		link.visible = false;

		const visibleLinksOfTargetFrom = target.idsOfLinksFrom.filter(
			linkId => {
				const l = linksMap[linkId];
				return l && l.visible;
			}
		);

		// 存在其他节点链接至该节点
		if (visibleLinksOfTargetFrom.length > 0) {
			return;
		}

		target.visible = false;

		if (target.hasLink) {
			target.idsOfLinksTo.forEach(linkId => {
				const l = linksMap[linkId];
				if (l && l.visible) {
					this.closeLink(linkId);
				}
			});
			// // 有子链接
			// const visibleLinksOfTargetTo = target.idsOfLinksTo.filter(
			// 	linkId => {
			// 		const l = linksMap[linkId];
			// 		return l && l.visible;
			// 	}
			// );

			// // 仅有一个子链接时
			// if (visibleLinksOfTargetTo.length < 2) {
			// 	target.visible = false;

			// 	visibleLinksOfTargetTo.forEach(linkId => {
			// 		this.closeLink(linkId);
			// 	});
			// }
		}

	}

	private start() {
		// nodes
		const nodesVisible = this.nodesList.filter(node => node.visible);
		const {linksMap} = this;

		nodesVisible.forEach(node => {
			if (node.hasLink) {
				let couldOpen = false;

				for (const id of node.idsOfLinksTo) {
					const link = linksMap[id];
					if (!link || !link.visible) {
						couldOpen = true;
						break;
					}
				}
				node.open = !couldOpen;
			}
		});

		let nodes = this.nodes.data(nodesVisible, (d: INode) => d.uri);

		nodes.exit().remove();

		const appendedNodes = nodes.enter()
			.append('g')
			.attr('data-type', (d: INode) => d.type);

		nodes = nodes.merge(appendedNodes);

		appendedNodes.filter((d: INode) => d.type === '1')
			.append('rect')
			.attr('x', -27)
			.attr('y', -27)
			.attr('width', 54)
			.attr('height', 54);

		appendedNodes.filter((d: INode) => d.type === '2')
			.append('circle')
			.attr('r', 30);

		appendedNodes.append('text')
			.text((d: INode) => {
				const {label} = d;
				return d.label;
			})
			.append('title')
			.text((d: INode) => d.label);

		appendedNodes.filter((d: INode) => d.hasLink)
			.append('use')
			.attr('x', '-6')
			.attr('y', '6')
			.on('click', (d: INode, ...rest) => {
				const e = d3.event;
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
				const open = d.open;
				if (open) {
					d.idsOfLinksTo.forEach(this.closeLink);
					this.start();
				} else {
					(this.fetchNodesData([d]) as any)
						.then(() => {
							for (const id of d.idsOfLinksTo) {
								const link = linksMap[id];
								link.visible = true;
								link.target.visible = true;
							}

							this.start();
						});

				}
			});

		appendedNodes.on('click', (d: INode) => {
			const e = d3.event;
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (d.active) {
				d.active = false;
			} else {
				this.nodesList.forEach(node => {
					node.active = false;
				});

				d.active = true;
			}


			this.start();
		});

		nodes.selectAll('use')
			.attr('xlink:href', (d: INode) => d.open ? '#remove' : '#add');

		nodes.filter((d: INode) => d.active)
			.classed('active', true);

		nodes.attr('class', (d: INode) => d.active ? 'node active' : 'node');

		// links
		const linksVisible = this.linksList.filter(link => link.visible);

		let links = this.links.data(linksVisible, (d: ILink) => d.id);

		links.exit().remove();

		const appendedLinks = links.enter()
			.append('g')
			.attr('data-type', (d: ILink) => d.label);

		links = appendedLinks.merge(links);

		appendedLinks.append('line');

		appendedLinks.append('text')
			.text((d: ILink) => d.label);

		links.attr('class', (d: ILink) => d.source.active ? 'link active' : 'link');

		links.selectAll('line')
			.attr('marker-end', (d: ILink) => {
				const style = this.styles[d.label];

				let marker = '#arrowhead';

				if (d.source.active) {
					marker = '#arrowhead-active';
				} else if (style) {
					marker = style.marker;
				}

				return `url(${marker})`;
			})
			.attr('stroke', (d: ILink) => {
				const style = this.styles[d.label];

				let color = '#666';

				if (d.source.active) {
					color = '#1f9ee8';
				} else if (style) {
					color = style.color;
				}

				return color;
			});


		// end

		const simulation = d3.forceSimulation(nodesVisible)
			.force('collide', d3.forceCollide(30))
			.on('tick', this.ticked);

		const dragstarted = (d) => {
			if (!d3.event.active) {
				simulation.alphaTarget(0.3).restart();
			}
			;
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = (d) => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		};

		const dragended = (d) => {
			if (!d3.event.active) {
				simulation.alphaTarget(0);
			}
			d.fx = null;
			d.fy = null;
		};

		const drag = d3.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);

		this.nodes = nodes.call(drag);
		this.links = links;
	}

	private getNodesRels(nodes: INode[]) {
		return uniq(
			nodes.reduce(
				(rels, node) => rels.concat(node.rels),
				[] as IRel[]
			)
				.map(rel => rel.uri)
				.filter(relUri => !this.nodesMap.hasOwnProperty(relUri))
		);
	}


	private buildPostions = () => {
		let {width, height} = this.props;
		const t = d3.zoomTransform(this.props.svg),
			k = t ? t.k : 1;

		width /= k;
		height /= k;

		const rows = Math.floor(height / 120),
			columns = Math.floor(width / 120);

		const positions = [];

		const baseNumber = Math.floor(width / 300);

		const y = t.invertY(0),
			x = t.invertX(0);

		for (let i = 0; i < columns; i++) {
			let columNumber = i * baseNumber + 1;
			if (columNumber > rows) {
				columNumber = rows;
			}

			const top = (height - columNumber * 120) / 2 + 60;

			for (let j = 0; j < columNumber; j++) {
				positions.push({
					x: x + 80 + 120 * i,
					y: y + top + j * 120
				});
			}
		}


		return positions;
	}

	private init() {
		this.positions = this.buildPostions();

		this.svg.call(
			d3.zoom()
				.scaleExtent([1 / 3, 3])
				.on('zoom', () => {
					const e = d3.event;
					if (e) {
						const t = e.transform;
						this.g.attr('transform', t.toString());
					}
				})
		);

		this.fetchRootData()
			.then(({nodes}) => {
				return this.fetchNodesData(nodes);
			})
			.then(() => {
				this.nodesList.forEach(node => {
					node.visible = true;
				});

				this.linksList.forEach(link => {
					link.visible = true;
				});

				this.start();
			});
		// .then(({ nodes }) => {
		// 	this.fetchNodesData(nodes);
		// });
	}


	public reflow() {
		const positions = this.buildPostions(),
			len = positions.length;

		this.nodesList.forEach((node, index) => {
			Object.assign(node, positions[index % len]);
		});

		this.positions = positions;

		this.start();
	}

}


