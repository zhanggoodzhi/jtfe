import * as React from "react";
import {Tag, Card, Modal, Form, Row, Col, Table, DatePicker, Select, Input, Button} from "antd";
import * as request from "superagent";
class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (<Card className="blue-card" title="添加服务者" style={{ width: '%50' }}>
            <div>{this.props.children ? this.props.children : ""}</div>
        </Card>);
    }
}
Edit.propTypes = {
    children: React.PropTypes.object
};
export default Edit;
