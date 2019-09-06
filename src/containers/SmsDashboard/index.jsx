import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import SmsCard from '../../components/SmsCard';

import smsUsersStateBranch from '../../state/sms-users';
import TabComponent from '../../components/Tabs';
import PotentialVolTable from '../../components/PotentialVolsTable';


class SmsUsersDashboard extends Component {

    componentDidMount() {
        const { requestTotalCount, requestCache, requestPotentialVols } = this.props;
        requestTotalCount();
        requestCache();
        requestPotentialVols()
    }

    render() {
        const { updatePotentialVols, potentialVolsWithReplyData, usersSentMessages, sendMessage, receiveMessage, usersWithReplies } = this.props;
        const messageApp = (<List
            className="comment-list"
            header={`Showing conversations within the last week. ${usersSentMessages.length} sent, ${usersWithReplies.length} replies`}
            itemLayout="horizontal"
            dataSource={usersWithReplies}
            renderItem={item => (
                <li key={item.phoneNumber}>
                    <SmsCard
                        item={item}
                        key={`${item.phoneNumber}-card`}
                        sendMessage={sendMessage}
                        receiveMessage={receiveMessage}
                    />
                </li>
            )}
        />)

        return (
            <React.Fragment>
                <div>Total number of sms users: {this.props.totalSmsUsers}</div>
                <TabComponent 
                    tabContents={[
                        {
                        title: 'send and view messages',
                        contents: messageApp
                        }, 
                        {
                            title: 'View and edit potential vols',
                            contents: (<PotentialVolTable potentialVols={potentialVolsWithReplyData} updatePotentialVols={updatePotentialVols}/>)
                        }, 
                ]}
                />
                
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    potentialVols: smsUsersStateBranch.selectors.getPotentialVols(state),
    totalSmsUsers: smsUsersStateBranch.selectors.getTotalSMSUsers(state),
    usersSentMessages: smsUsersStateBranch.selectors.getUsersWithMessages(state),
    usersWithReplies: smsUsersStateBranch.selectors.getUsersWithReplies(state),
    potentialVolsWithReplyData: smsUsersStateBranch.selectors.getPotentialVolsWithReplyData(state),
});

const mapDispatchToProps = dispatch => ({
    requestPotentialVols: () => dispatch(smsUsersStateBranch.actions.requestPotentialVols()),
    updatePotentialVols: (payload) => dispatch(smsUsersStateBranch.actions.updatePotentialVols(payload)),
    requestTotalCount: () => dispatch(smsUsersStateBranch.actions.requestTotalCount()),
    requestCache: () => dispatch(smsUsersStateBranch.actions.requestCache()),
    sendMessage: (payload) => dispatch(smsUsersStateBranch.actions.sendMessage(payload)),
    receiveMessage: (payload) => dispatch(smsUsersStateBranch.actions.receiveMessage(payload)),
});


export default connect(mapStateToProps, mapDispatchToProps)(SmsUsersDashboard);