import { 
  REQUEST_ALL_RESEARCHERS,
  SET_ALL_RESEARCHERS,
  REQUEST_RESEARCHER_BY_ID_FAILED,
  UPDATE_RESEARCHER_MOCS,
  REMOVE_ASSIGNMENT,
  ASSIGN_MOC_TO_RESEARCHER,
  ADD_AND_ASSIGN_TO_RESEARCHER,
  REQUEST_RESEARCHER_BY_ID,
  REQUEST_RESEARCHER_BY_EMAIL,
  SAVE_UNREGISTERD_VOL
} from "./constants";

export const requestAllResearchers = () => ({
  type: REQUEST_ALL_RESEARCHERS
});

export const getResearchersSuccess = researchers => ({
  type: SET_ALL_RESEARCHERS,
  payload: researchers
});

export const getResearcherByIdFailed = err => ({
  type: REQUEST_RESEARCHER_BY_ID_FAILED,
  payload: err
});

export const requestResearcherById = (uid) => ({
    type: REQUEST_RESEARCHER_BY_ID,
     payload: {
       uid,
     }
});

export const requestResearcherByEmail = (email) => ({
  type: REQUEST_RESEARCHER_BY_EMAIL,
   payload: {
     email,
   }
});

export const updateResearcherMocs = (mocList) => ({
  type: UPDATE_RESEARCHER_MOCS,
  payload: {
    mocList,
  }
})

export const removeAssignment = (researcherId, mocId) => ({
  type: REMOVE_ASSIGNMENT,
  payload: {
    researcherId,
    mocId
  }
})

export const assignMocToResearcher = (researcherId, mocId) => ({
  type: ASSIGN_MOC_TO_RESEARCHER,
  payload: {
    researcherId,
    mocId
  }
})

export const addAndAssignToResearcher = (researcherId, mocId, name) => ({
  type: ADD_AND_ASSIGN_TO_RESEARCHER,
  payload: {
    researcherId,
    mocId,
    name
  }
})

export const saveUnregisteredVol = (payload) => ({
  type: SAVE_UNREGISTERD_VOL,
  payload
})
