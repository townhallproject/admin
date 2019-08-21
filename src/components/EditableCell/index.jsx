import React from 'react';
import { Input, Form, Icon } from 'antd';

import { EditableContext } from '../PotentialVolsTable';


export default class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    onChange = (e) => {
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            console.log(values)
            this.setState(values)
        });
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            console.log(record, values)
            this.toggleEdit();
            handleSave(record.phoneNumber, values);
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record } = this.props;
        const { editing } = this.state;
        console.log(editing, record[dataIndex], children)
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {

                    initialValue: record[dataIndex] || this.state[dataIndex],
                })(<Input ref={node => (this.input = node)} onChange={(value) => this.onChange(value, dataIndex)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                >
                    {[...children, <Icon type="edit"/>]}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{(form) => this.renderCell(form)}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}
