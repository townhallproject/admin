import {
  createLogic
} from "redux-logic"
import {
  GET_MOCS,
  GET_MOCS_SUCCESS,
  GET_MOCS_FAILED,
  ADD_CANDIDATE,
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
  ADD_OFFICE_PERSON,
  SET_CURRENTLY_EDITING_PERSON,
  REQUEST_STATE_LEG,
  UPDATE_CAMPAIGN_STATUS,
  ADD_OFFICE_TO_PERSON,
  UPDATE_CURRENTLY_EDITING_PERSON,
} from "./constants";
import {
  updateDisplayNameSuccess,
} from './actions';
import {
  map,
  filter
} from "lodash";
import moment from "moment";

// Note: I don't think it's worth making this more modular now. We could at least
// consolidate the two places this is stored as a constant.
const CURRENT_CONGRESS = 117;

const getCongressUpdates = (firestore, data, id, chamber) => {

  let updates = firestore.batch();

  const chamberCollection = chamber === 'upper' ? 'senators' : 'house_reps';
  const ref2 = firestore.collection(chamberCollection).doc(id);
  updates.update(ref2, data)

  const congressCollection = `{CURRENT_CONGRESS}th_congress`;
  console.log(chamberCollection)
  const congressCollectionRef = firestore.collection(congressCollection).doc(id);
  updates.update(congressCollectionRef, data);
  return updates;
}

const getCongressAdds = (firestore, data, id, chamber) => {

  let updates = firestore.batch();

  const chamberCollection = chamber === 'upper' ? 'senators' : 'house_reps';
  const ref2 = firestore.collection(chamberCollection).doc(id);
  updates.set(ref2, data)

  const congressCollection = `{CURRENT_CONGRESS}th_congress`;
  const congressCollectionRef = firestore.collection(congressCollection).doc(id);
  updates.set(congressCollectionRef, data);
  return updates;
}

const setFederalCandidate = (firestore, data, id) => {

  let updates = firestore.batch();
  const dataTableRef = firestore.collection('federal_candidates').doc(id);

  updates.set(dataTableRef, data);
  return updates;
}

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
});

const addCampaignLogic = createLogic({
  type: ADD_CANDIDATE,
  process(deps, dispatch, done) {
    const {
      action,
      firestore,
    } = deps;
    const personData = action.payload.person;
    let updates;
    if (personData.in_office === false) {
      const data = {
        id: personData.id,
        displayName: personData.displayName,
        in_office: false,
      };
      updates = setFederalCandidate(firestore, data, personData.id)
    } else {
      updates = firestore.batch();
    }
    let personRef = firestore.collection('office_people').doc(personData.id);
    let campaigns;
    if (!personData.campaigns) {

      campaigns = [action.payload.campaign]

    } else {
      campaigns = [action.payload.campaign, ...personData.campaigns];
    }

    updates.update(personRef, {
      current_campaign_index: 0,
      campaigns,
    })
    
    return updates.commit().then(() => {
      let newPayload = {
        key: action.payload.key,
        person: {
          ...personData,
          campaigns
        }
      }
      if (action.payload.isNew) {
        dispatch({
                type: UPDATE_CURRENTLY_EDITING_PERSON,
                payload: newPayload
              })
      }
      dispatch({
        type: ADD_CANDIDATE_SUCCESS,
        payload: newPayload
      })
      done();
    })
  }
});

const addOfficeLogic = createLogic({
  type: ADD_OFFICE_TO_PERSON,
  processOptions: {
    successType: UPDATE_CURRENTLY_EDITING_PERSON,
  },
  process(deps) {
    const {
      action,
      firestore,
    } = deps;
    const personData = action.payload.person;
    const { office } = action.payload;
    let updates;
    const data = {
      id: personData.id,
      in_office: true,
      displayName: personData.displayName
    }
    if (office.level === 'federal') {
         updates = getCongressAdds(firestore, data, personData.id, office.chamber)
    } else {
        updates = firestore.batch();
        updates.set(firestore.collection(`${action.payload.office.state}_state_legislature`).doc(data.id), data)
    }
    let personRef = firestore.collection('office_people').doc(personData.id);
    let roles;
    if (!personData.roles) {

      roles = [action.payload.office]

    } else {
      roles = [action.payload.office, ...personData.roles];
    }
    updates.update(personRef, {
      current_office_index: 0,
      roles,
    });

    return updates.commit().then(() => {
      return {
        key: action.payload.key,
        person: {
          ...personData,
          roles
        }
      }
    })
  }
});

const addNewOfficePersonLogic = createLogic({
type: ADD_OFFICE_PERSON,
  processOptions: {
    successType: SET_CURRENTLY_EDITING_PERSON,
  },
  process(deps) {
    const {
      action,
      firestore,
    } = deps;
    console.log('Processing add office person request', action, firestore);
    return firestore.collection('office_people').add(action.payload)
      .then(function (docRef) {
        console.log('Successfully updated office_people (I think)', docRef);
        return {
          ...action.payload,
          id: docRef.id
        };
      })
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
      firestore,
    } = deps;
    const personRef = firestore.collection('office_people').doc(action.payload.record.id);
    const newRoles = action.payload.record.roles.map((role) => {
      if (Number(role.congress) === Number(action.payload.congress)) {
        return {
          ...role,
          missing_member: action.payload.missingMember
        }
      }
      return role
    })
    return personRef.update({
      roles: newRoles
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
      firestore,
    } = deps;

    const {
      id,
      inOffice,
      chamber
    } = action.payload;
    const data = {
      in_office: inOffice
    };
    console.log("Requesting in office update.", id, inOffice, chamber);

    const updates = getCongressUpdates(firestore, data, id, chamber)
    const ref1 = firestore.collection('office_people').doc(`${id}`);
    updates.update(ref1, {
      ...data,
      current_office_index: null,
      last_updated: {
        by: 'admin',
        time: moment().format('YYYY-MM-DD HH:mm:ss Z'),
      }
    })

    return updates.commit().then(function () {
      console.log('successfully updated in office', id);
      done();
    }).catch(console.log)

  }
})

const updateCampaignStatusLogic = createLogic({
  type: UPDATE_CAMPAIGN_STATUS,
  processOptions: {
    failType: UPDATE_DISPLAY_NAME_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firestore,
    } = deps;
    const record = action.payload.record;
    const status = action.payload.status;
    const campaignIndex = action.payload.index;
    const id = record.id;
    let updates = firestore.batch();

    const ref1 = firestore.collection('office_people').doc(`${id}`);
    const newCampaigns = record.campaigns.map((campaign, index) => {
      if (index === campaignIndex) {
        campaign.status = status;
      }
      return campaign;
    })
    updates.update(ref1, {
      campaigns: newCampaigns,
      last_updated: {
        by: 'admin',
        time: moment().format('YYYY-MM-DD HH:mm:ss Z'),
      }
    })

    return updates.commit().then(function () {
      console.log('successfully updated new name', id);
      done();
    }).catch(console.log)
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
      firestore,
    } = deps;
    const id = action.payload.id;
    const displayName = action.payload.displayName;
    const chamber = action.payload.chamber;
    const data = {
      displayName,
    }
    const updates = getCongressUpdates(firestore, data, id, chamber)
    const ref1 = firestore.collection('office_people').doc(`${id}`);

    updates.update(ref1, {
      ...data,
      last_updated: {
        by: 'admin',
        time: moment().format('YYYY-MM-DD HH:mm:ss Z'),
      }
    })

    return updates.commit().then(function () {
      console.log('successfully updated new name', id);
      dispatch(updateDisplayNameSuccess(id, displayName))
      done();
    }).catch(console.log)
  }
})

export default [
  fetchMocs,
  addNewOfficePersonLogic,
  addOfficeLogic,
  addCampaignLogic,
  requestCongressLogic,
  updateMissingMemberLogic,
  updateInOfficeLogic,
  updateDisplayNameLogic,
  requestStateLeg,
  updateCampaignStatusLogic,
];
