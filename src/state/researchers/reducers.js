import {
  map,
  uniqBy,
} from 'lodash';

import { 
  SET_ALL_RESEARCHERS, 
  UPDATE_RESEARCHER_MOCS,
  REMOVE_ASSIGNMENT_SUCCESS,
  ASSIGN_MOC_TO_RESEARCHER_SUCCESS,
  ADD_AND_ASSIGN_TO_RESEARCHER_SUCCESS,
  REQUEST_FAILED,
  SET_RESEARCHER_EMAIL_DATA,
} from "./constants";

const initialState = {
  allResearchedMocs: [],
  allResearchers: [],
  error: null,
};

const userReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_ALL_RESEARCHERS:
      return {
        ...state,
        allResearchers: payload,
        error: null
      };
    case SET_RESEARCHER_EMAIL_DATA:
      return {
        ...state,
        allResearchers: uniqBy([...state.allResearchers, payload.user], 'uid')
      }
    case REQUEST_FAILED:
      console.log(`RESEARCHER_REQUEST_FAILED: ${payload}`);
      return {
        ...state,
        error: payload
      };
    case UPDATE_RESEARCHER_MOCS:
      return {
        ...state,
        allResearchedMocs: [...state.allResearchedMocs, ...payload.mocList]
      }
    case REMOVE_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        allResearchers: map(state.allResearchers, researcher => {
          if (researcher.id === payload.userId) {
            return {
              ...researcher,
              mocs: {
                ...researcher.mocs,
                [payload.mocId]: {
                  ...researcher.mocs[payload.mocId],
                  isAssigned: false,
                }
              }
            }
          }
          return researcher;
        })
      }
      case ASSIGN_MOC_TO_RESEARCHER_SUCCESS:
      return {
        ...state,
        allResearchers: map(state.allResearchers, researcher => {
          if (researcher.id === payload.userId) {
            return {
              ...researcher,
              mocs: {
                ...researcher.mocs,
                [payload.mocId]: {
                  ...researcher.mocs[payload.mocId],
                  isAssigned: true,
                }
              }
            }
          }
          return researcher;
        })
      }
      case ADD_AND_ASSIGN_TO_RESEARCHER_SUCCESS:
        return {
          ...state,
          allResearchedMocs: [...state.allResearchedMocs, payload],
          allResearchers: map(state.allResearchers, researcher => {
            if (researcher.id === payload.userId) {
              return {
                ...researcher,
                mocs: {
                  ...researcher.mocs,
                  [payload.id]: {
                    id: payload.id,
                    id_key: payload.id_key,
                    isAssigned: true,
                  }
                }
              }
            }
            return researcher;
          })
        }

    default:
      return state;
  }
};

export default userReducer;