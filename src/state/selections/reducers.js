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
} from "./constants";
import { 
  PENDING_EVENTS_TAB, 
  FEDERAL_RADIO_BUTTON,
 } from "../../constants";

const initialState = {
  selectedEventTab: PENDING_EVENTS_TAB,
  federalOrState: FEDERAL_RADIO_BUTTON,
  mode: '',
  currentHashLocation: '/',
  dateLookupRange: [],
  filterByState: [],
  includeLiveEvents: false,
  mocFederalOrState: FEDERAL_RADIO_BUTTON,
  tempAddress: {
    usState: null,
    lat: null,
    lng: null,
    address: null,
    state: null,
    stateName: null,
  }
};

const selectionReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default selectionReducer;