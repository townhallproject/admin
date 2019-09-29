import {
  ADD_STATE_LEG,
  GET_MOCS, 
  GET_MOCS_SUCCESS,
  GET_MOCS_FAILED,
  ADD_CANDIDATE,
  ADD_CANDIDATE_FAILURE,
  GET_CONGRESS_BY_SESSION,
  UPDATE_MISSING_MEMBER,
  UPDATE_IN_OFFICE,
  UPDATE_IN_OFFICE_SUCCESS,
  UPDATE_DISPLAY_NAME,
  UPDATE_DISPLAY_NAME_SUCCESS,
} from './constants';

export const requestMocIds = () => ({
  type: GET_MOCS
});

export const getMocsSuccess = mocs => ({
  type: GET_MOCS_SUCCESS,
  payload: mocs
});

export const getMocsFailed = err => ({
  type: GET_MOCS_FAILED,
  payload: err
});

export const saveCandidate = (path, person) => ({
  type: ADD_CANDIDATE,
  payload: { 
    person,
    path,
  }
})

export const saveStateLeg = (person) => ({
  type: ADD_STATE_LEG,
  payload: {
    person,
  }
})

export const saveCandidateFailed = (error) => ({
  type: ADD_CANDIDATE_FAILURE,
  payload: error,
})

export const getCongressBySession = (congressId) => ({
  type: GET_CONGRESS_BY_SESSION,
  payload: congressId
})

export const updateMissingMember = (id, missingMember) => ({
  type: UPDATE_MISSING_MEMBER,
  payload: {
    id,
    missingMember,
  }
})

export const updateInOffice = (id, inOffice) => ({
  type: UPDATE_IN_OFFICE,
  payload: {
    id,
    inOffice,
  }
})

export const updateInOfficeSuccess = (id, inOffice) => ({
  type: UPDATE_IN_OFFICE_SUCCESS,
  payload: {
    id,
    inOffice,
  }
})

export const updateDisplayName = (id, displayName) => ({
  type: UPDATE_DISPLAY_NAME,
  payload: {
    id,
    displayName,
  }
})

export const updateDisplayNameSuccess = (id, displayName) => ({
  type: UPDATE_DISPLAY_NAME_SUCCESS,
  payload: {
    id,
    displayName,
  }
})