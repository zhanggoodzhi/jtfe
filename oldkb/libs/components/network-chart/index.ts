import * as d3 from 'd3';
import {throttle} from 'lodash';

interface INodeData {
	uri: string;
	type: number;
	label: string;
	rels?: {
		label: string;
		uri: string;
	}[];
	target?: INodeData[];
	origin?: INodeData[];
	showLinks?: INodeData[];
	open?: boolean;
	show?: boolean;
	focus?: boolean;
	hover?: boolean;
	x?: number;
	y?: number;
}

interface INetworkChartOptions {
	data: INodeData[];
	onOpened(this: NetworkChart, node: INodeData): void;
}

export class NetworkChart {
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private _simulation: d3.Simulation<any, any>;
	private _link;
	private _radius: number;
	private _width: number;
	private _height: number;
	private _data: INodeData[];
	private _filterData: INodeData[];
	private _options: INetworkChartOptions;
	static colors = ['#E6DB74', '#AE81FF', '66D9EF'];
	static commonColor = '#666';
	static highlightColor = '#F92672';

	constructor(canvas: HTMLCanvasElement, options: INetworkChartOptions) {
		this._options = options;
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._radius = 30;
		this._width = canvas.width;
		this._height = canvas.height;
		this._data = options.data;

		this.init();
	}
	private dragsubject = () => {
		return this._simulation.find(d3.event.x, d3.event.y, this._radius);
	}

	private dragstarted = () => {
		if (!d3.event.active) {
			this._simulation.alphaTarget(0.3).restart();
		}
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	}

	private dragged = () => {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	}

	private dragended = () => {
		if (!d3.event.active) {
			this._simulation.alphaTarget(0);
		}
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}

	private getArrowData(start, end) {
		const arrowLength = 10,
			x0 = start.x, y0 = start.y,
			x1 = end.x, y1 = end.y,
			t = Math.atan2(y1 - y0, x1 - x0),
			dt = Math.PI * 0.85;

		return {
			right: {
				x: arrowLength * Math.cos(t + dt) + x1,
				y: arrowLength * Math.sin(t + dt) + y1
			},
			left: {
				x: arrowLength * Math.cos(t - dt) + x1,
				y: arrowLength * Math.sin(t - dt) + y1
			}
		};
	}

	private updateData() {
		const data = this._data;
		if (data.length <= 1) {
			return;
		}

		data.forEach(node => {
			if (!node.rels) {
				return;
			}
			node.target = [];
			node.rels.forEach(rel => {
				const link = this.findNodeByUri(rel.uri);
				if (!link) {
					return;
				}

				if (!link.origin) {
					link.origin = [];
				}

				if (link.origin.indexOf(node) < 0) {
					link.origin.push(node);
				}

				if (node.target.indexOf(link) < 0) {
					node.target.push(link);
				}
			});
		});

		data.forEach(node => {
			if (node.origin && node.target) {
				const remove = [];
				node.target.forEach((t, i) => {
					if (node.origin.indexOf(t) > -1 && node.rels[i].label === 'rdf:type') {
						remove.push(i);
					}
				});


				for (let i = 0; i < remove.length; i++) {
					node.rels.splice(remove[i] - i, 1);
					node.target.splice(remove[i] - i, 1);
				}


				if (node.rels.length <= 0) {
					delete node.rels;
					delete node.target;
				}
			}
		});
	}

	private updateState() {
		this._filterData.forEach(node => {
			let open = true;

			const showLinks = [];

			if (node.origin) {
				node.origin.forEach(n => {
					if (!n.show) {
						open = false;
					} else {
						showLinks.push(n);
					}
				});
			}

			if (node.target) {
				node.target.forEach(n => {
					if (!n.show) {
						open = false;
					} else {
						showLinks.push(n);
					}
				});
			}

			if (showLinks.length > 0) {
				node.showLinks = showLinks;
			}

			node.open = open;
		});

	}

	private filterData = () => {
		const links = [];

		this._filterData = this._data.filter(node => node.show);
		this._simulation.nodes(this._filterData);

		this._filterData.forEach(node => {
			if (node.target) {
				node.target.forEach(link => {
					if (link.show) {
						links.push({
							source: node.uri,
							target: link.uri
						});
					}
				});
			}
		});

		this.updateState();

		this._link.links(links);

	}

	private init() {
		const canvas = this._canvas,
			width = this._width,
			height = this._height,
			r = this._radius,
			triggerHover = throttle((node) => {
				let focus = false;
				this._filterData.forEach(n => {
					if (n.focus) {
						focus = true;
					}

					n.hover = false;
				});

				if (node && !focus) {
					node.hover = true;
				}

				this.draw();
			}, 200);

		this._ctx.lineWidth = 2;

		this._link = d3.forceLink()
			.id((node: INodeData) => node.uri)
			.distance(r * 8);

		this._simulation = d3.forceSimulation()
			.force('link', this._link)
			.force('collide', d3.forceCollide(r))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(width / 2, height / 2))
			.on('tick', this.draw);

		this.updateData();

		this.filterData();

		d3.select(canvas)
			.on('dblclick', this.switchNode)
			.on('click', () => {
				const node = this.getEvtNode();
				this._filterData.forEach(n => {
					n.focus = false;
				});

				if (node) {
					node.focus = true;
				}

				this.draw();
			})
			.on('mousemove', () => {
				const node = this.getEvtNode();
				triggerHover(node);
			})
			.call(
			d3.drag()
				.container(canvas)
				.subject(this.dragsubject)
				.on('start', this.dragstarted)
				.on('drag', this.dragged)
				.on('end', this.dragended)
			);

	}

	private draw = () => {
		const ctx = this._ctx;
		ctx.clearRect(0, 0, this._width, this._height);

		ctx.save();

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		this._filterData.forEach(this.drawLink);

		this._filterData.forEach(this.drawNode);

		ctx.restore();
	}

	private drawLink = (d: INodeData) => {
		const ctx = this._ctx,
			[dx, dy] = [d.x, d.y];

		if (d.target) {

			ctx.beginPath();
			d.target.forEach((link: INodeData, index) => {
				const rel = d.rels[index],
					colors = NetworkChart.colors;
				if (!link.show) {
					return;
				}

				const [lx, ly] = [link.x, link.y],
					[ax, ay] = [lx - (lx - dx) * 0.4, ly - (ly - dy) * 0.4],
					arrow = this.getArrowData({ x: dx, y: dy }, { x: ax, y: ay });

				ctx.moveTo(dx, dy);
				ctx.lineTo(lx, ly);

				ctx.moveTo(ax, ay);
				ctx.lineTo(arrow.left.x, arrow.left.y);
				ctx.lineTo(arrow.right.x, arrow.right.y);
				ctx.lineTo(ax, ay);

				if (d.focus || d.hover) {
					ctx.fillText(rel.label, ax, ay);
				}

				if (rel.label === 'has individual') {
					ctx.strokeStyle = colors[0];
					ctx.fillStyle = colors[0];
				} else {
					ctx.strokeStyle = colors[1];
					ctx.fillStyle = colors[1];
				}

				if (d.focus || d.hover) {
					ctx.strokeStyle = NetworkChart.highlightColor;
					ctx.fillStyle = NetworkChart.highlightColor;
				}

				ctx.stroke();
				ctx.fill();

			});

		}
	}

	private drawNode = (d: INodeData) => {
		const ctx = this._ctx,
			r = this._radius;

		ctx.beginPath();

		switch (d.type) {
			case 1:
				ctx.rect(d.x - r, d.y - r, r * 2, r * 2);
				break;
			case 2:
				ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
				break;
			default:
				return;
		}


		ctx.strokeStyle = NetworkChart.commonColor;
		ctx.fillStyle = '#fff';

		if (d.focus || d.hover) {
			ctx.strokeStyle = NetworkChart.highlightColor;
		}
		ctx.fill();

		ctx.stroke();

		ctx.fillStyle = NetworkChart.commonColor;
		ctx.fillText(d.label, d.x, d.y);

		if (d.target) {
			ctx.fillText(d.open ? '-' : '+', d.x, d.y + 15);
		}
	}

	private switchNode = (d: INodeData) => {
		const evtNode = this.getEvtNode();

		if (evtNode) {
			const node = this.findNodeByUri(evtNode.uri);
			if (!node.target && !node.origin) {
				return;
			}


			if (!node.open) {
				node.open = true;
				node.target.forEach(n => {
					n.show = true;
				});
				if (node.origin) {
					node.origin.forEach(n => {
						n.show = true;
					});
				}
				if (this._options.onOpened) {
					this._options.onOpened.call(this, node);
				}
			} else {
				node.open = false;
				// 关闭根节点
				if (!node.origin) {
					this.data.forEach(n => {
						if (n.origin) {
							n.show = false;
						}
					});
				} else {
					this.hideNode(node, node.target);
				}
			}

			this.filterData();

			this.draw();
		}
	}

	private hideNode = (parent: INodeData, links: INodeData[]) => {
		if (!links) {
			return;
		}
		links.forEach(link => {
			if (link.origin) {
				for (let o of link.origin) {
					if (o !== parent && o.show && link.showLinks && link.showLinks.indexOf(o) > -1) {
						return;
					}
				}
			}

			link.show = false;

			this.updateState();

			this.hideNode(link, link.target);
		});
	}

	private findNodeByUri = (uri: string): INodeData => {
		for (let node of this._data) {
			if (uri === node.uri) {
				return node;
			}
		}
	}

	private getEvtNode = () => {
		const current = d3.mouse(this._canvas),
			node = this._simulation.find(current[0], current[1], this._radius);

		return node;
	}



	public append(data: INodeData[]) {
		data.forEach(d => {
			if (!d.x && !d.y) {
				Object.assign(d, {
					x: this._width / 2,
					y: this._height / 2
				});
			}
		});
		this._data.push(...data);
		this.updateData();
		this.filterData();
		this.draw();
	}

	public has(uri: string) {
		return !!this.findNodeByUri(uri);
	}

	get data() {
		return this._data;
	}
}
