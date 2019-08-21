import { createLogic } from "redux-logic"
import superagent from 'superagent';
import { map } from 'lodash';

import { 
  REQUEST_TOTAL_USERS,
  RECEIVE_TOTAL_USERS,
  REQUEST_FAILED,
  RECEIVE_SMS_CACHE,
  REQUEST_CACHE,
  SEND_SMS_MESSAGE,
  SENT_MESSAGE,
  RECEIVE_POTENTIAL_VOLS,
  REQUEST_POTENTIAL_VOLS,
} from "./constants";

const url = process.env.REACT_APP_SMS_API;

const requestAllSMSUsersLogic = createLogic({
    process({firebasedb}) {
      return firebasedb.ref('sms-users/all-users').once('value')
        .then( (snapshot) => {
          return snapshot.numChildren();
        })
    },
    processOptions: {
      failType: REQUEST_FAILED,
      successType: RECEIVE_TOTAL_USERS,
    },
  type: REQUEST_TOTAL_USERS,
});

const requestAllPotentialVolssLogic = createLogic({
  process({
    firebasedb
  }) {
    return firebasedb.ref('sms-users/potential-vols').once('value')
     .then((snapshot) => {
       const toReturn = [];
       snapshot.forEach((ele) => {
         const user = ele.val();
         user.phoneNumber = user.phoneNumber || ele.key;
         toReturn.push(user)
       })
       return toReturn;
     })
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: RECEIVE_POTENTIAL_VOLS,
  },
  type: REQUEST_POTENTIAL_VOLS,
});

const requestCacheLogic = createLogic({
  process({
    firebasedb
  }) {
    return firebasedb.ref('sms-users/cached-users').once('value')
      .then((snapshot) => {
        const toReturn = [];
        snapshot.forEach((ele) => {
          const user = ele.val();
          user.messages = map(user.messages, (message, key) => {return {...message, id: key}})
          user.phoneNumber = user.phoneNumber || ele.key;
          toReturn.push(user)
        })
        return toReturn;
      })
  },
  processOptions: {
    failType: REQUEST_FAILED,
    successType: RECEIVE_SMS_CACHE,
  },
  type: REQUEST_CACHE,
});

const sendMessageLogic = createLogic({
  process({
    action,
  }) {
    return superagent
      .post(`${url}/send-message`)
      .send(action.payload)
      .then(res => {
        if (res.status === 200) {
          return res.body;
        } 
        return Promise.reject()
      });
  },
      processOptions: {
        failType: REQUEST_FAILED,
        successType: SENT_MESSAGE,
      },
      type: SEND_SMS_MESSAGE,
})

export default [
  requestAllSMSUsersLogic,
  sendMessageLogic,
  requestCacheLogic,
  requestAllPotentialVolssLogic,
];