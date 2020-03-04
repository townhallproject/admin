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
  CHANGE_SELECTED_STATE,
  ADD_CANDIDATE_SUCCESS,
  SET_CURRENTLY_EDITING_PERSON,
  UPDATE_CURRENTLY_EDITING_PERSON,
} from "./constants";
import { map } from 'lodash';

const initialState = {
  allMocIds: [],
  // 116th congress
  116: [],
  115: [],
  error: null,
  selectedStateLeg: '',
  currentlyEditingPerson: null,
};

const mocReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MOCS_SUCCESS:
      return {
        ...state,
        allMocIds: map(action.payload.data),
        error: null
      };
    case CHANGE_SELECTED_STATE: 
      return {
        ...state,
        selectedStateLeg: action.payload,
      };
    case GET_MOCS_FAILED:
      console.log(`GET_MOCS_FAILED: ${action.payload}`);
      return {
        ...state,
        error: action.payload
      };
    case ADD_CANDIDATE_SUCCESS: 
      console.log(action.payload.person.id)
      return {
        ...state,
        [action.payload.key]: map(state[action.payload.key], (moc) => moc.id === action.payload.person.id ? action.payload.person: moc)
      }
    case SET_CURRENTLY_EDITING_PERSON:
      console.log('saved person', action.payload)
      return {
        ...state,
        currentlyEditingPerson: action.payload,
      }
    case UPDATE_CURRENTLY_EDITING_PERSON:
        return {
          ...state,
          currentlyEditingPerson: {
            ...state.currentlyEditingPerson,
            ...action.payload.person,
          }
        }
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