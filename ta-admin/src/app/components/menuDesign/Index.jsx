import {Tabs, Input, Card, Button, Icon, Menu, Row, Col}  from "antd";
import * as React from "react";
import * as request from "superagent";
import './Index.less';
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.sort = null;
        this.state = {
            current:1,
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            sDragItem: '-999',
            cDragItem: '-999',
            oneMenuFocus: '0',
            twoMenuFocus: '-1',
            oneMenuFull: 'block',//display样式
            twoMenuFull: [false, false, false],//3个菜单是否达到最大值,
            ajaxData: [
                {
                    name: 1,
                    key: 1,
                    href: 1,
                    cm: [{
                        name: 11,
                        key: 11,
                        href: 11,
                    }, {
                            name: 12,
                            key: 12,
                            href: 12,
                        }]
                },
                {
                    name: 2,
                    key: 2,
                    href: 2,
                    cm: [{
                        name: 21,
                        key: 21,
                        href: 21,
                    }]
                }
            ],
            menu: null
        };
    }

    sAdd() {
        if (this.state.ajaxData.length == 2) {
            this.setState({
                oneMenuFull: 'none'
            });
        }
        const newData = this.state.ajaxData;
        newData.push({
            name: '新菜单',
            key: '',
            href: '',
            cm: []
        });
        this.setState({
            oneMenuFocus: String(this.state.ajaxData.length - 1),
            twoMenuFocus: '-1',
            ajaxData: newData
        });
    }

    cAdd(si, e) {
        if (this.state.ajaxData[this.state.oneMenuFocus].cm.length >= 4) {
            const newFull = this.state.twoMenuFull;
            newFull[si] = true;
            this.setState({
                twoMenuFull: newFull
            });
        }
        const newData = this.state.ajaxData;
        newData[this.state.oneMenuFocus].cm.push({
            name: '新菜单',
            key: '',
            href: ''
        });
        this.setState({
            twoMenuFocus: String(this.state.ajaxData[this.state.oneMenuFocus].cm.length - 1),
            ajaxDate: newData
        });
        e.stopPropagation();
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
    }
    sclass(si) {
        if (si == this.state.oneMenuFocus && this.state.twoMenuFocus == '-1') {
            return 'oneMenu selected checked';
        } else if (si == this.state.oneMenuFocus) {
            return 'oneMenu selected';
        } else {
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
    caddclass(si) {
        if (this.state.twoMenuFull[si] == true) {
            return 'twoMenu hide';
        } else {
            return 'twoMenu';
        }
    }
    remove() {
        if (this.state.twoMenuFocus == '-1') {//删除大菜单
            const newData = this.state.ajaxData;
            newData.splice(this.state.oneMenuFocus, 1);
            this.setState({
                oneMenuFocus: '0',
                ajaxData: newData,
                oneMenuFull: 'block',
            });

        } else {
            const newData = this.state.ajaxData;
            const newFull = this.state.twoMenuFull;
            newData[this.state.oneMenuFocus].cm.splice(this.state.twoMenuFocus, 1);
            newFull[this.state.oneMenuFocus] = false;
            this.setState({
                twoMenuFocus: '0',
                ajaxData: newData,
                twoMenuFull: newFull
            });
        }
    }
    updateForm(e, str) {
        let newData = this.state.ajaxData;
        if (this.state.twoMenuFocus == '-1') {
            switch (str) {
                case 'name': newData[this.state.oneMenuFocus].name = e.target.value; break;
                case 'key': newData[this.state.oneMenuFocus].key = e.target.value; break;
                case 'href': newData[this.state.oneMenuFocus].href = e.target.value; break;
                default: console.log("updateForm Error"); break;
            }
        } else {
            switch (str) {
                case 'name': newData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].name = e.target.value; break;
                case 'key': newData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].key = e.target.value; break;
                case 'href': newData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].href = e.target.value; break;
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
        //full数组元素交换
        let newArr = this.state.twoMenuFull;
        newItem = newArr[right];
        newArr.splice(right, 1);
        newArr.splice(left, 0, newItem);
        this.setState({
            ajaxDate: newData,
            oneMenuFocus: si,
            twoMenuFocus: "-1",
            twoMenuFull: newArr
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
        let newItem = newData[this.state.oneMenuFocus]['cm'][right];
        newData[this.state.oneMenuFocus]['cm'].splice(right, 1);
        newData[this.state.oneMenuFocus]['cm'].splice(left, 0, newItem);
        this.setState({
            ajaxDate: newData,
            twoMenuFocus: ci
        });
    }
    render() {

        const TabPane = Tabs.TabPane;
        const sm = this.state.ajaxData.map((sv, si) => {
            const cm = sv.cm.map((cv, ci) => {
                return <li draggable="true" onDrop={() => { this.cDrop(ci) } } onDragOver={(e) => { this.cDragOver(ci, e) } } onDragStart={() => { this.cDragStart(ci) } } className={this.cclass(si, ci) } key={`${ci}_${si}`} onClick={(e) => { this.cclick(ci, e) } } ><span>{cv.name}</span></li>
            });
            return <li className={this.sclass(si) } key={`${si}`} onClick={() => { this.sclick(si) } }><span draggable="true" onDrop={() => { this.sDrop(si) } } onDragOver={(e) => { this.sDragOver(si, e) } } onDragStart={() => { this.sDragStart(si) } }>{sv.name}</span><ul className="twoMenu-wrap">{cm}<li className={this.caddclass(si) } onClick={(e) => { this.cAdd(si, e) } } ><span><Icon type="plus"/></span></li></ul></li>
        });
        let thisName = '';
        let thisKey = '';
        let thisHref = '';
        let menuInfo = 'block';
        if (this.state.twoMenuFocus == '-1' && this.state.ajaxData.length != 0) {
            thisName = this.state.ajaxData[this.state.oneMenuFocus].name;
            thisKey = this.state.ajaxData[this.state.oneMenuFocus].key;
            thisHref = this.state.ajaxData[this.state.oneMenuFocus].href;
        } else if (this.state.ajaxData.length != 0 && this.state.ajaxData[this.state.oneMenuFocus].cm.length != 0) {
            thisName = this.state.ajaxData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].name;
            thisKey = this.state.ajaxData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].key;
            thisHref = this.state.ajaxData[this.state.oneMenuFocus].cm[this.state.twoMenuFocus].href;
        } else if (this.state.ajaxData.length == 0) {
            menuInfo = 'none'
        }
        return (
            <div className="content">
                <div className="weixin-bg-wrap">
                    <ul className="menu-wrap">
                        {sm}
                        <li style={{ display: this.state.oneMenuFull }} className="oneMenu" onClick={this.sAdd.bind(this) }><span><Icon type="plus"/></span></li>
                    </ul>
                    {
                        //<ul className="menu-wrap">

                        //     <li className="oneMenu" id="checked">
                        //     <span>HI</span>
                        //     <ul className="twoMenu-wrap">
                        //         <li className="twoMenu twoAdd"><span><Icon type="plus"/></span></li>
                        //     </ul>
                        // </li>
                        // <li className="oneMenu oneAdd"><span><Icon type="plus"/></span></li>

                        //</ul>
                    }
                </div>
                <div className="menuInfo" style={{
                    display: menuInfo
                }}>
                    <Card title="菜单信息" extra={<a onClick={this.remove.bind(this) }>删除菜单</a>}>
                        <label className="menuName-wrap">
                            <span>菜单名称: </span><div><Input type="text" id="menuName" placeholder={"请输入菜单名称"} value={thisName} onChange={(e) => { this.updateForm(e, 'name') } }/></div>
                        </label>
                        <br/>
                        <span>菜单内容</span>
                        <div className='menuContent-wrap'>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="key" key="1"><Input id="key" type="textarea" rows={10} value={thisKey} onChange={(e) => { this.updateForm(e, 'key') } }/></TabPane>
                                <TabPane tab="链接" key="2"><Input id="href" type="textarea" rows={10} value={thisHref} onChange={(e) => { this.updateForm(e, 'href') } }/></TabPane>
                            </Tabs>
                        </div>
                        <div className="btn-wrap">
                            <Button type="primary" size="large">保存</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '1',
            ajaxData: null
        };
        this.a = null;
    }
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    // getAjaxData() {
    //     request
    //         .post('avatar/queryAvatarList.do')
    //         .type("form")
    //         .send()
    //         .end((err, res) => {
    //             console.log(res);
    //             this.setState({
    //                 ajaxData:JSON.parse(res.text)
    //             });
    //         });
    // }
    // componentDidMount() {
    //     this.getAjaxData();
    // }
    render() {
        const SubMenu = Menu.SubMenu;
        return (
            <div className="container">
                <Row>
                    <Col span="4">
                        <Menu onClick={this.handleClick.bind(this) }
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.current]}
                            mode="inline"
                            >
                            <SubMenu key="sub1" disabled="true" title={<span>微信公众号</span>}>
                                <Menu.Item key="1">选项1</Menu.Item>
                                <Menu.Item key="2">选项2</Menu.Item>
                                <Menu.Item key="3">选项1</Menu.Item>
                                <Menu.Item key="4">选项2</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col span="20">
                        <Content/>
                    </Col>
                </Row>
            </div>

        );
    }
}
export default Index;
