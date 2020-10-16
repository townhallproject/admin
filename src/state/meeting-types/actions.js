import {
  GET_MEETING_TYPES_FAILED,
  GET_MEETING_TYPES,
  GET_MEETING_TYPES_SUCCESS,
  UPDATE_MEETING_TYPE,
  UPDATE_MEETING_TYPE_FAILED,
  UPDATE_MEETING_TYPE_SUCCESS,
} from "./constants";

export const requestMeetingTypes = () => ({
  type: GET_MEETING_TYPES,
});

export const getMeetingTypesSuccess = (meetingTypes) => ({
  type: GET_MEETING_TYPES_SUCCESS,
  payload: meetingTypes,
});

export const getMeetingTypesFailed = (error) => ({
  type: GET_MEETING_TYPES_FAILED,
  payload: error,
});

export const updateMeetingType = (meetingType) => ({
  type: UPDATE_MEETING_TYPE,
  payload: meetingType,
});

export const updateMeetingTypeSuccess = (meetingType) => ({
  type: UPDATE_MEETING_TYPE_SUCCESS,
  payload: meetingType,
});

export const updateMeetingTypeFailed = (error) => ({
  type: UPDATE_MEETING_TYPE_FAILED,
  payload: error,
});
