import React, { Component } from 'react';

import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Radio,
  Layout,
  Checkbox,
} from 'antd';
import AppHeader from '../../containers/DefaultLayout/Header';
import './style.scss';
import { MODERATOR_ACCESS, ADMIN_ACCESS } from '../../constants';

const {
  Header,
  Content,
} = Layout;
const { TextArea } = Input;

const RadioGroup = Radio.Group;

class NotAuthLayout extends Component {
    
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderThankYou = this.renderThankYou.bind(this);
    }

    handleSubmit (e){
        const {
          user,
          submitRequestAccess,
        } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            submitRequestAccess(user, values)
            }
        });
    }

    renderThankYou() {
        const {
            user
        } = this.props;
        return (
            <div>
                <h2>Request access</h2>
                <h4>Thank you {user.username}, we'll review your request ASAP</h4>
            </div>
        )
    }

    render() {
        const {
        user,
        logOut
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
             <Layout>
                 <Header>
                    <AppHeader
                        userName={user.username}
                        logOut={logOut}
                    />
                </Header>
                <Content>
                    <Row>
                        <Col span={10} offset={8}>
                        {user.requestedAccess ? this.renderThankYou() :
                        <Form onSubmit={this.handleSubmit} className="request-access-form">
                            <h2>Request access</h2>
                            <h4>You are are signed in as {user.email}</h4>
                            <div>You aren't currently an authorized user. Please select the authorization level you want, and we'll get back to you soon. </div>
                            <Form.Item>
                            {getFieldDecorator('accessLevel', {
                                initialValue: '',
                                })(
                                        <RadioGroup 
                                            onChange={this.onChange}
                                        >
                                            <Radio value="rsvpDownloads">Download RSVPs to events</Radio>
                                            <Radio value="eventDownloads">Download Events</Radio>
                                            <Radio value="mocDownload">Access to our Member of Congress database</Radio>
                                            <Radio value={ADMIN_ACCESS}>Full Admin</Radio>
                                        </RadioGroup>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('moderator', {
                                    initialValue: true,
                                    valuePropName: 'checked',
                                    })(<Checkbox>Can approve only other people's events (not your own)</Checkbox>

                                    )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('notes', {
                                    initialValue: '',
                                    })(<TextArea placeholder="Notes to us about why you want access" autosize={{ minRows: 2, maxRows: 6 }} />

                                    )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>}
                    </Col>
                </Row>
            </Content>
        </Layout>
        );
    }

}

export default Form.create({})(NotAuthLayout);

