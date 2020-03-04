import React from 'react';
import {
  Form, Icon, Input, Button, Checkbox, Select,
} from 'antd';
import { map } from 'lodash';

import { statesAb } from '../../assets/data/states';
import './style.scss';
import { LEVEL_FEDERAL, LEVEL_STATE } from '../../constants';
import AddCampaignOrRoleForm from '../AddCampaignOrRoleForm';

const { Option } = Select;

const children = map(statesAb, (value, key) => (<Option key={key}>{value}</Option>));

const stateChambers = [
  {
    value: 'upper',
    label: 'upper',
  },
  {
    value: 'lower',
    label: 'lower',
  },
  {
    value: 'statewide',
    label: 'Gov',
  },
  {
    value: 'citywide',
    label: 'Mayor',
  },
];

const federalChambers = [{
  value: 'upper',
  label: 'Senate',
},
{
  value: 'lower',
  label: 'House',
},
{
  value: 'nationwide',
  label: 'Pres',
},
];

class AddPersonForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      canSubmit: false
    }
  }

  handleChange = (e) => {
    const {
      form,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({ canSubmit: true })
        // form.resetFields();
      }
    });
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

        addNewPerson(values);
        // form.resetFields();
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
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
        <Form onSubmit={this.handleSubmit} {...formItemLayout} className="add-person-form" >
          <h1>{formTitle}</h1>
          <h4>Person info</h4>

          <Form.Item
            {...noLabelFormItemLayout}
          >
            {getFieldDecorator('displayName', {
              rules: [{ required: true }],
            })(
              <Input placeholder="Full Name" />
            )}
          </Form.Item>
          <Form.Item
            {...noLabelFormItemLayout}
          >
            {getFieldDecorator('party', {
              rules: [{ required: true, }],
            })(
              <Select onChange={this.handleChange}>
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
              initialValue: false,
            })(
              <Checkbox onChange={this.handleChange}>
                Currently in office
              </Checkbox>
            )}
          </Form.Item>
          <Form.Item
            {...noLabelFormItemLayout}
          >
            {getFieldDecorator('is_candidate', {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Checkbox onChange={this.handleChange}>
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
        <h4>Role info</h4>
        {getFieldValue('in_office') && currentlyEditingPerson &&
          <AddCampaignOrRoleForm
            candidate={false}
            formTitle="Current office"
            person={currentlyEditingPerson}
            saveRole={addOfficeToPerson}
          />}
        {getFieldValue('is_candidate') && currentlyEditingPerson && 
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
