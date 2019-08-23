import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';
import { CSVLink, CSVDownload } from "react-csv";

import eventsStateBranch from '../../state/events';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import { LIVE_FEDERAL_PATH } from '../../state/constants';
import moment from 'moment';

class EventsDownload extends React.Component {

  constructor(props) {
    super(props);
    this.downloadEvents = this.downloadEvents.bind(this);
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
    csvLink.link.click();
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
          since { moment(currentUser.last_event_download).format('dddd, MMMM Do YYYY, h:mm a') }. 
        </p>
        <CSVLink
          data={ newEventsForDownload }
          filename={ `thp_live_events_${moment().format('YYYY-MM-DD-hhmma')}.csv` }
          ref={(r) => this.csvLinkNew = r}></CSVLink>
        <Button
          onClick={() => {this.downloadEvents(this.csvLinkNew);}}
          icon="download">
            Download New Events
        </Button>
        <CSVLink
          data={ allEventsForDownload }
          filename={`thp_all_live_events.csv`}
          ref={(r) => this.csvLinkAll = r}></CSVLink>
        <Button
          onClick={() => {this.downloadEvents(this.csvLinkAll);}}
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