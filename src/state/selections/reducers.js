import {
  CHANGE_EVENTS_TAB, 
  CHANGE_FEDERAL_STATE_RADIO, 
  GET_URL_HASH_SUCCESS,
  CHANGE_DATE_LOOKUP,
  CHANGE_STATE_FILTERS,
  TOGGLE_INCLUDE_LIVE_EVENTS,
  CHANGE_MODE, 
  CHANGE_MOC_END_POINT,
  GENERAL_FAIL,
  CLEAR_ADDRESS,
  SET_TEMP_ADDRESS,
  CHANGE_CHAMBER_FILTER,
  CHANGE_EVENT_FILTER,
  CHANGE_LEGISLATIVE_BODY_FILTER,
  CHANGE_NAME_FILTER,
  CHANGE_RESEARCHER_FILTER,
  CHANGE_ERROR_FILTER,
  CHANGE_EVENT_DATE_LOOKUP_TYPE,
} from "./constants";
import { 
  PENDING_EVENTS_TAB, 
  FEDERAL_RADIO_BUTTON,
  DATE_TIMESTAMP,
 } from "../../constants";

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
    case CHANGE_ERROR_FILTER:
      return {
        ...state,
        filterByError: action.payload,
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
          usState: action.payload.state,
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
    default:
      return state;
  }
};

export default selectionReducer;