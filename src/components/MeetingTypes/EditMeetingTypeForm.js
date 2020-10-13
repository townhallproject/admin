import React, { Component } from "react";
import PropTypes from "prop-types";

import { Card, Form, Input, Button, Checkbox, Select, Spin } from "antd";
import "./style.scss";

import { connect } from "react-redux";

class EditMeetingTypeForm extends Component {
  state = {
    loading: false,
  };

  handleSubmit = (e) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err);
      }
      const title = "Success";
      const description = "You successfully edited this meeting type";
      this.props.openNotification(title, description);

      console.log(values);
    });
  };

  render() {
    const {
      name,
      description,
      icon,
      text,
      email,
      display,
    } = this.props.meetingType;
    const { getFieldDecorator } = this.props.form;

    const { Option } = Select;
    const { TextArea } = Input;

    const formMarkup = (
      <Form onSubmit={this.handleSubmit} className="meeting-type-form">
        <Form.Item className="input" label="Name">
          {getFieldDecorator("name", {
            initialValue: name,
            rules: [{ required: true, message: "Please input name!" }],
          })(<Input placeholder="Name" />)}
        </Form.Item>

        <Form.Item className="input" label="Icon name" hasFeedback>
          {getFieldDecorator("icon", {
            initialValue: icon,
            rules: [{ required: true, message: "Please select icon!" }],
          })(
            <Select placeholder="Please select an icon">
              {this.props.iconFlags.map((icon) => (
                <Option value={icon.data} key="icon.data">
                  {icon.text}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Description" className="input" labelAlign="left">
          {getFieldDecorator("description", {
            initialValue: description,
            rules: [{ required: true, message: "Please input description!" }],
          })(<TextArea rows={3} placeholder="Description" />)}
        </Form.Item>

        <Form.Item className="input">
          {getFieldDecorator("text", {
            valuePropName: "checked",
            initialValue: text,
          })(<Checkbox>Include in Text alerts</Checkbox>)}
        </Form.Item>

        <Form.Item className="input">
          {getFieldDecorator("email", {
            valuePropName: "checked",
            initialValue: email,
          })(<Checkbox>Include in Email alerts</Checkbox>)}
        </Form.Item>

        <Form.Item className="input">
          {getFieldDecorator("display", {
            valuePropName: "checked",
            initialValue: display,
          })(<Checkbox>Show in table by default</Checkbox>)}
        </Form.Item>

        <div className="button-container">
          <Button type="primary" htmlType="submit">
            Save
          </Button>

          <Button
            onClick={() => this.props.handleFormOpen()}
            type="danger"
            htmlType="button"
          >
            Cancel
          </Button>
        </div>
      </Form>
    );

    const displayedMarkup = this.state.loading ? (
      <div className="loader">
        <Spin size="large" />
      </div>
    ) : (
      formMarkup
    );

    return <Card className="form-card">{displayedMarkup}</Card>;
  }
}

EditMeetingTypeForm.propTypes = {
  meetingType: PropTypes.object.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  handleFormOpen: PropTypes.func.isRequired,
  openNotification: PropTypes.func.isRequired,
};

const wrappedForm = Form.create({ name: "EditMeetingTypeForm" })(
  EditMeetingTypeForm
);

const mapStateToProps = (state) => ({
  iconFlags: state.meetingTypes.iconFlags,
});

export default connect(mapStateToProps)(wrappedForm);
