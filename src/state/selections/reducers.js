import { 
  PENDING_EVENTS_TAB, 
  FEDERAL_RADIO_BUTTON,
  DATE_TIMESTAMP,
 } from "../../constants";


 import {
   makeConstant
 } from "../../utils";
 const STATE_BRANCH = 'SELECTIONS';

export const CHANGE_EVENTS_TAB = "CHANGE_EVENTS_TAB";
export const CHANGE_FEDERAL_STATE_RADIO = "CHANGE_FEDERAL_STATE_RADIO";
export const GET_URL_HASH = "GET_URL_HASH";
export const GET_URL_HASH_SUCCESS = "GET_URL_HASH_SUCCESS";
export const SELECTION_REQUEST_FAILED = "SELECTION_REQUEST_FAILED";
export const CHANGE_FEDERAL_STATE_RADIO_OLD_EVENT = "CHANGE_FEDERAL_STATE_RADIO_OLD_EVENT";
export const CHANGE_DATE_LOOKUP = "CHANGE_DATE_LOOKUP";
export const CHANGE_STATE_FILTERS = "CHANGE_STATE_FILTERS";
export const TOGGLE_INCLUDE_LIVE_EVENTS = "TOGGLE_INCLUDE_LIVE_EVENTS";
export const CHANGE_MODE = "CHANGE_MODE";
export const CHANGE_MOC_END_POINT = makeConstant(STATE_BRANCH, "CHANGE_MOC_END_POINT");
export const SET_TEMP_ADDRESS = makeConstant(STATE_BRANCH, "SET_TEMP_ADDRESS");
export const GEOCODE_TEMP_ADDRESS = makeConstant(STATE_BRANCH, "GEOCODE_TEMP_ADDRESS");
export const GENERAL_FAIL = makeConstant(STATE_BRANCH, "GENERAL_FAIL");
export const CHANGE_TIME_ZONE = makeConstant(STATE_BRANCH, "CHANGE_TIME_ZONE");
export const CHANGE_ARCHIVED_TIME_ZONE = makeConstant(STATE_BRANCH, "CHANGE_ARCHIVED_TIME_ZONE");
export const CHANGE_TIME_ZONE_SUCCESS = makeConstant(STATE_BRANCH, "CHANGE_TIME_ZONE_SUCCESS");
export const SET_START_TIME = makeConstant(STATE_BRANCH, "SET_START_TIME");
export const SET_END_TIME = makeConstant(STATE_BRANCH, "SET_END_TIME");
export const SET_DATE = makeConstant(STATE_BRANCH, "SET_DATE");
export const SET_TIME_ZONE = makeConstant(STATE_BRANCH, "SET_TIME_ZONE");
export const CLEAR_ADDRESS = makeConstant(STATE_BRANCH, "CLEAR_ADDRESS");
export const CHANGE_CHAMBER_FILTER = makeConstant(STATE_BRANCH, "CHANGE_CHAMBER_FILTER");
export const CHANGE_EVENT_FILTER = makeConstant(STATE_BRANCH, "CHANGE_EVENT_FILTER");
export const CHANGE_LEGISLATIVE_BODY_FILTER = makeConstant(STATE_BRANCH, "CHANGE_LEGISLATIVE_BODY_FILTER");
export const CHANGE_NAME_FILTER = makeConstant(STATE_BRANCH, "CHANGE_NAME_FILTER");
export const CHANGE_RESEARCHER_FILTER = makeConstant(STATE_BRANCH, "CHANGE_RESEARCHER_FILTER");
export const CHANGE_EVENT_DATE_LOOKUP_TYPE = makeConstant(STATE_BRANCH, "CHANGE_EVENT_DATE_LOOKUP_TYPE");
export const TOGGLE_FILTER_SMS_TO_LAST_WEEK = makeConstant(STATE_BRANCH, "TOGGLE_FILTER_SMS_TO_LAST_WEEK")

const initialState = {
  dateLookupType: DATE_TIMESTAMP,
  selectedEventTab: PENDING_EVENTS_TAB,
  federalOrState: FEDERAL_RADIO_BUTTON,
  mode: '',
  currentHashLocation: '/',
  dateLookupRange: [],
  filterByState: [],
  filterByChamber: 'all',
  filterByEventType: [],
  filterByLegislativeBody: 'federal',
  filterByName: false,
  filterByResearcher: false,
  filterByError: false,
  includeLiveEvents: false,
  mocFederalOrState: FEDERAL_RADIO_BUTTON,
  filterSMSToLastWeek: true,
  tempAddress: {
    usState: null,
    lat: null,
    lng: null,
    address: null,
    state: null,
    stateName: null,
  },
};

const selectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CHAMBER_FILTER:
      return {
        ...state,
        filterByChamber: action.payload,
      }
    case CHANGE_LEGISLATIVE_BODY_FILTER:
      return {
        ...state,
        filterByLegislativeBody: action.payload,
      }
    case CHANGE_EVENT_FILTER:
      return {
        ...state,
        filterByEventType: action.payload,
      }
    case CHANGE_NAME_FILTER:
      return {
        ...state,
        filterByName: action.payload,
      }
    case CHANGE_RESEARCHER_FILTER:
      return {
        ...state,
        filterByResearcher: action.payload,
      }
    case CHANGE_EVENTS_TAB:
      return {
        ...state,
        selectedEventTab: action.payload,
      };
    case CHANGE_FEDERAL_STATE_RADIO:
      return {
        ...state,
        federalOrState: action.payload
      }
    case CHANGE_MOC_END_POINT: 
      return {
        ...state,
        mocFederalOrState: action.payload,
      }
    case GET_URL_HASH_SUCCESS:
      return {
        ...state,
        currentHashLocation: action.payload
      }
    case CHANGE_DATE_LOOKUP:
      return {
        ...state,
        dateLookupRange: action.payload,
      }
    case CHANGE_STATE_FILTERS:
      return {
        ...state,
        filterByState: action.payload,
      }
    case TOGGLE_INCLUDE_LIVE_EVENTS:
      return {
        ...state,
        includeLiveEvents: action.payload,
      }
    case CHANGE_MODE:
      return {
        ...state,
        mode: action.payload,
      }
    case SET_TEMP_ADDRESS:
      return {
        ...state,
        tempAddress: {
          lat: action.payload.lat,
          lng: action.payload.lng,
          address: action.payload.address,
        }
      };
    case CLEAR_ADDRESS:
      return {
        ...state,
        tempAddress: initialState.tempAddress
      };
    case GENERAL_FAIL:
      console.error(action.payload)
      return {
        ...state,
      }
    case CHANGE_EVENT_DATE_LOOKUP_TYPE: 
      return {
        ...state,
        dateLookupType: action.payload,
      }
    case TOGGLE_FILTER_SMS_TO_LAST_WEEK: 
      return {
        ...state,
        filterSMSToLastWeek: action.payload,
      }
    default:
      return state;
  }
};

export default selectionReducer;