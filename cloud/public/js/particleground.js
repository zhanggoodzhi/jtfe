/**
 * Particleground demo
 * 
 * @author Jonathan Nicol -
 * @mrjnicol 5cbdaa
 */

document.addEventListener('DOMContentLoaded', function() {
	particleground(document.getElementById('particles'), {
		dotColor : '#157190',
		lineColor : '#157190',
		density : 20000
	});
	var intro = document.getElementById('intro');
	intro.style.marginTop = -intro.offsetHeight / 2 + 'px';
}, false);

/*
 * // jQuery plugin example: $(document).ready(function() {
 * $('#particles').particleground({ dotColor: '#5cbdaa', lineColor: '#5cbdaa'
 * }); $('.intro').css({ 'margin-top': -($('.intro').height() / 2) }); });
 */