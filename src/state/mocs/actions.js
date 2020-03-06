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
  CHANGE_SELECTED_STATE,
  REQUEST_STATE_LEG,
  UPDATE_CAMPAIGN_STATUS,
  ADD_OFFICE_PERSON,
  ADD_OFFICE_TO_PERSON,
  CLEAR_CURRENTLY_EDITING_PERSON,
} from './constants';

export const requestMocIds = () => ({
  type: GET_MOCS
});

export const changeSelectedState = value => ({
  type: CHANGE_SELECTED_STATE,
  payload: value
});

export const getMocsSuccess = mocs => ({
  type: GET_MOCS_SUCCESS,
  payload: mocs
});

export const getMocsFailed = err => ({
  type: GET_MOCS_FAILED,
  payload: err
});

export const saveCampaignToPerson = (person, campaign, key) => ({
  type: ADD_CANDIDATE,
  payload: { 
    person,
    campaign,
    key,
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

export const getStateLeg = (usState) => ({
  type: REQUEST_STATE_LEG,
  payload: usState
})

export const updateMissingMember = (record, congress, missingMember) => ({
  type: UPDATE_MISSING_MEMBER,
  payload: {
    record,
    congress,
    missingMember,
  }
})

export const updateInOffice = (id, inOffice, chamber) => ({
  type: UPDATE_IN_OFFICE,
  payload: {
    id,
    inOffice,
    chamber,
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

export const updateCampaignStatus = (value, index, record) => ({
  type: UPDATE_CAMPAIGN_STATUS, 
  payload: {
    record,
    status: value, 
    index,
  }
})

export const addNewPerson = (payload) => ({
  type: ADD_OFFICE_PERSON,
  payload,
})

export const addOfficeToPerson = (person, office, key) => ({
  type: ADD_OFFICE_TO_PERSON,
  payload: {
    person,
    office,
    key
  }
})

export const clearCurrentlyEditingPerson = () => ({
  type: CLEAR_CURRENTLY_EDITING_PERSON
})
