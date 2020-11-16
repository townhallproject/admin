import { createSelector } from "reselect";
import { includes, filter, map, orderBy, reduce, uniq } from "lodash";
import { getAllResearchers } from "../researchers/selectors";
import moment from "moment-timezone";
import {
  LIVE_EVENTS_TAB,
  PENDING_EVENTS_TAB,
  STATES_LEGS,
  FEDERAL_RADIO_BUTTON,
  DATE_TIMESTAMP,
  DATE_OBJ,
  DATE_CREATED,
} from "../../constants";
import {
  getAllOldEventsWithUserEmails,
  getAllEvents,
  getAllFederalAndStateLiveEvents,
} from "../events/selectors";
import { getCurrentUser } from "../users/selectors";
import { get116thCongress } from "../mocs/selectors";
import { getResearchersEmailById } from "../researchers/selectors";

export const getPendingOrLiveTab = (state) => state.selections.selectedEventTab;
export const getActiveFederalOrState = (state) =>
  state.selections.federalOrState;
export const getMode = (state) => state.selections.mode;
export const getCurrentHashLocation = (state) =>
  state.selections.currentHashLocation;
export const getOldEventsActiveFederalOrState = (state) =>
  state.selections.federalOrStateOldEvents;
export const getDateRange = (state) => state.selections.dateLookupRange;
export const getStatesToFilterArchiveBy = (state) =>
  state.selections.filterByState;
export const includeLiveEventsInLookup = (state) =>
  state.selections.includeLiveEvents;
export const getTempAddress = (state) => state.selections.tempAddress;
export const getChamber = (state) => state.selections.filterByChamber;
export const getEventTypes = (state) => state.selections.filterByEventType;
export const getLegislativeBody = (state) =>
  state.selections.filterByLegislativeBody;
export const getNameFilter = (state) => state.selections.filterByName;
export const getResearcherFilter = (state) =>
  state.selections.filterByResearcher;
export const getDateLookupType = (state) => state.selections.dateLookupType;
export const getFilterSMSToLastWeek = (state) =>
  state.selections.filterSMSToLastWeek;

export const getLiveEventUrl = createSelector(
  [getActiveFederalOrState],
  (federalOrState) => {
    if (federalOrState !== FEDERAL_RADIO_BUTTON) {
      return `state_townhalls/${federalOrState}`;
    }
    return "townHalls";
  }
);

export const getSubmissionUrl = createSelector(
  [getActiveFederalOrState],
  (federalOrState) => {
    if (federalOrState !== FEDERAL_RADIO_BUTTON) {
      return `state_legislators_user_submission/${federalOrState}`;
    }
    return "UserSubmission";
  }
);

export const getArchiveUrl = createSelector(
  [getActiveFederalOrState],
  (federalOrState) => {
    if (federalOrState !== FEDERAL_RADIO_BUTTON) {
      return `archived_state_town_halls/${federalOrState}`;
    }
    return "archived_town_halls";
  }
);

export const getEventsToShowUrl = createSelector(
  [getPendingOrLiveTab, getSubmissionUrl, getLiveEventUrl],
  (liveOrPending, submissionUrl, liveEventUrl) => {
    if (liveOrPending === LIVE_EVENTS_TAB) {
      return liveEventUrl;
    } else if (liveOrPending === PENDING_EVENTS_TAB) {
      return submissionUrl;
    }
    return null;
  }
);

export const getPeopleNameUrl = createSelector(
  [getActiveFederalOrState, getMode],
  (federalOrState, mode) => {
    if (mode === "candidate") {
      if (includes(STATES_LEGS, federalOrState)) {
        return `state_candidate_keys/${federalOrState}`;
      }
      return "candidate_keys";
    }
    if (includes(STATES_LEGS, federalOrState)) {
      return `state_legislators_id/${federalOrState}`;
    }
    return "mocID";
  }
);

export const getPeopleDataUrl = createSelector(
  [getActiveFederalOrState, getMode],
  (federalOrState, mode) => {
    if (mode === "candidate") {
      return "candidate_data";
    }
    if (includes(STATES_LEGS, federalOrState)) {
      return `state_legislators_data/${federalOrState}`;
    }
    return "mocData";
  }
);

export const normalizeEventSchema = (eventData) => {
  let normalizedEvent = {};

  normalizedEvent.editable = eventData.editable;
  normalizedEvent.errorMessage = (() => {
    if (eventData.error) {
      return `${eventData.error.dataPath} ${eventData.error.message}`;
    }
    return " ";
  })();

  normalizedEvent.eventId = eventData.eventId;
  normalizedEvent.enteredBy = eventData.enteredBy || eventData.userEmail;
  normalizedEvent.eventName = eventData.eventName ? eventData.eventName : " ";
  normalizedEvent.displayName = eventData.displayName || eventData.Member;
  normalizedEvent.officePersonId = eventData.officePersonId || " ";
  normalizedEvent.meetingType = eventData.meetingType || " ";

  normalizedEvent.location = eventData.location
    ? eventData.location
    : eventData.Location
    ? eventData.Location
    : " ";
  normalizedEvent.address = eventData.address || " ";
  normalizedEvent.lat = eventData.lat || " ";
  normalizedEvent.lng = eventData.lng || " ";

  normalizedEvent.govtrack_id = eventData.govtrack_id || 0;
  normalizedEvent.party = eventData.party || " ";
  normalizedEvent.level = eventData.level || " ";
  normalizedEvent.chamber = eventData.chamber || " ";
  normalizedEvent.state = eventData.state || " ";
  normalizedEvent.district = eventData.district;

  normalizedEvent.timestamp = eventData.timestamp || eventData.dateObj;

  if (eventData.timeZone) {
    normalizedEvent.timeStart = eventData.dateString
      ? moment(`${eventData.dateString} ${eventData.Time}`).format(
          "MMMM Do YYYY, h:mm a z"
        ) + `${eventData.timeZone}`
      : moment
          .tz(eventData.timeStart, eventData.timeZone)
          .format("MMMM Do YYYY, h:mm a z");
  } else {
    normalizedEvent.timeStart = eventData.dateString
      ? `${eventData.dateString} ${eventData.Time}`
      : moment.tz(eventData.timeStart).format("MMMM Do YYYY, h:mm a z");
  }

  // Live events in Firebase currently store timeEnd as human-readable strings, e.g. "12:00 PM", instead of ISO-8601
  normalizedEvent.timeEnd = eventData.timeEnd || " ";
  normalizedEvent.timeZone = eventData.timeZone || " ";
  normalizedEvent.dateValid = eventData.dateValid || false;
  normalizedEvent.validated = eventData.validated || false;
  normalizedEvent.ada_accessible = eventData.ada_accessible || false;

  normalizedEvent.error = eventData.error || false;

  normalizedEvent.notes = (() => {
    if (eventData.Notes) {
      return eventData.Notes.replace(/"/g, "'");
    }
    if (eventData.notes) {
      return eventData.notes.replace(/"/g, "'");
    }
    return " ";
  })();

  normalizedEvent.link =
    eventData.link ||
    "https://townhallproject.com/?eventId=" + eventData.eventId;

  normalizedEvent.iconFlag = eventData.iconFlag || " ";
  normalizedEvent.dateCreated = eventData.dateCreated || " ";
  // Live events in Firebase store lastUpdated as a timestamp. Archived events in Firestore use ISO-8601.
  normalizedEvent.lastUpdated = moment(eventData.lastUpdated).toISOString();
  normalizedEvent.internalNotes = eventData.internalNotes || " ";

  return normalizedEvent;
};

export const getAllEventsForAnalysis = createSelector(
  [
    includeLiveEventsInLookup,
    getAllOldEventsWithUserEmails,
    getAllFederalAndStateLiveEvents,
    getDateRange,
    getDateLookupType,
  ],
  (includeLive, oldEvents, liveEvents, dateRange, dateLookupType) => {
    oldEvents = map(oldEvents, (event) => {
      event.editable = true;
      return event;
    });

    if (dateLookupType === DATE_CREATED) {
      oldEvents = filter(oldEvents, (event) => {
        if (event[DATE_CREATED]) {
          let date = moment(event[DATE_CREATED]).valueOf();
          return date >= dateRange[0] && date <= dateRange[1];
        }
        let date = moment(event.lastUpdated).valueOf();
        return date >= dateRange[0] && date <= dateRange[1];
      });
    }

    if (includeLive) {
      liveEvents = filter(liveEvents, (event) => {
        const dateKey =
          dateLookupType === DATE_TIMESTAMP ? DATE_OBJ : dateLookupType;
        let date;
        if (event[dateKey] && moment(event[dateKey]).isValid()) {
          date = moment(event[dateKey]).valueOf();
        } else if (
          !event[dateKey] &&
          event.dateString &&
          dateKey === DATE_OBJ
        ) {
          date = moment(event.dateString).valueOf();
        } else {
          return false;
        }
        return date >= dateRange[0] && date <= dateRange[1];
      });
      liveEvents = map(liveEvents, (event) => {
        event.editable = false;
        return event;
      });
      return [...oldEvents, ...liveEvents];
    }
    return oldEvents;
  }
);

export const getReturnedStateEventsLength = createSelector(
  [getAllEventsForAnalysis],
  (allEvents) => {
    return filter(allEvents, (event) => event.level === "state").length;
  }
);

export const getReturnedErrorEventsLength = createSelector(
  [getAllEventsForAnalysis],
  (allEvents) => {
    return filter(allEvents, (event) => event.error).length;
  }
);

export const getTotalUnFilteredOldEventsCount = createSelector(
  [getAllEventsForAnalysis],
  (totalEvents) => totalEvents.length
);

export const getFilteredEvents = createSelector(
  [
    getAllEventsForAnalysis,
    getStatesToFilterArchiveBy,
    getChamber,
    getEventTypes,
    getLegislativeBody,
    getNameFilter,
    getResearcherFilter,
    getResearchersEmailById,
  ],
  (
    allEvents,
    states,
    chamber,
    events,
    legislativeBody,
    name,
    researcherEmail,
    researchersEmailById
  ) => {
    let filteredEvents = allEvents;
    filteredEvents = map(filteredEvents, normalizeEventSchema);

    if (states.length) {
      filteredEvents = filter(filteredEvents, (event) => {
        return includes(states, event.state);
      });
    }
    if (chamber !== "all") {
      filteredEvents = filter(filteredEvents, (event) => {
        return chamber === event.chamber;
      });
    }
    if (events.length > 0) {
      filteredEvents = filter(filteredEvents, (event) => {
        return includes(events, event.meetingType);
      });
    }
    filteredEvents = filter(filteredEvents, (event) => {
      if (legislativeBody === "federal") {
        return event.level === "federal" || event.level === " ";
      }
      return event.level === "state" && event.state === legislativeBody;
    });
    if (name) {
      filteredEvents = filter(filteredEvents, (event) => {
        return name === event.displayName;
      });
    }
    if (researcherEmail) {
      filteredEvents = filter(filteredEvents, (event) => {
        return researcherEmail === researchersEmailById[event.enteredBy];
      });
    }
    filteredEvents = orderBy(filteredEvents, ["timestamp"], ["desc"]);
    return filteredEvents;
  }
);

export const getFilteredUniqueNames = createSelector(
  [getFilteredEvents],
  (allEvents) => {
    const allNames = map(allEvents, (eventData) => {
      return eventData.displayName;
    });
    return [...new Set(allNames)];
  }
);

export const getFilteredOldEventsLength = createSelector(
  [getFilteredEvents],
  (filtered) => {
    return filtered.length;
  }
);

export const getEventsAsDownloadObjects = createSelector(
  [getFilteredEvents, getAllResearchers],
  (allEvents, researchers) => {
    return map(allEvents, (eventData) => {
      // Future: Customize normalizedEvent > CSV field mappings if desired
      const newEventData = { ...eventData };
      researchers.forEach((researcher) => {
        if (researcher.id === eventData.enteredBy) {
          newEventData.enteredBy = researcher.email;
        }

        if (researcher.uid === eventData.enteredBy) {
          newEventData.enteredBy = researcher.email;
        }

        if (researcher.email === eventData.enteredBy) {
          newEventData.enteredBy = researcher.email;
        }

        if (!Boolean(eventData.enteredBy)) {
          newEventData.enteredBy = "Not available";
        }
      });
      return newEventData;
    });
  }
);

export const getEventsForDownload = createSelector(
  [getAllEvents],
  (allEvents) => {
    return map(allEvents, (eventData) => {
      const convertedTownHall = {};
      convertedTownHall.Member = eventData.displayName || eventData.Member;
      convertedTownHall.Chamber = eventData.chamber;
      convertedTownHall.Event_Name = eventData.eventName
        ? eventData.eventName
        : " ";
      convertedTownHall.Location = eventData.Location
        ? eventData.Location
        : " ";
      convertedTownHall.Meeting_Type = eventData.meetingType;
      let district = eventData.district ? "-" + eventData.district : " ";
      convertedTownHall.District = eventData.state + district;
      convertedTownHall.govtrack_id = eventData.govtrack_id || " ";
      convertedTownHall.Party = eventData.party;
      convertedTownHall.State = eventData.state;
      convertedTownHall.State_name = eventData.stateName
        ? eventData.stateName
        : eventData.State;
      if (eventData.repeatingEvent) {
        convertedTownHall.Repeating_Event = eventData.repeatingEvent;
        convertedTownHall.Date = " ";
      } else if (eventData.dateString) {
        convertedTownHall.Repeating_Event = " ";
        convertedTownHall.Date = eventData.dateString;
      } else {
        convertedTownHall.Repeating_Event = " ";
        convertedTownHall.Date = moment(eventData.dateObj).format(
          "ddd, MMM D YYYY"
        );
      }
      convertedTownHall.Time_Start = eventData.Time;
      convertedTownHall.Time_End = eventData.timeEnd || " ";
      convertedTownHall.Time_Zone = eventData.timeZone || " ";
      convertedTownHall.Zone_ID = eventData.zoneString || " ";
      convertedTownHall.Address = eventData.address;
      convertedTownHall.Notes = eventData.Notes
        ? eventData.Notes.replace(/"/g, "'")
        : " ";
      convertedTownHall.Map_Icon = eventData.iconFlag;
      convertedTownHall.Link =
        eventData.link ||
        "https://townhallproject.com/?eventId=" + eventData.eventId;
      convertedTownHall.Link_Name = eventData.linkName || " ";
      convertedTownHall.dateNumber = eventData.yearMonthDay;
      convertedTownHall.Last_Updated = moment(eventData.lastUpdated).format(
        "MMM D YYYY, h:mm a"
      );
      return convertedTownHall;
    });
  }
);

export const getNewEventsForDownload = createSelector(
  [getEventsForDownload, getCurrentUser],
  (allEvents, user) => {
    return filter(allEvents, (event) => {
      return (
        !user.last_event_download ||
        moment(event.Last_Updated, "MMM D YYYY, h:mm a").valueOf() >
          user.last_event_download
      );
    });
  }
);

export const getDataForArchiveChart = createSelector(
  [getFilteredEvents],
  (allEvents) => {
    if (!allEvents || !allEvents.length) {
      return [];
    }
    return map(
      reduce(
        allEvents,
        (acc, cur) => {
          const party = cur.party ? cur.party.substring(0, 1) : "None";
          if (acc[party] >= 0) {
            acc[party] = acc[party] + 1;
          }
          return acc;
        },
        {
          D: 0,
          R: 0,
          I: 0,
          None: 0,
        }
      ),
      (value, key) => {
        return {
          party: key,
          value,
        };
      }
    );
  }
);

export const get116MissingMemberReport = createSelector(
  [getFilteredEvents, get116thCongress],
  (events, mocs) => {
    return map(mocs, (moc) => {
      const eventsForMoc = filter(events, { govtrack_id: moc.govtrack_id });
      const hasEvent = filter(eventsForMoc, { meetingType: "Town Hall" });
      const eventTypes = uniq(map(eventsForMoc, "meetingType"));

      return {
        memberId: moc.govtrack_id,
        hasEvent: hasEvent.length > 0,
        name: moc.displayName,
        party: moc.party,
        chamber: moc.chamber,
        state: moc.state,
        district: moc.district || "",
        number_of_town_halls: hasEvent.length,
        type_of_events: eventTypes,
        eventIds: eventsForMoc.map((event) => event.eventId),
      };
    });
  }
);

export const get116CongressSenateResults = createSelector(
  [get116MissingMemberReport],
  (mocs) => {
    const allInChamber = filter(mocs, { chamber: "upper" });
    return reduce(
      allInChamber,
      (acc, cur) => {
        if (cur.hasEvent) {
          if (cur.party[0].toLowerCase() === "d") {
            acc.dEvents++;
          } else if (cur.party[0].toLowerCase() === "r") {
            acc.rEvents++;
          } else {
            acc.otherEvents++;
          }
        } else {
          if (cur.party[0].toLowerCase() === "d") {
            acc.dMissing++;
          } else if (cur.party[0].toLowerCase() === "r") {
            acc.rMissing++;
          } else {
            acc.otherMissing++;
          }
        }
        return acc;
      },
      {
        dMissing: 0,
        dEvents: 0,
        rMissing: 0,
        rEvents: 0,
        otherMissing: 0,
        otherEvents: 0,
      }
    );
  }
);

export const get116CongressHouseResults = createSelector(
  [get116MissingMemberReport],
  (mocs) => {
    const allInChamber = filter(mocs, {
      chamber: "lower",
    });
    return reduce(
      allInChamber,
      (acc, cur) => {
        if (cur.hasEvent) {
          if (cur.party[0].toLowerCase() === "d") {
            acc.dEvents++;
          } else if (cur.party[0].toLowerCase() === "r") {
            acc.rEvents++;
          } else {
            acc.otherEvents++;
          }
        } else {
          if (cur.party[0].toLowerCase() === "d") {
            acc.dMissing++;
          } else if (cur.party[0].toLowerCase() === "r") {
            acc.rMissing++;
          } else {
            acc.otherMissing++;
          }
        }
        return acc;
      },
      {
        dMissing: 0,
        dEvents: 0,
        rMissing: 0,
        rEvents: 0,
        otherMissing: 0,
        otherEvents: 0,
      }
    );
  }
);

export const getCongressReport = createSelector(
  [get116CongressSenateResults, get116CongressHouseResults],
  (senateCount, houseCount) => {
    return map(senateCount, (value, key) => {
      return [
        {
          x: "senate",
          y: value,
        },
        {
          x: "house",
          y: houseCount[key],
        },
      ];
    });
  }
);
