import { createLogic } from "redux-logic";

import {
  GET_MEETING_TYPES_FAILED,
  GET_MEETING_TYPES,
  GET_MEETING_TYPES_SUCCESS,
  // UPDATE_MEETING_TYPE_SUCCESS,
  // UPDATE_MEETING_TYPE_FAILED,
} from "./constants";

import { MEETING_TYPES_PATH } from "../constants";

// import {
// getMeetingTypesFailed,
//   getMeetingTypesSuccess,
//   setLoading,
// } from "./actions";

const fetchMeetingTypesLogic = createLogic({
  type: GET_MEETING_TYPES,

  processOptions: {
    successType: GET_MEETING_TYPES_SUCCESS,
    failType: GET_MEETING_TYPES_FAILED,
  },

  process(deps) {
    const { firebasedb } = deps;

    const allMeetingTypes = [];

    let query = firebasedb.ref(MEETING_TYPES_PATH);
    return query
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
        return allMeetingTypes;
      })
      .catch((err) => {
        console.log(`Error fetching Meeting types: ${err}`);
      });
  },
});

export default [fetchMeetingTypesLogic];
