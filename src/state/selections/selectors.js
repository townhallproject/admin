import { createSelector } from 'reselect';
import {
  includes,
  filter,
  map, 
  reduce,
  uniq,
} from 'lodash';
import moment from 'moment';
import { 
  LIVE_EVENTS_TAB, 
  PENDING_EVENTS_TAB, 
  STATES_LEGS 
} from '../../constants';
import {
  getAllEventsAsList,
  getAllOldEventsWithUserEmails,
} from '../events/selectors';
import { get116thCongress } from '../mocs/selectors';
import { statesAb } from '../../assets/data/states'


export const getPendingOrLiveTab = state => state.selections.selectedEventTab;
export const getActiveFederalOrState = state => state.selections.federalOrState;
export const getMode = state => state.selections.mode;
export const getCurrentHashLocation = state => state.selections.currentHashLocation;
export const getOldEventsActiveFederalOrState = state => state.selections.federalOrStateOldEvents;
export const getDateRange = state => state.selections.dateLookupRange;
export const getStatesToFilterArchiveBy = state => state.selections.filterByState;
export const includeLiveEventsInLookup = state => state.selections.includeLiveEvents;
export const getTempAddress = state => state.selections.tempAddress;

export const getLiveEventUrl = createSelector([getActiveFederalOrState], (federalOrState) => {
  if (includes(STATES_LEGS, federalOrState)) {
    return `state_townhalls/${federalOrState}`;
  }
  return 'townHalls';
});

export const getSubmissionUrl = createSelector([getActiveFederalOrState], (federalOrState) => {
  if (includes(STATES_LEGS, federalOrState)) {
    return `state_legislators_user_submission/${federalOrState}`;
  }
  return 'UserSubmission';
});

export const getArchiveUrl = createSelector([getActiveFederalOrState], (federalOrState) => {
  if (includes(STATES_LEGS, federalOrState)) {
    return `archived_state_town_halls/${federalOrState}`;
  }
  return 'archived_town_halls';
});

export const getEventsToShowUrl = createSelector([getPendingOrLiveTab, getSubmissionUrl, getLiveEventUrl], 
    (liveOrPending, submissionUrl, liveEventUrl) => {
    if (liveOrPending === LIVE_EVENTS_TAB) {
        return liveEventUrl
    } else if (liveOrPending === PENDING_EVENTS_TAB) {
        return submissionUrl
    }
    return null;
});

export const getPeopleNameUrl = createSelector([getActiveFederalOrState, getMode], (federalOrState, mode) => {
  if (mode === 'candidate') {
    if (includes(STATES_LEGS, federalOrState)) {
      return `state_candidate_keys/${federalOrState}`;
    }
    return 'candidate_keys';
  }
  if (includes(STATES_LEGS, federalOrState)) {
    return `state_legislators_id/${federalOrState}`;
  }
  return 'mocID';
});

export const getPeopleDataUrl = createSelector([getActiveFederalOrState, getMode], (federalOrState, mode) => {
  if (mode === 'candidate') {
    return 'candidate_data';
  }
  if (includes(STATES_LEGS, federalOrState)) {
    return `state_legislators_data/${federalOrState}`;
  }
  return 'mocData';
});

export const getFilteredArchivedEvents = createSelector(
  [
    includeLiveEventsInLookup, 
    getStatesToFilterArchiveBy, 
    getAllOldEventsWithUserEmails,
    getAllEventsAsList
  ], 
  (includeLive, states, oldEvents, liveEvents) => {
    const allEvents = includeLive ? [...oldEvents, ...liveEvents] : oldEvents;
    if (!states.length) {
      return allEvents;
    }
    return filter(allEvents, (event) => {
      return includes(states, event.state);
    })
});

export const getEventsAsDownloadObjects= createSelector([getFilteredArchivedEvents], (allEvents) => {
   return map(allEvents, eventData => {

        const convertedTownHall = {};
        convertedTownHall.Entered_By = eventData.enteredBy || eventData.userEmail;
        convertedTownHall.Member = eventData.displayName || eventData.Member;
        convertedTownHall.Event_Name = eventData.eventName ? eventData.eventName : ' ';
        convertedTownHall.Location = eventData.Location ? eventData.Location : eventData.location ? eventData.location : ' ';
        convertedTownHall.Meeting_Type = eventData.meetingType;
        let district = eventData.district ? '-' + eventData.district : ' ';
        convertedTownHall.District = eventData.state + district;
        convertedTownHall.govtrack_id = eventData.govtrack_id || ' ';
        convertedTownHall.Party = eventData.party;
        convertedTownHall.State = eventData.state;
        convertedTownHall.State_name = eventData.stateName ? eventData.stateName : statesAb[eventData.state] ? statesAb[eventData.state] : eventData.state;
        if (eventData.repeatingEvent) {
          convertedTownHall.Repeating_Event = eventData.repeatingEvent;
          convertedTownHall.Date = ' ';
        } else if (eventData.dateString) {
          convertedTownHall.Repeating_Event = ' ';
          convertedTownHall.Date = eventData.dateString;
        } else {
          convertedTownHall.Repeating_Event = ' ';
          convertedTownHall.Date = eventData.dateObj ? 
            moment(eventData.dateObj).format('ddd, MMM D YYYY') :
            moment(eventData.timestamp).format('ddd, MMM D YYYY');
        }
        convertedTownHall.Time_Start = eventData.Time ? eventData.Time : moment(eventData.timestamp).format('H A');
        convertedTownHall.Time_End = eventData.timeEnd || ' ';
        convertedTownHall.Time_Zone = eventData.timeZone || ' ';
        convertedTownHall.Zone_ID = eventData.zoneString || ' ';
        convertedTownHall.Address = eventData.address;
        convertedTownHall.Notes = (() => {
          if (eventData.Notes) {
            return eventData.Notes.replace(/"/g, '\'');
          }
          if (eventData.notes) {
            return eventData.notes.replace(/"/g, '\'');
          }
          return ' ';
        })();
        convertedTownHall.Map_Icon = eventData.iconFlag;
        convertedTownHall.Link = eventData.link || 'https://townhallproject.com/?eventId=' + eventData.eventId;
        convertedTownHall.Link_Name = eventData.linkName || ' ';
        convertedTownHall.dateNumber = eventData.yearMonthDay || moment(eventData.timestamp).format('YYYY-MM-DD');
        return convertedTownHall;
    })
})

export const getDataForArchiveChart = createSelector(
  [getFilteredArchivedEvents],
  (allEvents) => {
    if (!allEvents) {
      return [];
    }
    return map(reduce(allEvents, (acc, cur) => {
      const party = cur.party ? cur.party.substring(0, 1) : 'None';
      if (acc[party] >= 0) {
        acc[party] = acc[party] + 1;
      }
      return acc;
    }, {
      D: 0,
      R: 0,
      I: 0,
      None: 0,
    }), (value, key) => {
      return {
        party: key,
        value
      }
    })
  }
)

export const get116MissingMemberReport = createSelector([getFilteredArchivedEvents, get116thCongress], (events, mocs) => {
    return map(mocs, (moc) => {
    
      const eventsForMoc = filter(events, { govtrack_id: moc.govtrack_id });
      const hasEvent = filter(eventsForMoc, { meetingType: 'Town Hall' });
      const eventTypes = uniq(map(eventsForMoc, 'meetingType'));

      return {
        memberId: moc.govtrack_id,
        hasEvent: hasEvent.length > 0,
        name: moc.displayName,
        party: moc.party,
        chamber: moc.chamber,
        state: moc.state,
        district: moc.district || '',
        number_of_town_halls: hasEvent.length,
        type_of_events: eventTypes,
        eventIds: eventsForMoc.map(event => event.eventId),
      }
    })
})

export const get116CongressSenateResults = createSelector([get116MissingMemberReport], (mocs) => {
    const allInChamber = filter(mocs, {chamber: 'upper'});
    return reduce(allInChamber, (acc, cur) => {
      if (cur.hasEvent) {
        if (cur.party[0].toLowerCase() === 'd') {
          acc.dEvents ++;
        } else if (cur.party[0].toLowerCase() === 'r') {
          acc.rEvents++;
        } else {
          acc.otherEvents++;
        }
      } else {
        if (cur.party[0].toLowerCase() === 'd') {
          acc.dMissing++;
        } else if (cur.party[0].toLowerCase() === 'r') {
          acc.rMissing++;
        } else {
          acc.otherMissing++;
        }
      }
      return acc;
    }, {
      dMissing: 0,
      dEvents: 0,
      rMissing: 0,
      rEvents: 0,
      otherMissing: 0,
      otherEvents: 0,
    })
})

export const get116CongressHouseResults = createSelector([get116MissingMemberReport], (mocs) => {
  const allInChamber = filter(mocs, {
    chamber: 'lower'
  });
  return reduce(allInChamber, (acc, cur) => {
    if (cur.hasEvent) {
      if (cur.party[0].toLowerCase() === 'd') {
        acc.dEvents++;
      } else if (cur.party[0].toLowerCase() === 'r') {
        acc.rEvents++;
      } else {
        acc.otherEvents++;
      }
    } else {
      if (cur.party[0].toLowerCase() === 'd') {
        acc.dMissing++;
      } else if (cur.party[0].toLowerCase() === 'r') {
        acc.rMissing++;
      } else {
        acc.otherMissing++;
      }
    }
    return acc;
  }, {
    dMissing: 0,
    dEvents: 0,
    rMissing: 0,
    rEvents: 0,
    otherMissing: 0,
    otherEvents: 0,
  })
})

export const getCongressReport = createSelector([get116CongressSenateResults, get116CongressHouseResults], 
  (senateCount, houseCount) => {
      return map(senateCount, (value, key) => {
        return [{
          x: 'senate',
          y: value,
      },
      {
        x: 'house',
        y: houseCount[key],
      },
    ]
  })
})
