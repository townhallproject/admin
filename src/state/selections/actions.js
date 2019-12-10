import {
  CHANGE_EVENTS_TAB, 
  CHANGE_FEDERAL_STATE_RADIO,
  GET_URL_HASH,
  CHANGE_MODE,
  CHANGE_DATE_LOOKUP,
  CHANGE_STATE_FILTERS,
  TOGGLE_INCLUDE_LIVE_EVENTS,
  CHANGE_MOC_END_POINT,
  CLEAR_ADDRESS,
  GEOCODE_TEMP_ADDRESS,
  CHANGE_TIME_ZONE,
  CHANGE_ARCHIVED_TIME_ZONE,
  CHANGE_CHAMBER_FILTER,
  CHANGE_EVENT_FILTER,
  CHANGE_LEGISLATIVE_BODY_FILTER,
  CHANGE_NAME_FILTER,
  CHANGE_RESEARCHER_FILTER,
  CHANGE_EVENT_DATE_LOOKUP_TYPE,
} from "./constants";

export const changeActiveEventTab = tab => ({
  type: CHANGE_EVENTS_TAB,
  payload: tab
});

export const changeFederalStateRadio = value => ({
  type: CHANGE_FEDERAL_STATE_RADIO,
  payload: value
});

export const changeMocEndpoint = value => ({
  type: CHANGE_MOC_END_POINT,
  payload: value,
})

export const changeMode = value => ({
  type: CHANGE_MODE,
  payload: value,
})

export const getHashLocationAndSave = () => ({
  type: GET_URL_HASH,
});

export const changeDateLookup = (dates) => ({
  type: CHANGE_DATE_LOOKUP,
  payload: dates,
});

export const changeChamberFilter = (chamber) => ({
  type: CHANGE_CHAMBER_FILTER,
  payload: chamber,
});

export const changeLegislativeBodyFilter = (legislativeBody) => ({
  type: CHANGE_LEGISLATIVE_BODY_FILTER,
  payload: legislativeBody,
});

export const changeEventFilter = (events) => ({
  type: CHANGE_EVENT_FILTER,
  payload: events,
});

export const changeStateFilters = (states) => ({
  type: CHANGE_STATE_FILTERS,
  payload: states,
});

export const changeNameFilter = (name) => ({
  type: CHANGE_NAME_FILTER,
  payload: name,
});

export const changeResearcherFilter = (email) => ({
  type: CHANGE_RESEARCHER_FILTER,
  payload: email,
})

export const toggleIncludeLiveEventsInLookup = (include) => ({
  type: TOGGLE_INCLUDE_LIVE_EVENTS,
  payload: include,
});

export const setTempAddress = payload => ({
  payload,
  type: GEOCODE_TEMP_ADDRESS,
});

export const clearTempAddress = () => ({
  type: CLEAR_ADDRESS,
});

export const getTimeZone = (payload) => ({
  type: CHANGE_TIME_ZONE,
  payload,
});

export const getArchivedTimeZone = (payload) => ({
  type: CHANGE_ARCHIVED_TIME_ZONE,
  payload,
});

export const changeEventDateLookupType = (payload) => ({
  type: CHANGE_EVENT_DATE_LOOKUP_TYPE,
  payload,
})