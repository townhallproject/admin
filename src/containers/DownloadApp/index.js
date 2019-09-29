import React, { Component } from 'react';
import  PropTypes from 'prop-types';

import {
    Layout,
    Tabs,
} from 'antd';

import { 
  RSVP_DOWNLOAD_ACCESS,
  EVENT_DOWNLOAD_ACCESS,
} from '../../constants';

import AppHeader from '../DefaultLayout/Header';
import RsvpTable from '../RsvpTable';
import EventsDownload from '../EventsDownload';

const {
  Header,
  Content,
} = Layout;
const { TabPane } = Tabs;

class DownloadApp extends Component {

  render() {
    const {
      user,
      logOut,
    } = this.props;
    return (
      <Layout>
        <Header>
          <AppHeader 
            userName={user.username}
            logOut={logOut}
          />
        </Header>
        <Layout>
          <Content>
            <Tabs>
              { user[RSVP_DOWNLOAD_ACCESS] &&
                <TabPane tab="Download RSVPs" key="rsvp">
                  <RsvpTable />
                </TabPane>
              }
              { user[EVENT_DOWNLOAD_ACCESS] &&
                <TabPane tab="Download Events" key="event">
                  <EventsDownload />
                </TabPane>
              }
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

DownloadApp.propTypes = {
  activeEventTab: PropTypes.string.isRequired,
  changeActiveEventTab: PropTypes.func.isRequired,
  currentHashLocation: PropTypes.string.isRequired,
  getLocation: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
}

export default DownloadApp;
