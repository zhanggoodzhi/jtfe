import 'particles.js';
import './index.less';
namespace Primary {
	declare const particlesJS;
	$(() => {
		const config = {
			particles: {
				number: {
					value: 20,
					density: {
						enable: true,
						value_area: 750
					}
				},
				color: {
					value: '#e1e1e1'
				},
				shape: {
					type: 'circle',
					stroke: {
						width: 0,
						color: '#000000'
					},
					polygon: {
						nb_sides: 5
					}
				},
				opacity: {
					value: .45,
					random: false,
					anim: {
						enable: false,
						speed: 1,
						opacity_min: .1,
						sync: false
					}
				},
				size: {
					value: 15,
					random: true,
					anim: {
						enable: false,
						speed: 180,
						size_min: .1,
						sync: false
					}
				},
				line_linked: {
					enable: true,
					distance: 650,
					color: '#cfcfcf',
					opacity: .26,
					width: 1
				},
				move: {
					enable: true,
					speed: 2,
					direction: 'none',
					random: true,
					straight: false,
					out_mode: 'out',
					bounce: false,
					attract: {
						enable: false,
						rotateX: 600,
						rotateY: 1200
					}
				}
			},
			interactivity: {
				detect_on: 'canvas',
				events: {
					onhover: {
						enable: false,
						mode: 'repulse'
					},
					onclick: {
						enable: false,
						mode: 'push'
					},
					resize: true
				},
				modes: {
					grab: {
						distance: 400,
						line_linked: {
							opacity: 1
						}
					},
					bubble: {
						distance: 400,
						size: 40,
						duration: 2,
						opacity: 8,
						speed: 3
					},
					repulse: {
						distance: 200,
						duration: .4
					},
					push: {
						particles_nb: 4
					},
					remove: {
						particles_nb: 2
					}
				}
			},
			retina_detect: true
		};
		particlesJS('particles', config);
	});
}
