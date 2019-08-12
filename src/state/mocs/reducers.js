import {
  GET_MOCS_SUCCESS,
  GET_MOCS_FAILED,
  ADD_CANDIDATE_FAILURE,
  GET_CONGRESS_BY_SESSION_SUCCESS,
  GET_CONGRESS_BY_SESSION_FAILED,
  UPDATE_MISSING_MEMBER_SUCCESS,
  UPDATE_IN_OFFICE_SUCCESS,
  UPDATE_IN_OFFICE_FAIL,
  UPDATE_DISPLAY_NAME_SUCCESS,
  UPDATE_DISPLAY_NAME_FAIL,
} from "./constants";
import { map } from 'lodash';

const initialState = {
  allMocIds: [],
  116: [],
  115: [],
  error: null,
};

const mocReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MOCS_SUCCESS:
      return {
        ...state,
        allMocIds: map(action.payload.data),
        error: null
      };
    case GET_MOCS_FAILED:
      console.log(`GET_MOCS_FAILED: ${action.payload}`);
      return {
        ...state,
        error: action.payload
      };
    case ADD_CANDIDATE_FAILURE:
      console.log(`ADD_CANDIDATE_FAILURE: ${action.payload}`);
      return {
        ...state,
        error: action.payload
      };
    case GET_CONGRESS_BY_SESSION_SUCCESS:
      return {
        ...state,
        [action.payload.key]: action.payload.mocs
      }
    case GET_CONGRESS_BY_SESSION_FAILED:
      console.log('GET_CONGRESS_BY_SESSION_FAILED', action.payload)
      return {
        ...state,
        error: action.payload
      }
    case UPDATE_MISSING_MEMBER_SUCCESS: 
      return {
        ...state,
        116: map(state[116], (moc) => moc.govtrack_id === action.payload.id ? 
        {...moc, 
          missing_member: {
            ...moc.missing_member,
            116: action.payload.missingMember,
            }
            }: moc)
      }
    case UPDATE_IN_OFFICE_SUCCESS:
      return {
        ...state,
        116: map(state[116], (moc) => moc.govtrack_id === action.payload.id ? 
          {...moc, 
            in_office: action.payload.inOffice,
          }: moc)
      }
      case UPDATE_IN_OFFICE_FAIL:
          console.log(`UPDATE_IN_OFFICE_FAIL: ${action.payload}`);
          return {
            ...state,
            error: action.payload,
          }
    case UPDATE_DISPLAY_NAME_SUCCESS:
      return {
        ...state,
        116: map(state[116], (moc) => moc.govtrack_id === action.payload.id ? 
          {...moc, 
            displayName: action.payload.displayName,
          }: moc)
      }
    case UPDATE_DISPLAY_NAME_FAIL:
      console.log(`UPDATE_DISPLAY_NAME_FAIL: ${action.payload}`);
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state;
  }
};

export default mocReducer;