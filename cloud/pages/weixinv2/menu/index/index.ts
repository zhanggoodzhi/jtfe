import * as utils from 'utils';
import './index.less';
import * as Sortable from 'sortablejs';

namespace Wweixinv2MenuIndex {
	declare const credentialId: string;
	const urlReg = new RegExp('^(https?|ftp):\/\/.+\..+$', 'i');
	enum viewState {
		common,
		hasSub,
		noMenu
	}

	$(() => {
		initMenus();
		initSave();
	});
	// 初始化菜单
	function initMenus() {
		const root = $('#weixin-menu-list');
		// 被点击的菜单添加选中样式
		root.on('click', '.weixin-menu-item', (e) => {
			const el = $(e.currentTarget);
			$('.weixin-menu-item.selected').removeClass('selected');
			el.addClass('selected');
		});

		root.on('click', '.weixin-parent-menu', (e) => {
			const el = $(e.currentTarget),
				subMenu = el.next('.sub-menu-list'),
				data = el.data(),
				subNum = getSubMEnuNumber(subMenu);
			fillData(data, false);
			root.find('.sub-menu-list.show').removeClass('show');
			subMenu.addClass('show');
			if (subNum > 0) {
				viewShow(viewState.hasSub);
			} else {
				viewShow(viewState.common);
			}
		});

		root.on('click', '.weixin-sub-menu', (e) => {
			const el = $(e.currentTarget),
				data = el.data();
			viewShow(viewState.common);
			fillData(data, false);
		});


		root.on('click', '.add-parent-menu', (e) => {
			const num = getParentMenuNumber(),
				el = $(e.currentTarget).parent();
			if (num >= 3 || num < 0) {
				return;
			}
			const newEl = createParentMenuElement();
			setTimeout(() => {
				el.before(newEl);
				newEl.find('.weixin-parent-menu').click();
				viewShow(viewState.common);
				if (num === 2) {
					el.remove();
				}
				// $('input:radio[value="view"]').click();
			}, 0);
		});

		utils.bindInput($('#menu-name'), 'input change', (val) => {
			const el = root.find('.weixin-menu-item.selected');
			el.data('name', val);
			fillData(el.data(), true);
		}, 100);

		utils.bindInput($('#menu-content'), 'input change', (val) => {
			const el = root.find('.weixin-menu-item.selected'),
				data = el.data();
			if (!data.type) {
				return;
			}
			else if (data.type === 'view') {
				el.data('url', val);
			}
			else {
				el.data('menukey', val);
			}
		}, 100);

		$('input:radio[name=type]').on('change', (e) => {
			const el = root.find('.weixin-menu-item.selected'),
				data = el.data(),
				target = $(e.currentTarget),
				val = target.val();
			if (!data.hasOwnProperty('type')) {
				return;
			}
			if (data.type === '') {
				data[target.data('param')] = $.trim($('#menu-content').val());
			}
			data.type = val;
			fillData(el.data(), false);
		});

		root.on('click', '.add-sub-menu', (e) => {
			const el = $(e.currentTarget).parent(),
				num = getSubMEnuNumber(el.parent('.sub-menu-list'));
			if (num >= 5 || num < 0) {
				return;
			}
			const newEl = createSubMenuElement();
			setTimeout(() => {
				el.before(newEl);
				if (num === 4) {
					el.remove();
				}
				newEl.find('.weixin-sub-menu').trigger('click');
			}, 0);
		});

		$('#del-menu-btn').on('click', (e) => {
			const el = root.find('.weixin-menu-item.selected');
			if (el.length <= 0) {
				return;
			}
			const data = el.data();
			utils.confirmModal({
				msg: `删除后菜单 ${data.name} 下设置的内容将被清除`,
				cb: (modal) => {
					if (el.hasClass('weixin-parent-menu')) {
						const num = getParentMenuNumber();
						if (num === 3) {
							$('#weixin-menu-list').append(createParentMenuElement(true));
						}
						el.parent().remove();
						const currentParentMenus = $('#weixin-menu-list .weixin-parent-menu:not(.add-parent-menu)');
						if (currentParentMenus.length > 0) {
							currentParentMenus.first().click();
						}
						else {
							viewShow(viewState.noMenu);
						}
					}
					else {
						const subList = el.parents('.sub-menu-list');
						const num = getSubMEnuNumber(subList);
						if (num === 5) {
							subList.append(createSubMenuElement(true));
						}
						el.parent().remove();
						const currentSubMenus = subList.find('.weixin-sub-menu:not(.add-sub-menu)');
						if (currentSubMenus.length > 0) {
							currentSubMenus.first().click();
						} else {
							const p = subList.prev('.weixin-parent-menu');
							if (!p.data('type')) {
								p.data('type', 'view');
							}
							p.trigger('click');
						}
					}
					modal.modal('hide');
				}
			});
		});

		$('#weixin-resync').on('click', () => {
			utils.confirmModal({
				msg: '重新同步后当前修改不会被保存,确认同步吗?',
				text: '确定',
				className: 'btn-primary',
				cb: (modal, btn) => {
					const endLoading = utils.loadingBtn(btn);
					$.ajax({
						url: 'weixinv2/resyncMenu',
						type: 'POST',
						data: {
							credentialId: credentialId
						},
						success: (msg) => {
							if (!msg.error) {
								modal.modal('hide');
								utils.alertMessage(msg.msg, true);
								setTimeout(() => {
									location.reload();
								}, 300);
							} else {
								utils.alertMessage(msg.msg);
							}
						},
						error: (msg: any) => {
							utils.alertMessage(msg.msg);
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});

		new Sortable(document.getElementById('weixin-menu-list'), {
			sort: true
		});

		root.find('.sub-menu-list').toArray().forEach(v => {
			new Sortable(v, {
				sort: true
			});
		});

		if (getParentMenuNumber() <= 0) {
			viewShow(viewState.noMenu);
		} else {
			viewShow(viewState.common);
			root.find('.weixin-parent-menu:first').click();
		}
	}


	function fillData(data, flag) {
		let fillName = data.name;
		if ($.isEmptyObject(data)) {
			return;
		}
		$('#menu-name-static').text(fillName);
		if (!flag) {
			$('#menu-name').val(fillName);
		}
		$('#weixin-menu-list .weixin-menu-item.selected').text(fillName);
		if (data.type) {
			const el = $(`input:radio[name=type][value=${data.type}]`);
			el.prop('checked', true);
			$('#menu-content').val(data[el.data('param')]);
		}
		else {
			$(`input:radio[name=type]`).prop('checked', null);
			$('#menu-content').val('');
		}
	}

	function getParentMenuNumber(): number {
		return $('#weixin-menu-list .weixin-parent-menu:not(.add-parent-menu)').length;
	}

	function createParentMenuElement(add: boolean = false): JQuery {
		let el;
		if (!add) {
			el = $(`
                <li>
                    <span class="weixin-parent-menu weixin-menu-item">新建菜单</span>
                    <ul class="sub-menu-list">
                        <li>
                            <span class="weixin-sub-menu weixin-menu-item add-sub-menu">
                                <i class="fa fa-plus add-icon"></i>
                            </span>
                        </li>
                    </ul>
                </li>`);
			el.find('.weixin-parent-menu')
				.data({
					type: 'view',
					name: '新建菜单',
					menukey: '',
					url: ''
				});
			new Sortable(el.find('.sub-menu-list').get(0), {
				sort: true
			});
		}
		else {
			el = $(`
                <li>
                    <span class="weixin-parent-menu weixin-menu-item add-parent-menu">
                        <i class="fa fa-plus add-icon"></i>
                    </span>
                </li>`);
		}
		return el;
	}


	function getSubMEnuNumber(el: JQuery): number {
		return el.find('.weixin-sub-menu:not(.add-sub-menu)').length;
	}

	function createSubMenuElement(add: boolean = false) {
		let el;
		if (!add) {
			el = $(`
                <li>
                    <span class="weixin-sub-menu weixin-menu-item">新建菜单</span>
                </li>`);
			el.find('.weixin-sub-menu')
				.data({
					type: 'view',
					name: '新建菜单',
					menukey: '',
					url: ''
				});
		}
		else {
			el = $(`
                <li>
                    <span class="weixin-sub-menu weixin-menu-item add-sub-menu">
                        <i class="fa fa-plus add-icon"></i>
                    </span>
                </li>`);
		}
		return el;
	}

	function initSave() {
		const btn = $('#save-btn');
		btn.on('click', () => {
			const parentElement = $('#weixin-menu-list .weixin-parent-menu:not(.add-parent-menu)').toArray(),
				d = [];
			for (let i of parentElement) {
				const iEl = $(i),
					subElement = iEl.next('.sub-menu-list').find('.weixin-sub-menu:not(.add-sub-menu)').toArray();
				let parentElementData;
				if (subElement.length > 0) {
					parentElementData = renderSaveData(iEl.data(), (parentElement.indexOf(i) + 1) * 10, true);
				}
				else {
					parentElementData = renderSaveData(iEl.data(), (parentElement.indexOf(i) + 1) * 10);
				}

				if (!parentElementData) {
					return;
				}
				if (subElement.length > 0) {
					for (let j of subElement) {
						const jEl = $(j),
							subElementData = renderSaveData(jEl.data(), parentElementData.priority + subElement.indexOf(j) + 1);
						if (!subElementData) {
							return;
						}
						d.push(subElementData);
					}
				}
				d.push(parentElementData);
			}
			d.sort((x, y) => x.priority - y.priority);
			const data = {
				credentialId: credentialId,
				data: d
			};

			utils.loadingBtn(btn);
			$.ajax({
				url: 'weixinv2/menu/saveMenu',
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				cache: false,
				dataType: 'json',
				success: function (msg) {
					utils.alertMessage(msg.msg, !msg.error);
				},
				complete: () => {
					utils.endLoadingBtn(btn);
				}
			});
		});
	}

	function renderSaveData(data, id: number, ignore: boolean = false) {
		const currentData = Object.assign({
			priority: id,
			credentialId: credentialId,
			menuKey: data.menukey
		}, data);
		if (!currentData.type && !ignore) {
			utils.alertMessage(`菜单 ${currentData.name} 的链接或key未填写`);
			return;
		}
		if (currentData.type === 'view') {
			if ((!currentData.url || !currentData.url.match(urlReg)) && !ignore) {
				utils.alertMessage(`菜单 ${currentData.name} 的链接未填写或不符合规则\n\r链接格式为http(s)://xxx.xxxxxx.xxx`);
				return;
			}
			currentData.menukey = null;
		}
		else {
			if (!currentData.menukey && !ignore) {
				utils.alertMessage(`菜单 ${currentData.name} 的key未填写`);
				return;
			}
			currentData.url = null;
		}

		delete currentData.menukey; // menukey是大写的- -

		if (ignore) {
			Object.assign(currentData, {
				menuKey: null,
				url: null,
				type: null
			});
		}
		return currentData;
	}


	function viewShow(state) {
		const detial = $('#menu-detial'),
			info = $('#menu-info'),
			infoText = $('#menu-info-text'),
			formEl = $('#weixin-edit-container input,textarea').prop('disabled', null);
		switch (state) {
			case viewState.common:
				detial.show();
				info.hide();
				// $('#weixin-edit-container input:radio').prop('checked', true);
				break;
			case viewState.hasSub:
				detial.hide();
				info.show();
				infoText.text('含有子菜单,仅能修改菜单名称!');
				break;
			case viewState.noMenu:
				detial.show();
				info.show();
				infoText.text('公众号不包含菜单,点击保存后会清空所有菜单!');
				formEl.prop('disabled', true);
				$('#menu-name,#weixin-edit-container textarea').val('');
				$('#weixin-edit-container input:radio').prop('checked', null);
				break;
			default:
				return;
		}
	}
}
