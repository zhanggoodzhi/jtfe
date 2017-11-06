// import * as utils from 'utils';
// import { Tree } from 'tree';
// import * as d3 from 'd3';
// let chart: any;
// let jstree: any;
// export function initChart() {
// 	utils.tabShown($('#chart-link'), (e) => {
// 		utils.setScroll();
// 		initJsTree();
// 		initD3Chart();
// 	});
// 	// $('#chart-link').click();
// }
// function initJsTree() {
// 	const el = $('#chart-jstree');
// 	jstree = new Tree({
// 		el: el,
// 		data: [
// 			{ 'id': 'ajson1', 'parent': '#', 'text': 'Simple root node' },
// 			{ 'id': 'ajson2', 'parent': '#', 'text': 'Root node 2' },
// 			{ 'id': 'ajson3', 'parent': 'ajson2', 'text': 'Child 1' },
// 			{ 'id': 'ajson4', 'parent': 'ajson2', 'text': 'Child 2' }
// 		],
// 		jstree: {
// 			plugins: ['dnd', 'types', 'search'],
// 			types: {
// 				'#': {
// 					max_children: 1
// 				}
// 			}
// 		},
// 		ready: function () {
// 			this.openFirst();
// 		}
// 	}).tree;
// 	el.on('changed.jstree', function (e, data) {
// 		jstreeClick(data.node);
// 	});
// }
// function jstreeClick(node) {
// 	chart.addNodes([{
// 		id: node.id
// 	}]);
// }
// function initD3Chart() {
// 	const nodes = [
// 		{
// 			id: '1'
// 		}, {
// 			id: '2',
// 			expand: true
// 		}, {
// 			id: '3'
// 		}, {
// 			id: '4'
// 		}];

// 	const links = [
// 		{
// 			source: '1',
// 			target: '2'
// 		}, {
// 			source: '1',
// 			target: '4'
// 		}, {
// 			source: '3',
// 			target: '4'
// 		}];
// 	chart = new D3Chart({
// 		el: $('#d3-chart'),
// 		nodes: nodes,
// 		links: links,
// 		getChildData: (id) => {
// 			return {
// 				nodes: [
// 					{
// 						id: '5'
// 					}, {
// 						id: '6'
// 					}, {
// 						id: '7'
// 					}, {
// 						id: '8'
// 					}, {
// 						id: '9'
// 					}],
// 				links: [
// 					{
// 						source: '2',
// 						target: '5'
// 					}, {
// 						source: '2',
// 						target: '6'
// 					}, {
// 						source: '5',
// 						target: '7'
// 					}, {
// 						source: '6',
// 						target: '8'
// 					}, {
// 						source: '8',
// 						target: '9'
// 					}]
// 			};
// 		}
// 	});
// }

// interface ID3ChartOptions {
// 	el: JQuery;
// 	nodes: any;
// 	links: any;
// 	getChildData: (id: string) => any;
// }
// class D3Chart {
// 	private options: ID3ChartOptions;
// 	private force;// 力布局
// 	private nodes;// 节点
// 	private links;// 连线
// 	private svg;// svg标签
// 	private box;// 最大的g标签
// 	constructor(options: ID3ChartOptions) {
// 		const defaultOptions = {

// 		};
// 		this.options = Object.assign(defaultOptions, options);
// 		this.init();
// 	}
// 	private init() {
// 		const wrap = this.options.el.parent(),
// 			w = wrap.width(),
// 			h = wrap.height() - 18;
// 		this.force = d3.layout.force().gravity(.05).linkDistance(250).charge(-400).size([w, h]);
// 		this.nodes = this.force.nodes();
// 		this.links = this.force.links();
// 		this.options.el.append('<svg></svg>');
// 		this.svg = d3.select('svg')
// 			.attr('width', w)
// 			.attr('height', h)
// 			.attr('pointer-events', 'all')
// 			.call(d3.behavior.zoom()
// 				.scaleExtent([0.1, 10]) // 用于设置最小和最大的缩放比例
// 				.on('zoom', () => {// 缩放功能
// 					const e = d3.event as any;
// 					this.box.attr('transform', 'translate(' + e.translate + ')scale(' + e.scale + ')');
// 				}));
// 		this.box = this.svg
// 			.append('g')
// 			.attr('class', 'box');
// 		// 画箭头模板
// 		this.box.append('defs')
// 			.append('marker')
// 			.attr('id', 'arrow')
// 			.attr('markerUnits', 'userSpaceOnUse')
// 			.attr('viewBox', '0 -5 10 10') // 坐标系的区域
// 			.attr('refX', 32) // 箭头坐标
// 			.attr('refY', -1)
// 			.attr('markerWidth', 12) // 标识的大小
// 			.attr('markerHeight', 12)
// 			.attr('orient', 'auto') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
// 			.attr('stroke-width', 2) // 箭头宽度
// 			.append('path')
// 			.attr('d', 'M0,-5L10,0L0,5') // 箭头的路径
// 			.attr('fill', '#000000'); // 箭头颜色

// 		// 监听每一步的运动
// 		this.force.on('tick', (x) => {
// 			this.box.selectAll('.node')
// 				.attr('transform', (d) => {
// 					return 'translate(' + d.x + ',' + d.y + ')';
// 				});

// 			this.box.selectAll('line.link')
// 				.attr('x1', (d) => {
// 					return d.source.x;
// 				})
// 				.attr('y1', (d) => {
// 					return d.source.y;
// 				})
// 				.attr('x2', (d) => {
// 					return d.target.x;
// 				})
// 				.attr('y2', (d) => {
// 					return d.target.y;
// 				});
// 		});
// 		this._addNodes(this.options.nodes);
// 		this._addLinks(this.options.links);
// 		this.update();
// 	}
// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {any} node
// 	 * 增加单个节点
// 	 * @memberOf D3Chart
// 	 */
// 	private addNode(node) {
// 		this.nodes.push(node);
// 	}
// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {any} nodes
// 	 * 增加多个节点
// 	 * @memberOf D3Chart
// 	 */
// 	private _addNodes(nodes) {
// 		if (Object.prototype.toString.call(nodes) === '[object Array]') {
// 			for (let node of nodes) {
// 				this.addNode(node);
// 			}
// 		}
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {any} source
// 	 * @param {any} target
// 	 * 增加单个连线
// 	 * @memberOf D3Chart
// 	 */
// 	private addLink(source, target) {
// 		this.links.push({
// 			source: this.findNode(source),
// 			target: this.findNode(target)
// 		});
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {any} links
// 	 * 增加多个连线
// 	 * @memberOf D3Chart
// 	 */
// 	private _addLinks(links) {
// 		if (Object.prototype.toString.call(links) === '[object Array]') {
// 			for (let link of links) {
// 				this.addLink(link.source, link.target);
// 			}
// 		}
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {any} id
// 	 * 删除单个节点
// 	 * @memberOf D3Chart
// 	 */
// 	private removeNode(id) {
// 		let i = 0,
// 			node = this.findNode(id),
// 			links = this.links;
// 		for (let link of links) {
// 			if (link.source === node || link.target === node) {
// 				links.splice(i, 1);
// 			}
// 		}
// 		this.nodes.splice(this.findNodeIndex(id), 1);
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {string} id
// 	 * @returns
// 	 * 移除所有子节点
// 	 * @memberOf D3Chart
// 	 */
// 	private removeChildNodes(id: string) {
// 		const thisNode = this.findNode(id),
// 			links = this.links;
// 		let ifLast: boolean = true;
// 		let linksToDelete = [],// 待删除连线
// 			childNodes = [];// 待删除子节点

// 		links.map((link) => {
// 			if (link.source === thisNode) {
// 				linksToDelete.push(link);
// 				childNodes.push(link.target);
// 				ifLast = false;
// 			}
// 		});

// 		if (ifLast) { // 如果是叶子节点，跳出函数
// 			return;
// 		}
// 		linksToDelete.map((link) => {
// 			for (let i = 0; i < this.links.length; i++) {
// 				if (this.links[i] === link) {
// 					this.links.splice(i, 1);
// 					i--;
// 				}
// 			}
// 		});

// 		for (let node of childNodes) {
// 			this.removeChildNodes(node.id); // 递归删除孩子节点的所有子节点
// 		}
// 		for (let node of childNodes) {// 删除孩子节点
// 			this.removeNode(node.id);
// 		}
// 	}
// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {string} id
// 	 * @returns
// 	 * 根据ID找节点
// 	 * @memberOf D3Chart
// 	 */
// 	private findNode(id: string) {
// 		const nodes = this.nodes;
// 		for (let node of nodes) {
// 			if (node.id === id) {
// 				return node;
// 			}
// 		}
// 		return null;
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @private
// 	 * @param {string} id
// 	 * @returns
// 	 * 找节点的索引
// 	 * @memberOf D3Chart
// 	 */
// 	private findNodeIndex(id: string) {
// 		const nodes = this.nodes;
// 		nodes.map((node, index) => {
// 			if (node.id === id) {
// 				return index;
// 			}
// 		});
// 		return -1;
// 	}

// 	/**
// 	 *
// 	 *
// 	 * @public
// 	 * 更新力导图
// 	 * @memberOf D3Chart
// 	 */
// 	private update() {
// 		// 刷新边
// 		const link = this.box.selectAll('line.link')
// 			.data(this.links)
// 			.attr('class', 'link');
// 		link.enter()
// 			.insert('line', '.node')
// 			.attr('class', 'link');
// 		link.exit()
// 			.remove();
// 		let nodes = this.box.selectAll('.node')
// 			.data(this.nodes);
// 		const nodeEnter = nodes
// 			.enter().append('g')
// 			.on('click', (node) => {// 单击事件
// 				if ((d3.event as Event).defaultPrevented) {// 使拖拽时不触发点击事件
// 					return;
// 				}
// 				this.box.selectAll('line.link')
// 					.style('stroke-width', (line) => {
// 						if (node.id === line.source.id || node.id === line.target.id) {
// 							return 4;
// 						} else {
// 							return 0.5;
// 						}
// 					});
// 			})
// 			.on('dblclick', (node) => {// 双击事件
// 				(d3.event as Event).stopPropagation();
// 				if (node.expand) {
// 					if (!node._expanded) {
// 						node._expanded = true;
// 						this.expandNode(node.id);
// 					} else {
// 						node._expanded = false;
// 						this.collapseNode(node.id);
// 					}
// 				}
// 			})
// 			.attr('class', (node) => {
// 				let classname = 'node ';
// 				if (node.expand) {
// 					classname += 'can_expand ';
// 					classname += node._expanded ? 'minus' : 'add';
// 				}
// 				return classname;
// 			})
// 			.call(d3.behavior.drag()
// 				.on('dragstart', (d: any) => {
// 					d.fixed |= 2;
// 					(d3.event as any).sourceEvent.stopPropagation(); // 阻止冒泡
// 				})
// 				.on('drag', (d: any) => {
// 					const e = d3.event as any;
// 					d.x += e.dx;
// 					d.y += e.dy;
// 					d.px += e.dx;
// 					d.py += e.dy;
// 					this.force.resume();
// 				})
// 				.on('dragend', function (d) {
// 					(d as any).fixed &= ~6;
// 				})
// 			);
// 		// 增加节点
// 		nodeEnter.append('circle')
// 			.attr('r', 28)
// 			.style('fill', '#F6E8E9')
// 			.style('stroke', '#B43232');

// 		nodeEnter.append('text')
// 			.attr('class', 'nodetext')
// 			.attr('dx', -2)
// 			.attr('dy', 3)
// 			.text(function (d) {
// 				return d.id;
// 			});
// 		nodes.exit().remove();
// 		this.force.start();
// 	}
// 	private expandNode(id: string) {
// 		const childData = this.options.getChildData(id);
// 		this._addNodes(childData.nodes);
// 		this._addLinks(childData.links);
// 		this.update();
// 	}
// 	private collapseNode(id: string) {
// 		this.removeChildNodes(id);
// 		this.update();
// 	}

// 	/**
// 	 *
// 	 *
// 	 * 删除实例的图像
// 	 * @memberOf D3Chart
// 	 */
// 	public destory() {
// 		this.svg.remove();
// 		this.force = null;
// 	}

// 	/**
// 	 *
// 	 * 增加节点并渲染
// 	 * @param {any} nodes
// 	 *
// 	 * @memberOf D3Chart
// 	 */
// 	public addNodes(nodes) {
// 		this._addNodes(nodes);
// 		this.update();
// 	}

// 	/**
// 	 *
// 	 * 增加连线并渲染
// 	 * @param {any} links
// 	 *
// 	 * @memberOf D3Chart
// 	 */
// 	public addLinks(links) {
// 		this._addLinks(links);
// 		this.update();
// 	}
// }
