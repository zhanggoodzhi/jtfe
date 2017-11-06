import {NetChart} from 'net-chart';
import * as utils from 'utils';
// export function initChart() {
// 	utils.tabShown($('#chart-link'), (e) => {
// 		utils.setScroll();

// 		const canvas = document.getElementById('network-chart') as HTMLCanvasElement,
// 			parent = canvas.parentElement;

// 		Object.assign(canvas, {
// 			width: parent.offsetWidth,
// 			height: parent.offsetHeight
// 		});

// 		$.ajax('/onto_graf/node', {
// 			type: 'POST'
// 		})
// 			.done((data) => {
// 				Object.assign(data, {
// 					show: true,
// 					open: false
// 				});
// 				const graphData = [
// 					data
// 				];

// 				const chart = new NetworkChart(canvas, {
// 					data: graphData,
// 					onOpened: function (node) {
// 						if (node.target) {
// 							const uris = [];
// 							node.target.forEach(t => {
// 								if (t.rels) {
// 									t.rels.forEach(r => {
// 										const uri = r.uri;
// 										if (!this.has(uri) && uris.indexOf(uri) < 0) {
// 											uris.push(uri);
// 										}
// 									});
// 								}
// 							});

// 							if (uris.length > 0) {
// 								getNodesData(uris, (nodesData) => {
// 									chart.append(nodesData);
// 								});
// 							}
// 						}
// 					}
// 				});

// 				getNodesData(data.rels.map(node => node.uri), (nodes) => {
// 					chart.append(nodes);
// 				});
// 			});
// 	});
// }


// function getNodesData(uris, cb) {
// 	$.ajax('/onto_graf/nodes', {
// 		type: 'POST',
// 		traditional: true,
// 		data: {
// 			uris: uris
// 		}
// 	})
// 		.done(cb);
// }


export function initChart() {
	utils.tabShown($('#chart-link'), (e) => {
		const svg = $('#net-chart'),
			par = svg.parent();

		const chart = new NetChart({
			svg: svg.get(0) as any,
			width: par.width(),
			height: par.height()
		});

		$('#reflow-btn').on('click', () => {
			chart.reflow();
		});

	});
}
