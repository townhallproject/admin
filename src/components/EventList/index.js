import React from 'react';
import {
  List,
} from 'antd';

import EventCard from '../../components/EventCard';


class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(townHall) {
    const {
        archiveEvent,
        approveEvent,
        currentUserId,
        currentUserEmail,
        isAdmin,
        pathForArchive,
        pending,
        deleteEvent,
        pathForEvents,
        pathForPublishing,
        updateEvent,
        loading,
    } = this.props;
    const sameUser = townHall.userEmail === currentUserEmail || townHall.enteredBy === currentUserId;
    return (
      <List.Item>
        <EventCard 
          townHall={townHall}
          pending={pending}
          canApprove={!sameUser || isAdmin}
          loading={loading}
          approveEvent={() => {
            return approveEvent(townHall, pathForEvents, pathForPublishing)
          }}
          archiveEvent={() => {
            console.log('archiving')
            return archiveEvent(townHall, pathForEvents, pathForArchive)
          }}
          deleteEvent={() => {
            console.log('deleting')
            return deleteEvent(townHall, pathForEvents)
          }}
          updateEvent={(newData) => {
            console.log('updating')
            return updateEvent(newData, pathForEvents, townHall.eventId)
          }}
        />
      </List.Item>
    )
  }

  render () {
    const {
      eventsForList,
      loading,
    } = this.props;

    return (
      <React.Fragment>
        <List   
          className='event-list'              
          dataSource={eventsForList}
          renderItem={this.renderItem}
          loading={loading}
        />
      </React.Fragment>
    )
  }
}

export default EventList;
