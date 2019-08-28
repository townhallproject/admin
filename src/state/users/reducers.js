import {
  filter,
} from 'lodash';

import { 
  RECEIVE_USER, 
  REQUEST_FAILED,
  SUBMIT_REQUEST_ACCESS_SUCCESS,
  RECEIVE_PENDING_USERS,
  HANDLE_APPROVE_REJECT,
  UPDATE_USER,
} from "./constants";

const initialState = {
  allPendingUsers: {},
  error: null,
  user: null,
};

const userReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case RECEIVE_PENDING_USERS:
      return {
        ...state,
        allPendingUsers: payload,
      };
    case REQUEST_FAILED:
      console.log(`USER_REQUEST_FAILED: ${payload}`);
      return {
        ...state,
        error: payload
      };
    case RECEIVE_USER: 
      return {
        ...state, 
        error: null,
        user: payload,
      }
    case HANDLE_APPROVE_REJECT:
      return {
        ...state,
        allPendingUsers: filter(state.allPendingUsers, (user) => user.uid !== payload.uid)
      }
    case SUBMIT_REQUEST_ACCESS_SUCCESS: 
        return {
          ...state,
          error: null,
          user: {
            ...state.user,
            requestedAccess: true,
          },
        }
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      }
    default:
      return state;
  }
};

export default userReducer;