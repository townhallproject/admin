import { createSelector } from 'reselect';
import {
  filter,
  find,
  map,
  includes
} from 'lodash';

export const getAllRsvps = state => state.rsvps.allRsvps;
export const getAllEventsWithRsvps = state => state.rsvps.allEventsWithRsvps;

export const getAllEventIds = createSelector([getAllEventsWithRsvps], allEvents => map(allEvents, 'eventId'))

export const getAllCurrentRsvps = createSelector(
  [getAllRsvps, getAllEventIds, getAllEventsWithRsvps], 
    (allRsvps, allIds, allEvents) => {
    return map(filter(allRsvps, (rsvp) => includes(allIds, rsvp.eventId)), filteredRsvp => {
        const event = find(allEvents, (event) => event.eventId === filteredRsvp.eventId)
          return {
            ...filteredRsvp,
            title: `${event.displayName} ${event.party} ${event.district ? `${event.state}-${event.district}`: event.state}`,
            time: event.Time,
            date: event.dateString,
            location: event.Location ? `${event.Location} ${event.address}` : `${event.address}`,
          }
        })
    });

export const getAllCurrentRsvpsForCsv = createSelector([getAllCurrentRsvps], (allCurrent) => {
  const arrayOfObjects =  map(allCurrent, currentRsvp => {
    const toReturn = {
      ...currentRsvp,
    }
    // accessibly_needs: ""
    // can_contact: false
    // date: "Tue, Aug 20 2019"
    // email_address: "nwilliams@townhallproject.com"
    // eventId: "-LlmMPaGyMbfVU8GwdYI"
    // family_name: "Williams"
    // given_name: "Nathan"
    // location: "Portland Public Library - Rines Auditorium 5 Monument Sq, Portland, ME 04101"
    // phone: "2063002296"
    // postal_code: "97212"
    // time: "6:00 PM"
    // title: "Susan Collins R ME"
     return [toReturn.given_name,
      toReturn.family_name,
      toReturn.email_address,
      toReturn.phone,
      `'''${toReturn.postal_code}'''`,
      '',
      toReturn.accessibly_needs,
      toReturn.solicitation_source || '',
      '',
      toReturn.date_submitted || '',
      toReturn.can_contact,
      toReturn.location,
     ]
  });

  const headers = ["First Name",
    "Last Name",
    "email",
    "zip code",
    "phone number",
    "confirmed call 2",
    "Accessibly Needs",
    "How Did You Kear",
    "confirmed call 1",
    "Date Rsvped",
    "Can contact",
    "Location",
  ]

  return [headers, ...arrayOfObjects]
})

export const getAllRsvpsForCsv = createSelector([getAllRsvps], (allCurrent) => {
  return map(allCurrent, currentRsvp => {
    const toReturn = {
      ...currentRsvp,
      ...currentRsvp.can_contact
    }
    console.log(currentRsvp.can_contact)
    return toReturn;
  });
})