import {
  DELETE_EVENT_SUCCESS,
  REQUEST_EVENTS_SUCCESS,
  REQUEST_EVENTS_FAILED,
  ARCHIVE_EVENT_SUCCESS,
  APPROVE_EVENT_SUCCESS,
  REQUEST_OLD_EVENTS_SUCCESS,
  SET_LOADING,
  UPDATE_EVENT_SUCCESS,
  UPDATE_OLD_EVENT_SUCCESS,
  GET_USER_EMAIL_FOR_EVENT_SUCCESS,
  GET_USER_EMAIL_FOR_OLD_EVENT_SUCCESS,
  RESET_OLD_EVENTS,
  REQUEST_EVENTS_COUNTS_SUCCESS,
  REQUEST_EVENTS_COUNTS_FAIL,
  CLEAR_EVENTS_COUNTS,
  DECREMENT_EVENTS,
  DECREMENT_TOTAL_EVENTS,
  REQUEST_TOTAL_EVENTS_COUNTS_SUCCESS,
  GENERAL_FAIL,
} from "./constants";
import { filter, map } from "lodash";

const initialState = {
  allEvents: {},
  allOldEvents: {},
  eventsCounts: {},
  totalEventsCounts: {},
  error: null,
  loading: false,
};


const eventReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REQUEST_EVENTS_SUCCESS:
      return {
        ...state,
        allEvents: payload,
        error: null
      };
    case REQUEST_OLD_EVENTS_SUCCESS:
      return {
        ...state,
        allOldEvents: [...state.allOldEvents, ...payload],
        error: null
      };
    case GET_USER_EMAIL_FOR_EVENT_SUCCESS:
      return {
        ...state,
        allEvents: state.allEvents.map((event) => event.eventId === payload.eventId ? {
          ...event,
          userEmail: payload.email
        } : event)
    };
    case GET_USER_EMAIL_FOR_OLD_EVENT_SUCCESS:
      console.log(payload)
      return {
        ...state,
        allOldEvents: state.allOldEvents.map((event) => event.eventId === payload.eventId ? {
          ...event,
          userEmail: payload.email
        } : event)
      };
    case RESET_OLD_EVENTS:
      return {
        ...state,
        allOldEvents: [],
        error: null,
      }
    case REQUEST_EVENTS_FAILED:
      console.log(`GET_EVENTS_FAILED: ${payload}`);
      return {
        ...state,
        error: payload
      };
    case DELETE_EVENT_SUCCESS:
      return {
        ...state,
        allEvents: filter(state.allEvents, (ele) => ele.eventId !== payload)
      }
    case ARCHIVE_EVENT_SUCCESS:
      return {
        ...state,
        allEvents: filter(state.allEvents, (ele) => ele.eventId !== payload)
      }
    case APPROVE_EVENT_SUCCESS:
      return {
        ...state,
        allEvents: filter(state.allEvents, (ele) => ele.eventId !== payload)
      }
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      }
    case UPDATE_EVENT_SUCCESS:
      return {
        ...state,
        allEvents: map(state.allEvents, (ele) => {
          if(ele.eventId === payload.eventId) {
            return {...ele, ...payload}
          }
          return ele
        })
      }
    case UPDATE_OLD_EVENT_SUCCESS:
      return {
        ...state,
        allOldEvents: map(state.allOldEvents, (ele) => {
          if(ele.eventId === payload.eventId) {
            return {...ele, ...payload}
          }
          return ele
        })
      }
    case REQUEST_EVENTS_COUNTS_SUCCESS:
      return {
        ...state,
        eventsCounts: payload,
      }
    case REQUEST_TOTAL_EVENTS_COUNTS_SUCCESS:
      return {
        ...state,
        totalEventsCounts: payload
      }
    case CLEAR_EVENTS_COUNTS:
      return {
        ...state,
        eventsCounts: {},
        error: null,
      }
    case DECREMENT_EVENTS:
      return {
        ...state,
        eventsCounts: {
          ...state.eventsCounts,
          [payload]: state.eventsCounts[payload] -= 1,
        }
      }
    case DECREMENT_TOTAL_EVENTS:
      return {
        ...state,
        totalEventsCounts: {
          ...state.totalEventsCounts,
          [payload]: state.totalEventsCounts[payload] -= 1,
        }
      }
    case REQUEST_EVENTS_COUNTS_FAIL:
      console.log(payload);
      return {
        ...state,
        error: payload
      };
    case GENERAL_FAIL:
      console.log(payload);
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
};

export default eventReducer;