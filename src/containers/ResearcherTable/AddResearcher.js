import React from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select } from 'antd';
import { statesAb } from '../../assets/data/states'
import { contactMethods } from './constants'

class AddResearcherForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return

      // Format date value before submit.
      const values = {
        ...fieldsValue,
        firstContact: fieldsValue.firstContact.format('YYYY-MM-DD'),
        volunteerConfirmation: fieldsValue.volunteerConfirmation.format('YYYY-MM-DD')
      }
      console.log(values) // here is where the values should be added to state
      this.props.form.resetFields()
    })
  }

  setValidationRules = (required=false, message='This field is required') => {
    return {
      rules: [{
        required: required,
        message: message,
        whitespace: required
      }]
    }
  }

  parseStates = () => {
    return Object.values(statesAb).map(state => {
      return <Select.Option key={state} value={state}>{state}</Select.Option>
    })
  }

  parseContactMethods = () => {
    return contactMethods.map(contactMethod => {
      return <Select.Option key={contactMethod} value={contactMethod}>{contactMethod}</Select.Option>
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Name">
              {getFieldDecorator('name', this.setValidationRules(true))(
                <Input placeholder="Enter name" />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email">
              {getFieldDecorator('email', this.setValidationRules(true))(
                <Input placeholder="Enter email" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Zip Code">
              {getFieldDecorator('zipCode', this.setValidationRules())(
                <Input placeholder="Enter zip code" />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State">
              {getFieldDecorator('stateName', this.setValidationRules())(
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
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Phone Number">
              {getFieldDecorator('phoneNumber', this.setValidationRules(true))(
                <Input placeholder="Enter phone number" />
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Method of Initial Contact">
              {getFieldDecorator('contactMethod', this.setValidationRules())(
                <Select
                placeholder="Select contact method">
                  {this.parseContactMethods()}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <Form.Item label="Volunteer Interest Confirmation" extra="Please enter the date this researcher confirmed their interest in volunteering.">
              {getFieldDecorator('volunteerConfirmation', this.setValidationRules(true))(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="First Contact" extra="Please enter the date this researcher was first contacted.">
              {getFieldDecorator('firstContact', this.setValidationRules(true))(<DatePicker />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
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
