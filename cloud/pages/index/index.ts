import { alertMessage } from 'utils';
import 'time';
import './index.less';

declare const unresolveduProblemCount: number;
declare const unreviewedPairCount: number;
declare const enterIndexCount: number;


interface IMessage {
	contentHtml: string;
	createTime: string;
	did: number;
	id: number;
	plainText: string;
	title: string;
}

const messageList = $('#message-list');
const messageContent = $('#message-content');

function fetchMessages() {
	return $.ajax('bulletin/queryBulletinSystem', {
		method: 'POST'
	});
}

function updateMessageContent(content: string) {
	messageContent.html(content);
}

function updateActiveMessage(item: JQuery) {
	if (item.hasClass('active')) {
		return;
	}
	messageList.find('.active').removeClass('active');
	try {
		const data: IMessage = item.data('data');
		updateMessageContent(data.contentHtml);
		item.addClass('active');
	}
	catch (error) {
		updateMessageContent('<p class="text-center">获取数据异常</p>');
	}
}


(function () {
	const unviewedModal = $('#unreviewed-modal');

	if (unviewedModal.modal.length > 0) {
		unviewedModal.modal('show');
	}

	if (enterIndexCount === 1 && unresolveduProblemCount > 0) {
		alertMessage(
			`系统中有<span class="text-danger">${unresolveduProblemCount}</span>次会话被用户评价为未解决问题，请尽快去会话统计页面查看详情`,
			'warn'
		);
	}

	messageList.on('click', '.message-item', e => {
		const item = $(e.currentTarget);
		updateActiveMessage(item);
	});

	fetchMessages()
		.then((res) => {
			if (!res) {
				return;
			}
			const messages: IMessage[] = JSON.parse(res);
			messageList.empty();
			if (messages && messages.length > 0) {
				messages.forEach((data, index) => {
					const item = $(`<tr class="message-item">
						<td>${data.title}</td>
						<td>${moment(data.createTime).format('YYYY-MM-DD')}</td>
					</tr>`);

					item.data('data', data);

					messageList.append(item);
					if (index === 0) {
						item.find('td:first').append('<img src="images/new.png">');
						updateActiveMessage(item);
					}
				});
			} else {
				messageList.append('<tr class="text-center"><td colspan="2">暂无数据</td></tr>');
			}
		});

}());

