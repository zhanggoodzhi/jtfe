import './index.less';
import { initClasses } from './classes';
import { initIndividuals } from './individuals';
import { initProperties } from './properties';
import { initChart } from './chart';
import { initInference } from './inference';
import { getFullHeight, setScroll, tabShown } from 'utils';
import 'tables';

namespace FrameworkIndex {
	$(() => {
		tabShown($('#properties-link'), setScroll);
		tabShown($('#chart-link'), setScroll);
		tabShown($('#individuals-link'), () => {
			const height = Math.floor((getFullHeight($('#individuals-container')) - 52) / 2);
			$('#individuals-tree,#individuals-items-tree').height(height).css('overflow', 'auto');
			setScroll();
		});
		initClasses();
		initProperties();
		initIndividuals();
		initChart();
		initInference();
	});
}

