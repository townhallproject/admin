import { createLogic } from "redux-logic"
import { 
  GET_MOCS,
  GET_MOCS_SUCCESS, 
  GET_MOCS_FAILED, 
  ADD_CANDIDATE, 
  ADD_CANDIDATE_FAILURE, 
  ADD_CANDIDATE_SUCCESS, 
  GET_CONGRESS_BY_SESSION,
  GET_CONGRESS_BY_SESSION_SUCCESS,
  GET_CONGRESS_BY_SESSION_FAILED,
  UPDATE_MISSING_MEMBER,
  UPDATE_MISSING_MEMBER_FAIL,
  UPDATE_MISSING_MEMBER_SUCCESS,
  UPDATE_IN_OFFICE,
  UPDATE_IN_OFFICE_FAIL,
  UPDATE_DISPLAY_NAME,
  UPDATE_DISPLAY_NAME_FAIL,
  ADD_STATE_LEG,
  ADD_STATE_LEG_SUCCESS,
  REQUEST_STATE_LEG,
} from "./constants";
import {
  updateInOfficeSuccess,
  updateDisplayNameSuccess,
} from './actions';
import Candidate from './candidate-model';
import {
  map,
  filter
} from "lodash";
import StateLeg from "./state-leg-model";

const fetchMocs = createLogic({
  type: GET_MOCS,
  processOptions: {
    successType: GET_MOCS_SUCCESS,
    failType: GET_MOCS_FAILED,
  },
  process(deps) {
    return deps.httpClient.get(`${deps.firebaseUrl}/mocID.json`);
  }
});

const requestCongressLogic = createLogic({
  type: GET_CONGRESS_BY_SESSION,
    processOptions: {
      successType: GET_CONGRESS_BY_SESSION_SUCCESS,
      failType: GET_CONGRESS_BY_SESSION_FAILED,
    },
  process(deps) {
    const {
      action,
      firestore,
    } = deps;
    return firestore.collection(`${action.payload}th_congress`).get()
      .then((snapshot) => {

          const allIds = snapshot.docs.map(doc => doc.data().id);
          const allDataRequests = map(allIds, (id) => firestore.collection('office_people').doc(id).get());
          return Promise.all(allDataRequests).then(allData => {
            const allReturnedData = map(allData, (doc => (doc.data())))
            const mocs = filter(allReturnedData)
            return {
              mocs,
              key: action.payload,
            }
          })

      })
  }
})

const requestStateLeg = createLogic({
  type: REQUEST_STATE_LEG,
  processOptions: {
    successType: GET_CONGRESS_BY_SESSION_SUCCESS,
  },
  process(deps) {
    const {
      action,
      firestore,
    } = deps;
    return firestore.collection(`${action.payload}_state_legislature`).get()
      .then((snapshot) => {
        console.log(action.payload)
        const allIds = snapshot.docs.map(doc => doc.data().id);
        const allDataRequests = map(allIds, (id) => firestore.collection('office_people').doc(id).get());
        return Promise.all(allDataRequests).then(allData => {
          const allReturnedData = map(allData, (doc => (doc.data())))
          const mocs = filter(allReturnedData)
          return {
            mocs,
            key: action.payload,
          }
        })

      })
  }
})

const addCandidateLogic = createLogic({
  type: ADD_CANDIDATE,
  processOptions: {
    successType: ADD_CANDIDATE_SUCCESS,
    failType: ADD_CANDIDATE_FAILURE,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;

    const newId = firebasedb.ref().child('candidate_data').push().key;
    const newCandidate = new Candidate(action.payload.person);
    const nameKey = newCandidate.createNameKey();
    firebasedb.ref(`${action.payload.path}/${nameKey}`).update({
      id: newId,
      nameEntered: newCandidate.displayName,
    });
    newCandidate.thp_id = newId;
    firebasedb.ref(`candidate_data/${newId}`).update(newCandidate);
  }
});

const addStateLegLogic = createLogic({
  type: ADD_STATE_LEG,
  processOptions: {
    successType: ADD_STATE_LEG_SUCCESS,
    failType: ADD_CANDIDATE_FAILURE,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    const state = action.payload.person.state;
    if (!state) {
      Promise.reject('no state on state leg');
    }
    const newId = firebasedb.ref().child(`state_legislators_data/${state}`).push().key;
    const newOfficePerson = new StateLeg(action.payload.person);
    const nameKey = newOfficePerson.createNameKey();
    console.log(newId)
    firebasedb.ref(`state_legislators_id/${state}/${nameKey}`).update({
      id: newId,
      nameEntered: newOfficePerson.displayName,
    });
    newOfficePerson.thp_id = newId;
    firebasedb.ref(`state_legislators_data/${state}/${newId}`).update(newOfficePerson);
  }
});

const updateMissingMemberLogic = createLogic({
  type: UPDATE_MISSING_MEMBER,
  processOptions: {
    successType: UPDATE_MISSING_MEMBER_SUCCESS,
    failType: UPDATE_MISSING_MEMBER_FAIL,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    return firebasedb.ref(`mocData/${action.payload.id}/missing_member`).update({
      116: action.payload.missingMember,
    }).then(() => action)
  }
})

const updateInOfficeLogic = createLogic({
  type: UPDATE_IN_OFFICE,
  processOptions: {
    failType: UPDATE_IN_OFFICE_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firebasedb,
    } = deps;
    const id = action.payload.id;
    const inOffice = action.payload.inOffice;
    const p1 = firebasedb.ref(`mocData/${id}/in_office`).set(inOffice);
    const p2 = firebasedb.ref(`mocData/${id}/last_updated`).update({
      by: 'admin',
      time: Date.now(),
    });
    Promise.all([p1, p2]).then(() => {
      dispatch(updateInOfficeSuccess(id, inOffice));
      done();
    });
  }
})

const updateDisplayNameLogic = createLogic({
  type: UPDATE_DISPLAY_NAME,
  processOptions: {
    failType: UPDATE_DISPLAY_NAME_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firebasedb,
    } = deps;
    const id = action.payload.id;
    const displayName = action.payload.displayName;
    firebasedb.ref(`mocData/${id}/displayName`).set(displayName)
      .then(() => {
        dispatch(updateDisplayNameSuccess(id, displayName));
        done();
      });
  }
})

export default [
  addStateLegLogic,
  fetchMocs,
  addCandidateLogic,
  requestCongressLogic,
  updateMissingMemberLogic,
  updateInOfficeLogic,
  updateDisplayNameLogic,
  requestStateLeg,
];