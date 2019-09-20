import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import  PropTypes from 'prop-types';

import {
    Layout,
    Modal,
} from 'antd';

import userStateBranch from '../../state/users';
import selectionStateBranch from '../../state/selections';
import eventsStateBranch from '../../state/events';

import routes from '../../routes';
import AppHeader from './Header';
import SideNav from './SideNav';
import {
    auth,
    provider,
} from '../../utils/firebaseinit';

import NotAuthLayout from '../../components/NotAuthLayout';
import './style.scss';
import { 
  RSVP_DOWNLOAD_ACCESS,
  EVENT_DOWNLOAD_ACCESS,
  ADMIN_ACCESS,
  PENDING_EVENTS_TAB,
} from '../../constants';
import DownloadApp from '../DownloadApp';

const {
    Header,
    Sider,
    Content,
} = Layout;

class DefaultLayout extends Component {

  constructor() {
      super();
      this.login = this.login.bind(this); 
      this.logOut = this.logOut.bind(this);
      this.state = {
          confirmLoading: true,
          currentItem: '',
          items: [],
          user: null,
          username: '',
      }
    }

    componentDidMount() {
      const {
          getUserById,
          getLocation,
          requestTotalEventsCounts,
      } = this.props;

      requestTotalEventsCounts(PENDING_EVENTS_TAB);
      getLocation();
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            confirmLoading: false,
            user,
          });
          getUserById(user.uid, user.email, user.displayName)
        } else {
          this.setState({
            confirmLoading: false,
          });
        }
      });
      // if no user after 3 seconds, stop loading icon
      setTimeout(() => {
        this.setState({
          confirmLoading: false,
        });
      }, 5000);
    }

    logOut() {
      auth.signOut()
        .then(() => {
          this.setState({
            user: null
          });
        });
    }

    login() {
         const {
           getUserById
         } = this.props;
      this.setState({
        loading: true,
      })
      auth.signInWithRedirect(provider)
      auth.getRedirectResult()
        .then((result) => {
          const user = result.user;
          if (user) {
            this.setState({
              user
            });
            getUserById(user.id)
          }
        });
    }

    renderAdminApp() {
      const {
        user,
        activeEventTab,
        changeActiveEventTab,
        currentHashLocation,
        totalEventsCounts,
      } = this.props;
      return (
        <Layout>
          <Header>
            <AppHeader 
              userName={user.username}
              logOut={this.logOut}
            />
          </Header>
          <Layout>
            <Sider
              width={300}
              style={{
                overflow: 'auto', 
                height: '100vh',
              }}
            > 
              <SideNav 
                handleChangeTab={changeActiveEventTab}
                activeEventTab={activeEventTab}
                activeMenuItem={currentHashLocation}
                totalEventsCounts={totalEventsCounts}
              />
            </Sider>
            <Content style={{
              padding: 24, margin: 0, minHeight: 280,
            }}>   
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route 
                      key={idx} 
                      path={route.path} 
                      exact={route.exact} 
                      name={route.name} 
                      render={props => (
                        <route.component {...props} />
                      )} />)
                      : null
                  },
                )}
              </Switch>
            </Content>
          </Layout>
        </Layout>
      )
    }

    renderModal() {
      return (<Modal
              title="Town Hall Project Admin"
              visible={!this.state.user}
              onOk={this.login}
              okType="Log In"
              onCancel={this.handleCancel}
              confirmLoading={this.state.confirmLoading}
            >
            </Modal>
            )
    }

    renderLoadingApp() {
      return  (<Modal
              title="Town Hall Project Admin"
              visible={!this.state.user}
              onOk={this.login}
              okText="Log In"
              onCancel={this.handleCancel}
              confirmLoading={this.state.confirmLoading}
            >
              {this.state.confirmLoading ? <p>Checking login status</p> : <p>Login in to view admin site</p>}
            </Modal>
            )
         
    }

  render() {
    const {
      user,
      submitRequestAccess,
    } = this.props;
    if (this.state.user && user ) {
      if (user[ADMIN_ACCESS]) {
        return this.renderAdminApp()
      }
      if (user[RSVP_DOWNLOAD_ACCESS] || user[EVENT_DOWNLOAD_ACCESS]) {
        return (
          <DownloadApp 
            user={user}
            logOut={this.logOut}
          />);
      }
      return (
        <NotAuthLayout
          user={user}
          logOut={this.logOut}
          submitRequestAccess={submitRequestAccess}
        />)
    }
    return this.renderLoadingApp();
  }

}

DefaultLayout.propTypes = {
  activeEventTab: PropTypes.string.isRequired,
  changeActiveEventTab: PropTypes.func.isRequired,
  currentHashLocation: PropTypes.string.isRequired,
  getLocation: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
}

const mapStateToProps = state => ({
  activeEventTab: selectionStateBranch.selectors.getPendingOrLiveTab(state),
  currentHashLocation: selectionStateBranch.selectors.getCurrentHashLocation(state),
  user: userStateBranch.selectors.getCurrentUser(state),
  totalEventsCounts: eventsStateBranch.selectors.getTotalEventCounts(state),
});

const mapDispatchToProps = dispatch => ({
  changeActiveEventTab: (tab) => dispatch(selectionStateBranch.actions.changeActiveEventTab(tab)),
  getLocation: () => dispatch(selectionStateBranch.actions.getHashLocationAndSave()),
  getUserById: (id, email, name) => dispatch(userStateBranch.actions.requestUserById(id, email, name)),
  submitRequestAccess: (user, values) => dispatch(userStateBranch.actions.submitRequestAccess(user, values)),
  requestTotalEventsCounts: (path) => dispatch(eventsStateBranch.actions.requestTotalEventsCounts(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
