import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
} from 'antd';

import eventsStateBranch from '../../state/events';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import EventList from '../../components/EventList';

import { 
    PENDING_EVENTS_TAB, 
    ARCHIVED_EVENTS_TAB, 
} from '../../constants';

import './style.scss';
import LookupOldEvents from '../LookupOldEvents';
import FederalStateRadioSwitcher from '../../components/FederalStateRadioSwitcher';

class EventsDashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.onRadioChange = this.onRadioChange.bind(this);
    }

    componentDidMount() {
        const {
          requestEvents,
          pathForEvents,
          requestEventsCounts,
          pendingOrLive,
        } = this.props;
        requestEvents(pathForEvents);
        requestEventsCounts(pendingOrLive);
    }

    componentDidUpdate(prevProps) {
        const {          
            requestEvents,
            pathForEvents,
            requestEventsCounts,
            pendingOrLive,
        } = this.props;
        if (prevProps.pathForEvents !== pathForEvents && pathForEvents) {
            requestEvents(pathForEvents);
        }
        if (prevProps.pendingOrLive !== pendingOrLive) {
            requestEventsCounts(pendingOrLive);
        }
    }

    onRadioChange({target}) {
        const {
          changeRadioButton
        } = this.props;
        changeRadioButton(target.value)
    }

    render () {
        const {
            isModerator,
            eventsForList,
            pendingOrLive,
            deleteEvent,
            approveEvent,
            archiveEvent,
            pathForEvents,
            pathForArchive,
            pathForPublishing,
            userSubmissionPath,
            updateEvent,
            eventsCounts,
            radioButtonValue,
            currentUserId,
            currentUserEmail,
            setTempAddress,
            tempAddress,
            clearTempAddress,
            setTimeZone,
        } = this.props;
        return (
            <React.Fragment>
                <Row
                    type="flex"
                    justify="center"
                >
                {/* <FederalStateRadioSwitcher 
                    onRadioChange={this.onRadioChange}
                    eventsCounts={eventsCounts}
                    defaultValue={radioButtonValue}
                /> */}
                </Row>
                {pendingOrLive === ARCHIVED_EVENTS_TAB ?
                <LookupOldEvents /> :
                <EventList  
                    pending={pendingOrLive === PENDING_EVENTS_TAB}
                    eventsForList={eventsForList}
                    pathForEvents={pathForEvents}
                    deleteEvent={deleteEvent}
                    approveEvent={approveEvent}
                    archiveEvent={archiveEvent}
                    isAdmin={!isModerator}
                    pathForArchive={pathForArchive}
                    pathForPublishing={pathForPublishing}
                    userSubmissionPath={userSubmissionPath}
                    updateEvent={updateEvent}
                    setTempAddress={setTempAddress}
                    currentUserId={currentUserId}
                    currentUserEmail={currentUserEmail}
                    tempAddress={tempAddress}
                    clearTempAddress={clearTempAddress}
                    setTimeZone={setTimeZone}
                />}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    currentUserId: userStateBranch.selectors.getCurrentUserId(state),
    currentUserEmail: userStateBranch.selectors.getCurrentUserEmail(state),
    isModerator: userStateBranch.selectors.getModeratorStatus(state),
    pendingOrLive: selectionStateBranch.selectors.getPendingOrLiveTab(state),
    eventsForList: eventsStateBranch.selectors.getAllEventsAsList(state),
    radioButtonValue: selectionStateBranch.selectors.getActiveFederalOrState(state),
    pathForEvents: selectionStateBranch.selectors.getEventsToShowUrl(state),
    pathForArchive: selectionStateBranch.selectors.getArchiveUrl(state),
    pathForPublishing: selectionStateBranch.selectors.getLiveEventUrl(state),
    userSubmissionPath: selectionStateBranch.selectors.getSubmissionUrl(state),
    eventsCounts: eventsStateBranch.selectors.getEventsCounts(state),
    tempAddress: selectionStateBranch.selectors.getTempAddress(state),
});

const mapDispatchToProps = dispatch => ({
    archiveEvent: (townHall, path, archivePath) => dispatch(eventsStateBranch.actions.archiveEvent(townHall, path, archivePath)),
    approveEvent: (townHall, path, livePath) => dispatch(eventsStateBranch.actions.approveEvent(townHall, path, livePath)),
    clearTempAddress: () => dispatch(selectionStateBranch.actions.clearTempAddress()),
    deleteEvent: (townHall, path) => dispatch(eventsStateBranch.actions.deleteEvent(townHall, path)),
    changeRadioButton: (value) => dispatch(selectionStateBranch.actions.changeFederalStateRadio(value)),
    requestEvents: (path) => dispatch(eventsStateBranch.actions.requestEvents(path)),
    setTempAddress: (address) => dispatch(selectionStateBranch.actions.setTempAddress(address)),
    updateEvent: (newData, path, eventId) => dispatch(eventsStateBranch.actions.updateExistingEvent(newData, path, eventId)),
    requestEventsCounts: (path) => dispatch(eventsStateBranch.actions.requestEventsCounts(path)),
    setTimeZone: (payload) => dispatch(selectionStateBranch.actions.getTimeZone(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashBoard);
