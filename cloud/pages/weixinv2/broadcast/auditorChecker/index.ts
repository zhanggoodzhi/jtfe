import './index.less';
namespace Weixinv2BroadcastAuditorCheckerIndex {
	declare const processid;
	$(() => {
		reject();
		approve();
	});
	function reject() {
		$('#reject-btn').on('click',function(){
			$('#mainbody').html('请稍等');
			$.ajax({
				url: 'weixinv2/broadcast/auditReject',
				type: 'POST',
				data: {
					'processid': processid
				},
				success: function (data) {
					if (data.code === '200') {
						$('#mainbody').html('您已拒绝本次消息群发请求');

					} else {
						$('#mainbody').html('操作失败,原因:' + data.msg);

					}
				}
			});
		});
	}
	function approve() {
		$('#approve-btn').on('click',function(){
			$('#mainbody').html('请稍等');
			$.ajax({
				url: 'weixinv2/broadcast/auditApprove',
				type: 'POST',
				data: {
					'processid': processid
				},
				success: function (data) {
					$('#mainbody').html('');
					if (data.code === '200') {
						$('#mainbody').html('您已同意本次消息群发请求');

					} else {
						$('#mainbody').html('操作失败,原因:' + data.msg);

					}
				}
			});
		});
	}


}
