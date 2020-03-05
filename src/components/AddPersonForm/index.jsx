import React from 'react';
import {
  Form, Icon, Input, Button, Card, Checkbox, Select,
} from 'antd';
import { map } from 'lodash';

import './style.scss';
import AddCampaignOrRoleForm from '../AddCampaignOrRoleForm';

const { Option } = Select;

class AddPersonForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      canSubmit: false,
      in_office: false,
      is_candidate: false,
      personInfoSubmitted: false,
      displayName: '',
      party: ''
    }
  }

  handleChange = (e, field) => {
    this.setState(
      {[field]: e.target.checked},
      () => {
        if (this.state.in_office || this.state.is_candidate) {
          this.setState({ canSubmit: true })
        } else {
          this.setState({ canSubmit: false })
        }
      }
    )
  }

  handleSubmit(e) {
    const {
      addNewPerson,
      form,
    } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          personInfoSubmitted: true,
          displayName: values.displayName,
          party: values.party
        })
        // addNewPerson(values);
        form.resetFields();
      }
    });
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      formTitle,
      saveCampaignToPerson,
      currentlyEditingPerson,
      addOfficeToPerson,
    } = this.props;
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
    console.log('currentlyEditingPerson', currentlyEditingPerson)
    return (
      <React.Fragment>
        {this.state.personInfoSubmitted ?
          <Card title={this.state.displayName} className="add-person-form">
            <h4>{this.state.party}</h4>
            {this.state.in_office && <p><Icon type="check-circle" /> Currently in office</p>}
            {this.state.is_candidate && <p><Icon type="check-circle" /> Currently running for office</p>}
          </Card>
        :
          <Form onSubmit={this.handleSubmit} {...formItemLayout} className="add-person-form" >
            <h1>{formTitle}</h1>
            <h4>Person info</h4>

            <Form.Item
              {...noLabelFormItemLayout}
            >
              {getFieldDecorator('displayName', {
                rules: [{ required: true, message: 'Name is required' }],
              })(
                <Input placeholder="Full Name" />
              )}
            </Form.Item>
            <Form.Item
              {...noLabelFormItemLayout}
            >
              {getFieldDecorator('party', {
                rules: [{ required: true, message: 'Party selection is required'}],
              })(
                <Select>
                  <Option value="Democratic">Democratic</Option>
                  <Option value="Republican">Republican</Option>
                  <Option value="Independent">Independent</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...noLabelFormItemLayout}
            >
              {getFieldDecorator('in_office', {
                  valuePropName: 'checked',
                  initialValue: false
              })(
                <Checkbox onChange={(e) => this.handleChange(e, 'in_office')}>
                  Currently in office
                </Checkbox>
              )}
            </Form.Item>
            <Form.Item
              {...noLabelFormItemLayout}
            >
              {getFieldDecorator('is_candidate', {
                  valuePropName: 'checked',
                  initialValue: false
              })(
                <Checkbox onChange={(e) => this.handleChange(e, 'is_candidate')}>
                  Is running for an office
                </Checkbox>
              )}
            </Form.Item>

            <Form.Item  {...noLabelFormItemLayout}>
              <Button disabled={!this.state.canSubmit} type="primary" htmlType="submit" className="login-form-button">
                Save to database
              </Button>
            </Form.Item>
          </Form>
        }
        <h4>Role info</h4>
        {this.state.in_office && currentlyEditingPerson &&
          <AddCampaignOrRoleForm
            candidate={false}
            formTitle="Current office"
            person={currentlyEditingPerson}
            saveRole={addOfficeToPerson}
          />}
        {this.state.is_candidate && currentlyEditingPerson && 
          <AddCampaignOrRoleForm 
            candidate={true} 
            formTitle="Current campaign" 
            person={currentlyEditingPerson} 
            saveRole={saveCampaignToPerson}
          />}

      </React.Fragment>
    );
  }
}


export default Form.create({
  name: 'add_person_form'
})(AddPersonForm);
