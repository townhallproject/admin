import React, { Component } from 'react';
import { Link } from "react-router-dom";

import {
  Affix,
  Menu,
  Badge,
} from 'antd';

import PropTypes from 'prop-types';

import { PENDING_EVENTS_TAB, LIVE_EVENTS_TAB, ARCHIVED_EVENTS_TAB, EVENT_MENU_ITEM } from '../../constants';

const propTypes = {
  children: PropTypes.node,
};

const SubMenu = Menu.SubMenu;

const defaultProps = {};

class SideNav extends Component {

    rootSubmenuKeys = ['events', 'mocs', 'researchers', 'resources', 'subscribers'];

    state = {
      openKeys: ['events'],
    };

    onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({
          openKeys
        });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
  render() {
    const {
      handleChangeTab,
      activeMenuItem,
      activeEventTab,
      totalEventsCounts,
    } = this.props;
    return (
        <Affix >

          <Menu
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            defaultSelectedKeys={activeMenuItem === EVENT_MENU_ITEM ? [activeEventTab] : [activeMenuItem]}
          >
            <Menu.Item key="home">
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <SubMenu key="events" title={<Link to="/events"><span>Events</span></Link>}>
              <Menu.Item key={PENDING_EVENTS_TAB} onClick={() => handleChangeTab(PENDING_EVENTS_TAB)}>
                <Link to="/events">Pending<Badge count={totalEventsCounts}></Badge></Link>
              </Menu.Item>
              <Menu.Item key={LIVE_EVENTS_TAB} onClick={() => handleChangeTab(LIVE_EVENTS_TAB)}>
                <Link to="/events">Live<Badge count={0}></Badge></Link>
              </Menu.Item>
              <Menu.Item key={ARCHIVED_EVENTS_TAB} onClick={() => handleChangeTab(ARCHIVED_EVENTS_TAB)}>
                <a href="/#/events">Archived</a>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="mocs">
              <Link to="/mocs">Members of Congress</Link>
            </Menu.Item>
            <Menu.Item key="researchers">
              <Link to="/researchers">Researchers</Link>
            </Menu.Item>
              <Menu.Item key="manage-access">
            <Link to="/manage-access">Manage Data Access</Link>
            </Menu.Item>
            <Menu.Item key="subscribers">
              <Link to="/subscribers">Subscribers</Link>
            </Menu.Item>
            <Menu.Item key="download-rsvps">
              <Link to="/download-rsvps">Download Rsvps</Link>
            </Menu.Item>
            <Menu.Item key="download-events">
              <Link to="/download-events">Download Events</Link>
            </Menu.Item>
            <Menu.Item key="resources">
              <Link to="/resources">Resources</Link>
            </Menu.Item>
            <Menu.Item key="sms-users">
              <Link to="/sms-users">SMS Users</Link>
            </Menu.Item>
          </Menu>
          </Affix>
    );
  }

}

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
