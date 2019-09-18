import React from 'react';
import { Input, Form, Select } from 'antd';
import { EditableContext } from './achivedResultsTable';
import StateDistrictEditor from '../../components/StateDistrictEditor';
import { MEETING_TYPE_OPTIONS, ICON_FLAGS } from '../../constants';

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
            onBlur={this.save}
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
            onBlur={this.save}
            style={{width: 200}}
          >
            {ICON_FLAGS.map((val) => {
              return <Option value={val.data}>{val.text}</Option>
            })}
          </Select>
        )
      case 'level':
        return (
          <Select 
            key="level"
            onSelect={this.save}
            onBlur={this.save}
            style={{width: 100}}
          >
            <Option value="federal">federal</Option>
            <Option value="state">state</Option>
          </Select>
        )
      case 'state':
        return (
          <StateDistrictEditor 
            saveChanges={this.save}
          />
        )
    };
    return (
      <Input 
        onPressEnter={this.save}
        onBlur={this.save} 
      />)
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
      console.log(this.form.getFieldValue('state'));
      if (Object.keys(values)[0] === 'state') {
        values = {
          state: values.state.usState,
          district: values.state.district,
        };
      }
      console.log(values);
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
          initialValue: dataIndex === 'state' ? 
            {usState: record['state'], district: record['district']} : record[dataIndex],
        })(this.getInput())}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
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
