import {
  DELETE_EVENT,
  DELETE_EVENT_SUCCESS,
  REQUEST_EVENTS,
  REQUEST_PENDING_EVENTS_SUCCESS,
  REQUEST_EVENTS_FAILED,
  REQUEST_PENDING_EVENTS,
  REQUEST_PENDING_EVENTS_FAILED,
  ARCHIVE_EVENT,
  ARCHIVE_EVENT_SUCCESS,
  APPROVE_EVENT,
  APPROVE_EVENT_SUCCESS,
  REQUEST_OLD_EVENTS,
  REQUEST_OLD_EVENTS_SUCCESS,
  RESET_OLD_EVENTS,
  SET_LOADING,
  UPDATE_EXISTING_EVENT,
  GET_USER_EMAIL_FOR_EVENT,
  REQUEST_EVENTS_SUCCESS,
  REQUEST_EVENTS_COUNTS,
  REQUEST_EVENTS_COUNTS_SUCCESS,
  REQUEST_FEDERAL_EVENTS_COUNTS_SUCCESS,
  REQUEST_STATE_EVENTS_COUNTS_SUCCESS,
  CLEAR_EVENTS_COUNTS,
  DECREMENT_EVENTS,
  DECREMENT_TOTAL_EVENTS,
  REQUEST_TOTAL_EVENTS_COUNTS,
  REQUEST_TOTAL_EVENTS_COUNTS_SUCCESS,
} from './constants';


export const requestEvents = path => ({
  type: REQUEST_EVENTS,
  payload: path,
});

export const storeEventsInState = events => ({
  type: REQUEST_EVENTS_SUCCESS,
  payload: events,
});

export const resetOldEvents = () => ({
  type: RESET_OLD_EVENTS,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const requestOldEvents = (path, date, dates) => ({
    type: REQUEST_OLD_EVENTS,
    payload: {
        path,
        date,
        dates,
    }
})
  
export const addOldEventToState = events => ({
  type: REQUEST_OLD_EVENTS_SUCCESS,
  payload: events
});

export const joinEnteredByEmailForEvents = (uid, eventId) => ({
  type: GET_USER_EMAIL_FOR_EVENT,
  payload: {
    uid,
    eventId,
  }
});

export const getEventsSuccess = events => ({
  type: REQUEST_PENDING_EVENTS_SUCCESS,
  payload: events
});

export const getEventsFailed = err => ({
  type: REQUEST_EVENTS_FAILED,
  payload: err
});

export const requestPendingEvents = () => ({
  type: REQUEST_PENDING_EVENTS
});

export const requestPendingEventsFailed = err => ({
  type: REQUEST_PENDING_EVENTS_FAILED,
  payload: err
});

export const deleteEvent = (townHall, path) => ({
  type: DELETE_EVENT, 
  payload: {
    townHall,
    path,
  }
});

export const deleteEventSuccess = (eventId) => ({
  type: DELETE_EVENT_SUCCESS,
  payload: eventId,
});

export const archiveEvent = (townHall, path, archivePath) => ({
  type: ARCHIVE_EVENT,
  payload: {
    townHall,
    path,
    archivePath,
  }
});

export const archiveEventSuccess = (eventId) => ({
  type: ARCHIVE_EVENT_SUCCESS,
  payload: eventId,
});

export const approveEvent = (townHall, path, livePath) => ({
  type: APPROVE_EVENT,
  payload: {
    townHall,
    path,
    livePath,
  }
});

export const updateExistingEvent = (updateData, path, eventId) => ({
  type: UPDATE_EXISTING_EVENT,
  payload: {
    updateData,
    path,
    eventId,
  }
});

export const requestEventsCounts = (path) => ({
  type: REQUEST_EVENTS_COUNTS,
  payload: path,
});

export const requestEventsCountsSuccess = (payload) => ({
  type: REQUEST_EVENTS_COUNTS_SUCCESS,
  payload: payload,
});

export const requestFederalEventsCountsSuccess = (payload) => ({
  type: REQUEST_FEDERAL_EVENTS_COUNTS_SUCCESS,
  payload: payload,
});

export const requestStateEventsCountsSuccess = (payload) => ({
  type: REQUEST_STATE_EVENTS_COUNTS_SUCCESS,
  payload: payload,
});

export const requestTotalEventsCounts = () => ({
  type: REQUEST_TOTAL_EVENTS_COUNTS,
});

export const requestTotalEventsCountsSuccess = (payload) => ({
  type: REQUEST_TOTAL_EVENTS_COUNTS_SUCCESS,
  payload: payload,
});

export const clearEventsCounts = () => ({
  type: CLEAR_EVENTS_COUNTS,
});

export const decrementEvents = (key) => ({
  type: DECREMENT_EVENTS,
  payload: key,
});

export const decrementTotalEvents = (key) => ({
  type: DECREMENT_TOTAL_EVENTS,
  payload: key,
});

export const approveEventSuccess = (eventId) => ({
  type: APPROVE_EVENT_SUCCESS,
  payload: eventId,
});