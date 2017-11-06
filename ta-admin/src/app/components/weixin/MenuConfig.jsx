import { Tabs, Input, Card, Button, Icon, Row, Col, Modal, Select, message } from "antd";
import * as React from "react";
import * as request from "superagent";
import './MenuConfig.less';
class MenuConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmType: '',
            type: null,
            sDragItem: '-999',
            cDragItem: '-999',
            oneMenuFocus: '0',
            twoMenuFocus: '-1',
            ajaxData: [
                {
                    subButtons: []
                },
                {
                    subButtons: []
                },
                {
                    subButtons: []
                }
            ]
        };
    }
    sConfirmAdd() {
        this.setState({
            confirmType: 's'
        }, () => {
            this.showModal();
        })
    }
    cConfirmAdd(si, e) {
        e.stopPropagation();
        this.setState({
            confirmType: 'c'
        }, () => {
            this.showModal();
        })
    }
    sAdd() {
        const newData = this.state.ajaxData;
        newData.push({
            name: '新菜单',
            key: '',
            url: '',
            type: this.state.type,
            mediaId: '',
            subButtons: []
        });
        this.setState({
            oneMenuFocus: String(this.state.ajaxData.length - 1),
            twoMenuFocus: '-1',
            ajaxData: newData
        });
    }

    cAdd() {
        const newData = this.state.ajaxData;
        newData[this.state.oneMenuFocus].subButtons.push({
            name: '新菜单',
            key: '',
            url: '',
            mediaId: '',
            type: this.state.type
        });
        this.setState({
            twoMenuFocus: String(this.state.ajaxData[this.state.oneMenuFocus].subButtons.length - 1),
            ajaxDate: newData
        });
    }
    sclick(si) {
        this.setState({
            oneMenuFocus: si,
            twoMenuFocus: "-1"
        });
    }
    cclick(ci, e) {
        this.setState({
            twoMenuFocus: ci
        });
        e.stopPropagation();
    }
    componentDidMount() {
        this.props.setLoading(true);
        request
            .post('/weixin/menuget')
            .type("form")
            .send({
            })
            .end((err, res) => {
                this.props.setLoading(false);
                this.setState({
                    ajaxData: JSON.parse(res.text).buttons
                });
            });
    }
    sclass(si) {
        if (si == this.state.oneMenuFocus && this.state.twoMenuFocus == '-1') {//选中父菜单
            if (this.state.ajaxData[this.state.oneMenuFocus].type == null) {//父菜单类型为空，即允许有子菜单
                return 'oneMenu selected checked';
            } else {
                return 'oneMenu checked';
            }
        } else if (si == this.state.oneMenuFocus) {//选中子菜单
            return 'oneMenu selected';
        } else {//没选中
            return 'oneMenu';
        }
    }
    cclass(si, ci) {
        if (si == this.state.oneMenuFocus && ci == this.state.twoMenuFocus) {
            return 'twoMenu checked';
        } else {
            return 'twoMenu';
        }
    }
    confirmRemove() {
        const confirm = Modal.confirm;
        let self = this;
        confirm({
            title: '警告',
            content: '确定要删除该菜单吗？',
            onOk() {
                self.remove();
            },
            onCancel() { },
        });
    }

    remove() {
        if (this.state.twoMenuFocus == '-1') {//删除大菜单
            const newData = this.state.ajaxData;
            newData.splice(this.state.oneMenuFocus, 1);
            this.setState({
                oneMenuFocus: '0',
                ajaxData: newData
            });
        } else {
            const newData = this.state.ajaxData;
            newData[this.state.oneMenuFocus].subButtons.splice(this.state.twoMenuFocus, 1);
            this.setState({
                twoMenuFocus: '0',
                ajaxData: newData
            });
        }
    }
    updateForm(e, str) {
        let newData = this.state.ajaxData;
        if (this.state.twoMenuFocus == '-1') {
            switch (str) {
                case 'name': newData[this.state.oneMenuFocus].name = e.target.value; break;
                case 'key': newData[this.state.oneMenuFocus].key = e.target.value; break;
                case 'url': newData[this.state.oneMenuFocus].url = e.target.value; break;
                case 'mediaId': newData[this.state.oneMenuFocus].mediaId = e.target.value; break;
                default: console.log("updateForm Error"); break;
            }
        } else {
            switch (str) {
                case 'name': newData[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].name = e.target.value; break;
                case 'key': newData[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].key = e.target.value; break;
                case 'url': newData[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].url = e.target.value; break;
                case 'mediaId': newData[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].mediaId = e.target.value; break;
                default: console.log("updateForm Error"); break;
            }
        }
        this.setState({
            ajaxData: newData
        });
    }
    sDragStart(si) {
        this.setState({
            sDragItem: si
        });
    }
    sDragOver(si, e) {
        e.preventDefault();
    }
    sDrop(si) {
        //数组元素交换
        let left = null;
        let right = null;
        if (si == this.state.sDragItem) {
            return;
        } else if (si < this.state.sDragItem) {
            left = si;
            right = this.state.sDragItem;
        } else {
            left = this.state.sDragItem;
            right = si;
        }
        let newData = this.state.ajaxData;
        let newItem = newData[right];
        newData.splice(right, 1);
        newData.splice(left, 0, newItem);
        this.setState({
            ajaxDate: newData,
            oneMenuFocus: si,
            twoMenuFocus: "-1"
        });

    }
    cDragStart(ci) {
        this.setState({
            cDragItem: ci
        });
    }
    cDragOver(ci, e) {
        e.preventDefault();
    }
    cDrop(ci) {
        let left = null;
        let right = null;
        if (ci == this.state.cDragItem) {
            return;
        } else if (ci < this.state.cDragItem) {
            left = ci;
            right = this.state.cDragItem;
        } else {
            left = this.state.cDragItem;
            right = ci;
        }
        let newData = this.state.ajaxData;
        let newItem = newData[this.state.oneMenuFocus]['subButtons'][right];
        newData[this.state.oneMenuFocus]['subButtons'].splice(right, 1);
        newData[this.state.oneMenuFocus]['subButtons'].splice(left, 0, newItem);
        this.setState({
            ajaxDate: newData,
            twoMenuFocus: ci
        });
    }
    showModal() {
        console.log(this.state.confirmType);
        this.setState({
            visible: true,
            type: this.state.confirmType == 'c' ? 'click' : null
        });
    }
    handleOk() {
        this.handleCancel();
        if (this.state.confirmType == 's') {
            this.sAdd();
        } else {
            this.cAdd();
        }
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    confirmSave() {
        const confirm = Modal.confirm;
        let self = this;
        confirm({
            title: '提示',
            content: '确定要保存并更新该菜单吗？',
            onOk() {
                self.save();
            },
            onCancel() { },
        });
    }
    save() {
        this.props.setLoading(true);
        request
            .post('/weixin/menucreate')
            .type("form")
            .send({
                menujson: JSON.stringify(this.state.ajaxData)
            })
            .end((err, res) => {
                this.props.setLoading(false);
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        message.success('保存成功');
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    switchType(type) {
        switch (type) {
            case null: return '父级菜单';
            case 'click': return '点击推事件';
            case 'location_select': return '弹出微信相册发图器';
            case 'media_id': return '下发消息（除文本消息）';
            case 'pic_photo_or_album': return '弹出拍照或者相册发图';
            case 'pic_sysphoto': return '弹出系统拍照发图';
            case 'pic_weixin': return '弹出微信相册发图器';
            case 'scancode_push': return '扫码推事件';
            case 'scancode_waitmsg': return '扫码推事件且弹出“消息接收中”提示框';
            case 'view': return '跳转URL';
            case 'view_limited': return '跳转图文消息URL';
        }
    }
    render() {
        const Option = Select.Option;
        const TabPane = Tabs.TabPane;
        let data = this.state.ajaxData;
        if (data == undefined) {
            return <div>此专区无对应微信公众号</div>
        }
        let oneMenuFull = data.length >= 3 ? 'none' : 'block';
        const sm = data.map((sv, si) => {
            const subButtons = sv.subButtons.map((cv, ci) => {
                return <li draggable="true" onDrop={() => { this.cDrop(ci) } } onDragOver={(e) => { this.cDragOver(ci, e) } } onDragStart={() => { this.cDragStart(ci) } } className={this.cclass(si, ci)} key={`${ci}_${si}`} onClick={(e) => { this.cclick(ci, e) } } ><span>{cv.name}</span></li>
            });
            let twoMenuFull = sv.subButtons.length >= 5 ? 'none' : 'block';
            return <li className={this.sclass(si)} key={`${si}`} onClick={() => { this.sclick(si) } }><span draggable="true" onDrop={() => { this.sDrop(si) } } onDragOver={(e) => { this.sDragOver(si, e) } } onDragStart={() => { this.sDragStart(si) } }>{sv.name}</span><ul className="twoMenu-wrap">{subButtons}<li style={{ display: twoMenuFull }} className="twoMenu" onClick={(e) => { this.cConfirmAdd(si, e) } } ><span><Icon type="plus" /></span></li></ul></li>
        });
        let thisName = '';
        let thisContent = '';
        let contentType = '';
        let thisType = "";
        let menuInfo = 'block';
        if (this.state.twoMenuFocus == '-1' && data.length != 0) {
            thisName = data[this.state.oneMenuFocus].name;
            thisType = data[this.state.oneMenuFocus].type;
            switch (thisType) {
                case 'click': contentType = 'key'; break;
                case 'location_select': contentType = 'key'; break;
                case 'media_id': contentType = 'mediaId'; break;
                case 'pic_photo_or_album': contentType = 'key'; break;
                case 'pic_sysphoto': contentType = 'key'; break;
                case 'pic_weixin': contentType = 'key'; break;
                case 'scancode_push': contentType = 'key'; break;
                case 'scancode_waitmsg': contentType = 'key'; break;
                case 'view': contentType = 'url'; break;
                case 'view_limited': contentType = 'mediaId'; break;
            }
            thisContent = data[this.state.oneMenuFocus][contentType];
        } else if (data.length != 0 && data[this.state.oneMenuFocus].subButtons.length != 0) {
            thisName = data[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].name;
            thisType = data[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus].type;
            switch (thisType) {
                case 'click': contentType = 'key'; break;
                case 'location_select': contentType = 'key'; break;
                case 'media_id': contentType = 'mediaId'; break;
                case 'pic_photo_or_album': contentType = 'key'; break;
                case 'pic_sysphoto': contentType = 'key'; break;
                case 'pic_weixin': contentType = 'key'; break;
                case 'scancode_push': contentType = 'key'; break;
                case 'scancode_waitmsg': contentType = 'key'; break;
                case 'view': contentType = 'url'; break;
                case 'view_limited': contentType = 'mediaId'; break;
            }
            thisContent = data[this.state.oneMenuFocus].subButtons[this.state.twoMenuFocus][contentType];
        } else if (data.length == 0) {
            menuInfo = 'none'
        }
        return (
            <div className="container">
                <Row>
                    <Col span="24">
                        <div className="content">
                            <Modal title="选择菜单类型" visible={this.state.visible}
                                onCancel={this.handleCancel.bind(this)} wrapClassName='menuConfig-wrap'
                                onOk={this.handleOk.bind(this)}>
                                <Select value={this.state.type} size="large" style={{ width: 400 }} onChange={(value) => { this.setState({ type: value }) } }>
                                    <Option style={{ display: this.state.confirmType == 'c' ? 'none' : 'block' }} value={null} title="内含子菜单">父级菜单</Option>
                                    <Option value="click" title="成员点击click类型按钮后，微信服务器会通过消息接口推送消息类型为event	的结构给开发者（参考消息接口指南），并且带上按钮中开发者填写的key值，开发者可以通过自定义的key值与成员进行交互；">点击推事件</Option>
                                    <Option value="view" title="成员点击view类型按钮后，微信客户端将会打开开发者在按钮中填写的网页URL，可与网页授权获取成员基本信息接口结合，获得成员基本信息。">跳转URL</Option>
                                    <Option value="scancode_push" title="成员点击按钮后，微信客户端将调起扫一扫工具，完成扫码操作后显示扫描结果（如果是URL，将进入URL），且会将扫码的结果传给开发者，开发者可以下发消息。">扫码推事件</Option>
                                    <Option value="scancode_waitmsg" title="成员点击按钮后，微信客户端将调起扫一扫工具，完成扫码操作后，将扫码的结果传给开发者，同时收起扫一扫工具，然后弹出“消息接收中”提示框，随后可能会收到开发者下发的消息。">扫码推事件且弹出“消息接收中”提示框</Option>
                                    <Option value="pic_sysphoto" title="成员点击按钮后，微信客户端将调起系统相机，完成拍照操作后，会将拍摄的相片发送给开发者，并推送事件给开发者，同时收起系统相机，随后可能会收到开发者下发的消息。">弹出系统拍照发图</Option>
                                    <Option value="pic_photo_or_album" title="成员点击按钮后，微信客户端将弹出选择器供成员选择“拍照”或者“从手机相册选择”。成员选择后即走其他两种流程。">弹出拍照或者相册发图</Option>
                                    <Option value="pic_weixin" title="成员点击按钮后，微信客户端将调起微信相册，完成选择操作后，将选择的相片发送给开发者的服务器，并推送事件给开发者，同时收起相册，随后可能会收到开发者下发的消息。">弹出微信相册发图器</Option>
                                    <Option value="location_select" title="成员点击按钮后，微信客户端将调起地理位置选择工具，完成选择操作后，将选择的地理位置发送给开发者的服务器，同时收起位置选择工具，随后可能会收到开发者下发的消息。">弹出地理位置选择器</Option>
                                    <Option value="media_id" title="用户点击media_id类型按钮后，微信服务器会将开发者填写的永久素材id对应的素材下发给用户，永久素材类型可以是图片、音频、视频、图文消息。请注意：永久素材id必须是在“素材管理/新增永久素材”接口上传后获得的合法id。">下发消息（除文本消息）</Option>
                                    <Option value="view_limited" title="用户点击view_limited类型按钮后，微信客户端将打开开发者在按钮中填写的永久素材id对应的图文消息URL，永久素材类型只支持图文消息。请注意：永久素材id必须是在“素材管理/新增永久素材”接口上传后获得的合法id。">跳转图文消息URL</Option>
                                </Select>
                            </Modal>
                            <div className="weixin-bg-wrap">
                                <ul className="menu-wrap">
                                    {sm}
                                    <li style={{ display: oneMenuFull }} className="oneMenu" onClick={this.sConfirmAdd.bind(this)}><span><Icon type="plus" /></span></li>
                                </ul>
                            </div>
                            <div className="menuInfo" style={{
                                display: menuInfo
                            }}>
                                <Card title="菜单信息" extra={<a onClick={this.confirmRemove.bind(this)}>删除菜单</a>}>
                                    <label className="menuName-wrap">
                                        <span>菜单名称: </span><div><Input style={{ width: 200 }} type="text" placeholder={"请输入菜单名称"} value={thisName} onChange={(e) => { this.updateForm(e, 'name') } } /></div>
                                    </label>
                                    <div className="menuType-wrap" style={{ marginTop: 15 }}>
                                        <span>菜单类型: </span><span style={{ marginLeft: 59 }}>{this.switchType(thisType)}</span>
                                    </div>
                                    <br />
                                    <div className='menuContent-wrap' style={{ display: thisType == null ? 'none' : 'block' }}>
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab={contentType} key="1"><Input type="textarea" rows={10} value={thisContent} onChange={(e) => { this.updateForm(e, contentType) } } /></TabPane>
                                        </Tabs>
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div className="btn-wrap" style={{ textAlign: 'center' }}>
                            <Button type="primary" size="large" onClick={this.confirmSave.bind(this)}>保存</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
MenuConfig.propTypes = {
    setLoading: React.PropTypes.func,
};
export default MenuConfig;
