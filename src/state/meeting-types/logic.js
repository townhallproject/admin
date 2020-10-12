import { createLogic } from "redux-logic";
import superagent from "superagent";

import {
  GET_MEETING_TYPES_FAILED,
  GET_MEETING_TYPES_SUCCESS,
  SET_LOADING,
  UPDATE_MEETING_TYPE_SUCCESS,
  UPDATE_MEETING_TYPE_FAILED,
} from "./constants";

import { MEETING_TYPES_PATH } from "../constants";
// import {
//   PENDING_EVENTS_TAB, DATE_CREATED, FEDERAL_RADIO_BUTTON,
// } from '../../constants'
import {
  // getMeetingTypesFailed,
  getMeetingTypesSuccess,
  setLoading,
} from "./actions";

const fetchMeetingTypesLogic = createLogic({
  type: GET_MEETING_TYPES_SUCCESS,

  processOptions: {
    failType: GET_MEETING_TYPES_FAILED,
  },

  process(deps, dispatch, done) {
    const { firebasedb } = deps;

    dispatch(setLoading(true));
    const allMeetingTypes = [];

    let query = firebasedb.ref(MEETING_TYPES_PATH);
    query
      .once("value")
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No Meeting types found");
          return;
        }

        snapshot.forEach((meetingType) => {
          const meetingTypeData = meetingType.val();
          allMeetingTypes.push(meetingTypeData);
        });
      })
      .then(() => {
        console.log({ allMeetingTypes });
        dispatch(getMeetingTypesSuccess(allMeetingTypes));
      })
      .then(done())
      .catch((err) => {
        console.log(`Error fetching Meeting types: ${err}`);
      });
  },
});

export default [fetchMeetingTypesLogic];
