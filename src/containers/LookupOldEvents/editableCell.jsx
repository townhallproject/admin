import React from 'react';
import { Input, Form } from 'antd';
import { EditableContext } from './achivedResultsTable';
import { MEETING_TYPE_OPTIONS, ICON_FLAGS } from '../../constants';
import { Select } from 'antd';
const Option = Select.Option;

export default class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.getInput = this.getInput.bind(this);
  }

  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing });
  };

  getInput() {
    const {
      record,
      dataIndex,
      inputType,
    } = this.props;
    switch (inputType) {
      case 'meetingType':
        return (
          <Select 
            key="meetingType"
            placeholder="Meeting type"
            onSelect={this.save}
            style={{width: 200}}
          >
            {MEETING_TYPE_OPTIONS.map((val) => {
              return <Option value={val}>{val}</Option>
            })}
          </Select>
        )
      case 'iconFlag':
        return (
          <Select 
            key="iconFlag"
            onSelect={this.save}
            style={{width: 200}}
          >
            {ICON_FLAGS.map((val) => {
              return <Option value={val.data}>{val.text}</Option>
            })}
          </Select>
        )
    };
    return <Input onPressEnter={this.save} onBlur={this.save} />;
  }

  save = (e) => {
    const {
      record,
      handleSave,
    } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave(record.eventId, values);
      this.toggleEdit();
    });
  };

  renderCell = form => {
    this.form = form;
    const {
      children,
      dataIndex,
      record,
      title,
    } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(this.getInput())
        // (<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)
        }
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      inputType,
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
