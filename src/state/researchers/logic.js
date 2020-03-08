import { createLogic } from "redux-logic"
import {
  concat,
  mapValues,
  reduce,
} from "lodash";

import { 
  REQUEST_ALL_RESEARCHERS,
  REMOVE_ASSIGNMENT,
  REMOVE_ASSIGNMENT_SUCCESS,
  ASSIGN_MOC_TO_RESEARCHER,
  ASSIGN_MOC_TO_RESEARCHER_SUCCESS,
  ADD_AND_ASSIGN_TO_RESEARCHER,
  ADD_AND_ASSIGN_TO_RESEARCHER_SUCCESS,
  REQUEST_RESEARCHER_BY_ID,
  REQUEST_RESEARCHER_BY_EMAIL,
  SET_RESEARCHER_EMAIL_DATA,
  REQUEST_FAILED,
  SAVE_UNREGISTERD_VOL,
  ADD_NEW_VOL_TO_RESEARCHERS
} from "./constants";
import { updateResearcherMocs, getResearchersSuccess } from "./actions";

const getResearcherByIdLogic = createLogic({
  process({
    action,
    firebasedb
  }) {
    const {
      payload
    } = action;
    const ref = firebasedb.ref(`users/${payload.uid}`);
    return ref.once('value').then((snapshot) => {
      let user = {
        email: '',
        uid: '',
      };
      if (snapshot.exists()) {
        user = {
          email: snapshot.val().email,
          uid: snapshot.key,
        };
      }

      return { user };
    })
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: SET_RESEARCHER_EMAIL_DATA,
  },
  type: REQUEST_RESEARCHER_BY_ID,
});

const getResearcherByEmailLogic = createLogic({
  process({
    action,
    firebasedb
  }) {
    const {
      payload
    } = action;
    const ref = firebasedb.ref(`users/`);
    return ref.once('value').then((snapshot) => {
      let user = {};
      snapshot.forEach((subshot) => {
        if (subshot.val().email === payload.email) {
          user = {
            email: subshot.val().email,
            uid: subshot.key,
          };
        }
      });
      return { user };
    })
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: SET_RESEARCHER_EMAIL_DATA,
  },
  type: REQUEST_RESEARCHER_BY_EMAIL,
});

const fetchAllResearchers = createLogic({
  type: REQUEST_ALL_RESEARCHERS,
  process({
      firebasedb
    }, dispatch, done) {
    return firebasedb.ref(`users`)
      .once('value')
      .then(usersSnap => {
        let totalResearchers = usersSnap.numChildren();
        const researchers = [];
        let checked = 0;
        usersSnap.forEach((user) => {
          const userData = user.val();
          if (user.val().mocs && !user.val().isAdmin) {
            userData.id = user.key;
            const mocs = mapValues(user.val().mocs, (moc) => {
              return {
                ...moc,
                id: moc.govtrack_id || moc.thp_id,
                id_key: moc.govtrack_id ? 'govtrack_id' : moc.thp_id ? 'thp_id' : null,
              }
            });
            userData.mocs = mocs;
            researchers.push(userData);
            const promises = reduce(mocs, (acc, moc) => {
              if (moc.id_key === 'govtrack_id') {
                acc.push(firebasedb.ref(`mocData/${moc.govtrack_id}`).once('value'))
              } else if (moc.id_key === 'thp_id') {
                // AZ-SD-06-00
                const state = moc.thp_id.match(/^\w{2}/g) ? moc.thp_id.match(/^\w{2}/g)[0] : null;
                if (state) {
                  acc.push(firebasedb.ref(`state_legislators_data/${state}/${moc.thp_id}`).once('value'))
                }
              }
              return acc;
            }, [])
            Promise.all(promises)
            .then((snapshotList) => {
              return concat(snapshotList)
            }).then((snapshot) => {
              const toUpdateList = []
              snapshot.forEach(mocSnap => {
                if (mocSnap && mocSnap.exists()) {
                  const mocData = mocSnap.val();
                  if (!mocData.in_office) {
                    if (user.val().mocs[mocSnap.key].isAssigned) {
                      console.log(`users/${user.key}/mocs/${mocSnap.key}`)
                      const ref = firebasedb.ref(`users/${user.key}/mocs/${mocSnap.key}`)
                      return ref.update({
                        isAssigned: false
                      })
                    }
                    console.log('not in office')
                    return;
                  }
                  const mocToUpdate = {
                    name: mocData.displayName,
                    district: mocData.district,
                    state: mocData.state,
                    userId: user.key,
                    id: mocSnap.key,
                    id_key: mocData.govtrack_id ? 'govtrack_id' : mocData.thp_id ? 'thp_id' : null,
                  }
                  toUpdateList.push(mocToUpdate)
                }
              })
              return toUpdateList;
            }).then(list => {
                dispatch(updateResearcherMocs(list))
                return checked = checked + 1;
            }).then((numChecked) => {
              if (numChecked === totalResearchers){
                console.log('done');
                done()
              }
            })
          } else {
            totalResearchers = totalResearchers - 1;
          }
        })
        return dispatch(getResearchersSuccess(researchers))
      });
  }
});

const removeAssignmentLogic = createLogic({
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    console.log(`users/${action.payload.userId}/mocs/${action.payload.mocId}`)
    const ref = firebasedb.ref(`users/${action.payload.userId}/mocs/${action.payload.mocId}`)
    return ref.update({isAssigned : false})
    .then(() => {
      return {
        mocId: action.payload.mocId,
        userId: action.payload.userId,
      }
    })
    
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: REMOVE_ASSIGNMENT_SUCCESS,
  },
  type: REMOVE_ASSIGNMENT,
});

const saveUnregisteredVolLogic = createLogic({
  process(deps) {
    const {
      action,
      firestore,
    } = deps;
    return firestore.collection('unregisteredVols').add(action.payload)
    .then(() => action.payload);
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: ADD_NEW_VOL_TO_RESEARCHERS,
  },
  type: SAVE_UNREGISTERD_VOL,
})

const addAssignmentLogic = createLogic({
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    
    console.log(`users/${action.payload.userId}/mocs/${action.payload.mocId}`)
    const ref = firebasedb.ref(`users/${action.payload.userId}/mocs/${action.payload.mocId}`)
    return ref.update({
      isAssigned: true
    })
    .then(() => {
      return {
        mocId: action.payload.mocId,
        userId: action.payload.userId,
      }
    })
    
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: ASSIGN_MOC_TO_RESEARCHER_SUCCESS,
  },
  type: ASSIGN_MOC_TO_RESEARCHER,
});

const addAndAssignmentLogic = createLogic({
  processOptions: {
    successType: ADD_AND_ASSIGN_TO_RESEARCHER_SUCCESS,
    failType: REQUEST_FAILED,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;

    const ref = firebasedb.ref(`users/${action.payload.userId}/mocs/${action.payload.mocId}`)
    return ref.update({
        govtrack_id: action.payload.mocId,
        isAssigned: true,
      })
      .then(() => {
        return firebasedb.ref(`mocData/${action.payload.mocId}`).once('value')
      })
      .then((snapshot) => {
        const mocInfo = snapshot.val();
        const mocData = {
          district: mocInfo.district,
          id: action.payload.mocId,
          id_key: 'govtrack_id',
          mocName: action.payload.name,
          name: mocInfo.displayName,
          state: mocInfo.state,
          userId: action.payload.userId,
        }
        return mocData
      })
  },
    type: ADD_AND_ASSIGN_TO_RESEARCHER,
});

export default [
  fetchAllResearchers,
  getResearcherByIdLogic,
  getResearcherByEmailLogic,
  removeAssignmentLogic,
  addAssignmentLogic,
  addAndAssignmentLogic,
  saveUnregisteredVolLogic
];