import { createLogic } from "redux-logic";
import {
  includes,
} from 'lodash';
import moment from 'moment';
import { 
  DELETE_EVENT,
  DELETE_EVENT_FAIL,
  REQUEST_EVENTS, 
  REQUEST_EVENTS_FAILED,
  REQUEST_EVENTS_COUNTS_FAIL,
  REQUEST_EVENTS_COUNTS,
  REQUEST_TOTAL_EVENTS_COUNTS,
  ARCHIVE_EVENT,
  APPROVE_EVENT,
  APPROVE_EVENT_FAIL,
  REQUEST_OLD_EVENTS,
  UPDATE_EXISTING_EVENT,
  UPDATE_EVENT_SUCCESS,
  UPDATE_EVENT_FAIL,
} from "./constants";
import { 
  EVENTS_PATHS,
} from '../constants';
import {
  PENDING_EVENTS_TAB,
} from '../../constants'
import {
  addOldEventToState,
  setLoading,
  storeEventsInState,
  clearEventsCounts,
  requestEventsCountsSuccess,
  approveEventSuccess,
  decrementEvents,
  decrementTotalEvents,
  requestTotalEventsCountsSuccess,
  deleteEventSuccess,
  archiveEventSuccess,
} from "./actions";
import {
  requestResearcherById,
  requestResearcherByEmail,
} from "../researchers/actions";

const fetchEvents = createLogic({
  type: REQUEST_EVENTS,
  process(deps, dispatch, done) {
      const {
        action,
        firebasedb,
    } = deps;
    const { payload } = action;
    if (!payload) {
      return [];
    }
    return firebasedb.ref(`${payload}`).once('value')
      .then((snapshot) => {
        const allData = [];
        const allUids = [];
        snapshot.forEach((ele) => {
          const event = ele.val();
          const researcher = event.enteredBy;
          if (researcher && !includes(researcher, '@')) {
            if (!includes(allUids, researcher)) {
              dispatch(requestResearcherById(researcher))
            }
            allUids.push(researcher);
          }
          allData.push(ele.val())
        })
        dispatch(storeEventsInState(allData));
      })
      .then(done)
  }
});

const fetchOldEventsLogic = createLogic({
  type: REQUEST_OLD_EVENTS,
  processOptions: {
    failType: REQUEST_EVENTS_FAILED,
  },
  process({
      getState,
      action,
      firebasedb
    }, dispatch, done) {
    const {
      payload
    } = action;
    console.log('startAt', payload.dates[0], 'endtAt', payload.dates[1], `${payload.path}/${payload.date}`)
    const ref = firebasedb.ref(`${payload.path}/${payload.date}`);
    dispatch(setLoading(true))
    const allEvents = [];
    const allUsers = [];
    ref.orderByChild('dateObj').startAt(payload.dates[0]).endAt(payload.dates[1]).on('child_added', (snapshot) => {
      const event = snapshot.val();
      const researcher = event.enteredBy;
      console.log(researcher);
      if (researcher && !includes(allUsers, researcher)) {
        if (!includes(researcher, '@')) {
          dispatch(requestResearcherById(researcher));
        } else {
          dispatch(requestResearcherByEmail(researcher));
        }
        allUsers.push(researcher);
      }
      allEvents.push(event);
    })
    ref.once('value')
      .then(() => {
        dispatch(addOldEventToState(allEvents));
      })
      .then(() => {
        if (moment(payload.dates[1]).isSame(moment(payload.date, 'YYYY-MM'), 'month')) {
          dispatch(setLoading(false))
        }
        done()
      })
  }
});

const approveEventLogic = createLogic({
  type: APPROVE_EVENT,
  processOptions: {
    failType: APPROVE_EVENT_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firebasedb,
    } = deps;

    const {
      townHall,
      path,
      livePath,
    } = action.payload;
    const townHallMetaData = firebasedb.ref(`/townHallIds/${townHall.eventId}`);
    const cleanTownHall = {
      ...townHall,
      userEmail: null,
    }
    firebasedb.ref(`${livePath}/${townHall.eventId}`).update(cleanTownHall)
      .then(() => {
        const approvedTownHall = firebasedb.ref(`${path}/${cleanTownHall.eventId}`);
        approvedTownHall.remove()
          .then(() => {
            townHallMetaData.update({
              status: 'live',
            })
            .then(() => {
              dispatch(approveEventSuccess(cleanTownHall.eventId));
              if (EVENTS_PATHS[path] && EVENTS_PATHS[path].FEDERAL_OR_STATE === 'FEDERAL') {
                dispatch(decrementEvents('federal'));
              } else {
                dispatch(decrementEvents(path.match(/[A-Z]*$/)));
              }
              if (EVENTS_PATHS[path.match(/[a-zA-Z_]*/)].STATUS === 'PENDING') {
                dispatch(decrementTotalEvents('pending'));
              }
              done();
            })
          })
      })
  }
});

const archiveEventLogic = createLogic({
  type: ARCHIVE_EVENT,
  process(deps, dispatch, done) {
      const {
        action,
        firebasedb,
      } = deps;

      const {
        townHall,
        path,
        archivePath
      } = action.payload;
      const cleanTownHall = {
        ...townHall,
        userEmail: null,
      }
      const oldTownHall = firebasedb.ref(`${path}/${cleanTownHall.eventId}`);
      const oldTownHallID = firebasedb.ref(`/townHallIds/${cleanTownHall.eventId}`);
      const dateKey = cleanTownHall.dateObj ? moment(cleanTownHall.dateObj).format('YYYY-MM') : 'no_date';
      console.log(`${archivePath}/${dateKey}/${cleanTownHall.eventId}`)
      firebasedb.ref(`${archivePath}/${dateKey}/${cleanTownHall.eventId}`).update(cleanTownHall)
        .then(() => {
            const removed = oldTownHall.remove();
            if (removed) {
              oldTownHallID.update({
                status: 'archived',
                archive_path: `${archivePath}/${dateKey}`,
              })
              .then(() => {
                dispatch(archiveEventSuccess(cleanTownHall.eventId));
                if (EVENTS_PATHS[path] && EVENTS_PATHS[path].FEDERAL_OR_STATE === 'FEDERAL') {
                  dispatch(decrementEvents('federal'));
                } else {
                  dispatch(decrementEvents(path.match(/[A-Z]*$/)));
                }
                if (EVENTS_PATHS[path.match(/[a-zA-Z_]*/)].STATUS === 'PENDING') {
                  dispatch(decrementTotalEvents('pending'));
                }
                done();
              })
            }
        })
        .catch(e => {
          console.log(e)
        })
      }
})

const deleteEvent = createLogic({
  type: DELETE_EVENT,
  processOptions: {
    failType: DELETE_EVENT_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firebasedb,
    } = deps;
    const { townHall, path } = action.payload;
    console.log(path, townHall.eventId)
    const oldTownHall = firebasedb.ref(`${path}/${townHall.eventId}`);
    if (path === 'townHalls') {
      firebasedb.ref(`/townHallIds/${townHall.eventId}`).update({
        eventId: townHall.eventId,
        lastUpdated: (Date.now()),
        status: 'cancelled',
      })
    }
    oldTownHall.remove()
      .then(() => {
        dispatch(deleteEventSuccess(townHall.eventId));
        if (EVENTS_PATHS[path] && EVENTS_PATHS[path].FEDERAL_OR_STATE === 'FEDERAL') {
          dispatch(decrementEvents('federal'));
        } else {
          dispatch(decrementEvents(path.match(/[A-Z]*$/)));
        }
        if (EVENTS_PATHS[path.match(/[a-zA-Z_]*/)].STATUS === 'PENDING') {
          dispatch(decrementTotalEvents('pending'));
        }
        done();
      });
  }
})

const updateEventLogic = createLogic({
  type: UPDATE_EXISTING_EVENT,
  processOptions: {
    successType: UPDATE_EVENT_SUCCESS,
    failType: UPDATE_EVENT_FAIL,
  },
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    const { updateData, path, eventId } = action.payload;
    if(!path || !eventId) {
      return
    }
    return firebasedb.ref(`${path}/${eventId}`).update(updateData).then(() => {
      return {...updateData, eventId}
    })
  }
})

const requestEventsCounts = createLogic({
  type: REQUEST_EVENTS_COUNTS,
  processOptions: {
    failType: REQUEST_EVENTS_COUNTS_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      firebasedb,
    } = deps;
    dispatch(clearEventsCounts());
    const path = action.payload;
    if (path === 'archive') {
      done();
    } else {
      const eventCounts = {};
      const p1 = firebasedb.ref(`${EVENTS_PATHS[path].STATE}`).once('value', (snapshot) => {
        if (snapshot.numChildren() > 0) {
          for (let [key, val] of Object.entries(snapshot.val())) {
            eventCounts[key] = Object.keys(val).length;
          }
        }
      });
      const p2 = firebasedb.ref(`${EVENTS_PATHS[path].FEDERAL}`).once('value', (snapshot) => {
        eventCounts.federal = snapshot.numChildren();
      });
      Promise.all([p1, p2]).then(() => {
        dispatch(requestEventsCountsSuccess(eventCounts))
        done();
      });
    }
  }
})

const requestTotalEventsCounts = createLogic({
  type: REQUEST_TOTAL_EVENTS_COUNTS,
  processOptions: {
    failType: REQUEST_EVENTS_COUNTS_FAIL,
  },
  process(deps, dispatch, done) {
    const { firebasedb } = deps;
    const totalEvents = {
      pending: 0,
      live: 0
    };
    const p1 = firebasedb.ref(`${EVENTS_PATHS[PENDING_EVENTS_TAB].STATE}`).once('value', (snapshot) => {
      if (snapshot.numChildren() > 0) {
        Object.values(snapshot.val()).forEach((state) => {
          totalEvents.pending += Object.keys(state).length;
        });
      }
    });
    const p2 = firebasedb.ref(`${EVENTS_PATHS[PENDING_EVENTS_TAB].FEDERAL}`).once('value', (snapshot) => {
      totalEvents.pending += snapshot.numChildren();
    });
    Promise.all([p1, p2]).then(() => {
      dispatch(requestTotalEventsCountsSuccess(totalEvents))
      done();
    });
  }
})


export default [
  archiveEventLogic,
  approveEventLogic,
  fetchOldEventsLogic,
  fetchEvents,
  deleteEvent,
  updateEventLogic,
  requestEventsCounts,
  requestTotalEventsCounts,
];