import React from 'react';
import { connect } from 'react-redux';

import eventsStateBranch from '../../state/events';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import { LIVE_FEDERAL_PATH } from '../../state/constants';
import EventsDownloadButton from '../../components/EventsDownloadButton';

class EventsDownload extends React.Component {

  componentDidMount() {
    const {
      requestEvents,
    } = this.props;
    requestEvents(LIVE_FEDERAL_PATH);
  }

  render() {
    const {
      eventsForDownload,
    } = this.props;
    return (
      <EventsDownloadButton 
        eventsForDownload={eventsForDownload}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  eventsForDownload: selectionStateBranch.selectors.getEventsForDownload(state),
});

const mapDispatchToProps = (dispatch) => ({
  requestEvents: (path) => dispatch(eventsStateBranch.actions.requestEvents(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsDownload);