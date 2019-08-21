import { 
  SET_ALL_USERS, 
  REQUEST_USER_BY_ID_FAILED, 
  RECEIVE_USER,
  SUBMIT_REQUEST_ACCESS,
  REQUEST_PENDING_USERS,
  APPROVE_USER_REQUEST,
  REQUEST_CURRENT_USER_BY_ID,
  REJECT_USER_REQUEST,
  SET_USER_EVENT_DL_DATE,
} from "./constants";

export const requestCurrentPendingUsers = () => ({
  type: REQUEST_PENDING_USERS,
})

export const getUsersSuccess = users => ({
  type: SET_ALL_USERS,
  payload: users
});

export const getUserByIdFailed = err => ({
  type: REQUEST_USER_BY_ID_FAILED,
  payload: err
});

export const requestUserById = (uid, email, username) => ({
  type: REQUEST_CURRENT_USER_BY_ID,
  payload: {
    uid,
    email,
    username,
  }
})

export const submitRequestAccess = (user, accessForm) => ({
  type: SUBMIT_REQUEST_ACCESS,
  payload: {
    user,
    accessForm,
  }
})

export const approveUserRequest = (uid, accessLevel) => ({
  type: APPROVE_USER_REQUEST, 
  payload: {
    uid,
    accessLevel,
  }
})

export const rejectUserRequest = (uid) => ({
  type: REJECT_USER_REQUEST,
  payload: {
    uid,
  }
})

export const receiveUser = user => ({
  type: RECEIVE_USER, 
  payload: user
})

export const setUserEventDlDate = (uid) => ({
  type: SET_USER_EVENT_DL_DATE,
  payload: uid,
});