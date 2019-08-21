import {
    Button,
} from 'antd';
import React from 'react';
import {
    CSVLink,
} from 'react-csv';

class EventsDownloadButton extends React.Component {

  render() {
    const {
      eventsForDownload,
    } = this.props;
    return (
      <Button
      icon="download"
      block
      >
        <CSVLink
          data={ eventsForDownload }
          filename={`live_events.csv`}
        > Download Events
        </CSVLink>
      </Button>
    )
  }
}

export default EventsDownloadButton;