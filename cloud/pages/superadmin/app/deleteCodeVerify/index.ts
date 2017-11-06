import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
import './index.less';
namespace SuperadminAppDeleteCodeVerify {
	$(bindDeleteEvents);
	function bindDeleteEvents() {
		$('#confirm-delete').on('click', () => {
			deleteAjax(true);
		});
		$('#cancel-delete').on('click', () => {
			deleteAjax(false);
		});
	}
	function deleteAjax(verify) {
		$.ajax({
			url: 'superadmin/app/deleteVerify',
			data: {
				code: $('#code').val(),
				verify
			},
			type: 'POST',
			success: (data) => {
				utils.alertMessage(data.msg, !data.error);
			}
		});
	}
}

