import {
  GET_MEETING_TYPES_FAILED,
  GET_MEETING_TYPES,
  GET_MEETING_TYPES_SUCCESS,
  // UPDATE_MEETING_TYPE_FAILED,
  // UPDATE_MEETING_TYPE_SUCCESS,
} from "./constants";

export const getMeetingTypesSuccess = (meetingTypes) => ({
  type: GET_MEETING_TYPES_SUCCESS,
  payload: meetingTypes,
});

export const requestMeetingTypes = () => ({
  type: GET_MEETING_TYPES,
});

export const getMeetingTypesFailed = (error) => ({
  type: GET_MEETING_TYPES_FAILED,
  payload: error,
});
