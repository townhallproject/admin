import React, { Component } from "react";
import PropTypes from "prop-types";

import { Card, Form, Input, Button, Checkbox, Select, Spin } from "antd";
import "./style.scss";

import { connect } from "react-redux";
import meetingTypesBranch from "../../state/meeting-types";

class EditMeetingTypeForm extends Component {
  state = {};

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      updateMeetingType,
      form,
      meetingType: { id },
    } = this.props;

    form.validateFields(async (err, values) => {
      if (err) {
        return console.log(err);
      }

      const formValues = { ...values, id };
      updateMeetingType(formValues);
    });
  };

  componentDidUpdate(previousProps) {
    if (this.props.success !== previousProps.success && this.props.success) {
      const title = "Success";
      const description = "You successfully edited this meeting type";
      this.props.openNotification(title, description);
      this.props.handleFormOpen();
    }
  }

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

        <Form.Item label="Description" className="input">
          {getFieldDecorator("description", {
            initialValue: description,
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

    const displayedMarkup = this.props.loading ? (
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
  handleFormOpen: PropTypes.func.isRequired,
  openNotification: PropTypes.func.isRequired,
  updateMeetingType: PropTypes.func.isRequired,
};

const wrappedForm = Form.create({ name: "EditMeetingTypeForm" })(
  EditMeetingTypeForm
);

const mapStateToProps = (state) => ({
  iconFlags: state.meetingTypes.iconFlags,
  loading: state.meetingTypes.updateLoading,
  success: state.meetingTypes.success,
});

const mapDispatchToProps = (dispatch) => ({
  updateMeetingType: (formValues) =>
    dispatch(meetingTypesBranch.actions.updateMeetingType(formValues)),
});

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
