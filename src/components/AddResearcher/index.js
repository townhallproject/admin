import React from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select }
from 'antd';
import moment from 'moment'
import { statesAb } from '../../assets/data/states'
import { contactMethods } from './constants'
import './style.scss';


class AddResearcherForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return

      // Format date value before submit.
      const values = {
        ...fieldsValue,
        firstContact: fieldsValue.firstContact ? fieldsValue.firstContact.format('YYYY-MM-DD') : '',
        volConfirmation: fieldsValue.volConfirmation ? fieldsValue.volConfirmation.format('YYYY-MM-DD') : ''
      }
      this.props.saveUnregisteredVol(values)
      this.props.form.resetFields()
    })
  }

  setValidationRules = (required=false, initialValue='', message='This field is required') => {
    return {
      initialValue,
      rules: [{
        required,
        message
      }]
    }
  }

  parseStates = () => {
    return Object.entries(statesAb).map(state => {
      return <Select.Option key={state[0]} value={state[0]}>{state[1]}</Select.Option>
    })
  }

  parseContactMethods = () => {
    return contactMethods.map(contactMethod => {
      return <Select.Option key={contactMethod} value={contactMethod}>{contactMethod}</Select.Option>
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const noLabelFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout} className="add-researcher-form">
        <h1>Add New Researcher</h1>
        <Form.Item label="Name">
          {getFieldDecorator('name', this.setValidationRules(true))(
            <Input placeholder="Enter name" />
          )}
        </Form.Item>
        <Form.Item label="Email">
          {getFieldDecorator('email', this.setValidationRules(true))(
            <Input placeholder="Enter email" />
          )}
        </Form.Item>
        <Form.Item label="Zip Code">
          {getFieldDecorator('zipCode', this.setValidationRules(true))(
            <Input placeholder="Enter zip code" />
          )}
        </Form.Item>
        <Form.Item label="State">
          {getFieldDecorator('state', this.setValidationRules(true))(
            <Select
              showSearch
              placeholder="Select a state"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.parseStates()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator('phoneNumber', this.setValidationRules(true))(
            <Input placeholder="Enter phone number" />
          )}
        </Form.Item>
        <Form.Item label="Method of Initial Contact">
          {getFieldDecorator('contactMethod', this.setValidationRules())(
            <Select
            placeholder="Select contact method">
              {this.parseContactMethods()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Interest Confirmation" extra="Please enter the date this researcher confirmed their interest in volunteering.">
          {getFieldDecorator('volConfirmation', this.setValidationRules(true, moment()))(<DatePicker />)}
        </Form.Item>
        <Form.Item label="First Contact" extra="Please enter the date this researcher was first contacted.">
          {getFieldDecorator('firstContact', this.setValidationRules(true, moment()))(<DatePicker />)}
        </Form.Item>
        <Form.Item {...noLabelFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const AddResearcher = Form.create({ name: 'add_researcher_form' })(AddResearcherForm);

export default AddResearcher
