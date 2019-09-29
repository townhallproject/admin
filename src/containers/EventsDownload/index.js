import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';
import { CSVLink } from "react-csv";

import eventsStateBranch from '../../state/events';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import { LIVE_FEDERAL_PATH } from '../../state/constants';
import moment from 'moment';

import './style.scss';

class EventsDownload extends React.Component {

  constructor(props) {
    super(props);
    this.downloadEvents = this.downloadEvents.bind(this);
    this.csvLinkNew = React.createRef();
    this.csvLinkAll = React.createRef();
  }

  componentDidMount() {
    const {
      requestEvents,
    } = this.props;
    requestEvents(LIVE_FEDERAL_PATH);
  }

  downloadEvents(csvLink) {
    const {
      setUserEventDlDate,
      currentUser,
    } = this.props;
    csvLink.current.link.click();
    setUserEventDlDate(currentUser.uid);
  }

  render() {
    const {
      allEventsForDownload,
      newEventsForDownload,
      currentUser
    } = this.props;
    return (
      <React.Fragment>
        <p>There { newEventsForDownload.length === 1 ? 'is ' : 'are ' } 
          { newEventsForDownload.length } new 
          event{ newEventsForDownload.length === 1 ? ' ' : 's ' } 
          since your last download 
          on { moment(currentUser.last_event_download).format('dddd, M/D/YYYY, h:mm a') }. 
        </p>
        <CSVLink
          data={ newEventsForDownload }
          filename={ `thp_live_events_${moment().format('YYYY-MM-DD-kkmm')}.csv` }
          ref={ this.csvLinkNew }>
        </CSVLink>
        <Button
          onClick={ () => this.downloadEvents(this.csvLinkNew) }
          disabled={ newEventsForDownload.length === 0 }
          icon="download">
            Download New Events
        </Button>
        <CSVLink
          data={ allEventsForDownload }
          filename={`thp_all_live_events.csv`}
          ref={ this.csvLinkAll }>
        </CSVLink>
        <Button
          onClick={ () => this.downloadEvents(this.csvLinkAll) }
          icon="download">
            Download All Events
        </Button>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  allEventsForDownload: selectionStateBranch.selectors.getEventsForDownload(state),
  newEventsForDownload: selectionStateBranch.selectors.getNewEventsForDownload(state),
  currentUser: userStateBranch.selectors.getCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  requestEvents: (path) => dispatch(eventsStateBranch.actions.requestEvents(path)),
  setUserEventDlDate: (uid) => dispatch(userStateBranch.actions.setUserEventDlDate(uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsDownload);