import { applyMiddleware, createStore, combineReducers } from "redux";
import { createLogicMiddleware } from "redux-logic";
import request from "superagent";

import events from "./events";
import mocs from "./mocs";
import users from "./users";
import selections from "./selections";
import rsvps from "./rsvps";
import researchers from "./researchers";
import smsUsers from "./sms-users";
import subscribers from "./subscribers";
import zipcodes from "./zipcodes";
import meetingTypes from "./meeting-types";

import { firebaseUrl } from "../state/constants";
import { firebasedb, firestore } from "../utils/firebaseinit";

const reducers = {
  events: events.reducers,
  mocs: mocs.reducers,
  users: users.reducers,
  researchers: researchers.reducers,
  rsvps: rsvps.reducers,
  selections: selections.reducers,
  smsUsers: smsUsers.reducers,
  subscribers: subscribers.reducers,
  zipcodes: zipcodes.reducers,
  meetingTypes: meetingTypes.reducers,
};

const logics = [
  ...events.logics,
  ...users.logics,
  ...mocs.logics,
  ...selections.logics,
  ...rsvps.logics,
  ...researchers.logics,
  ...smsUsers.logics,
  ...subscribers.logics,
  ...zipcodes.logics,
  ...meetingTypes.logics,
];

const reduxLogicDependencies = {
  firebaseUrl: firebaseUrl,
  firebasedb,
  firestore,
  httpClient: request,
};

const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);

let middleware = applyMiddleware(logicMiddleware);

if (
  process.env.NODE_ENV === `development` &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) {
  middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(middleware);
}

export default () => {
  const store = createStore(combineReducers(reducers), middleware);

  return store;
};
