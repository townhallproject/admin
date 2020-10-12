import {
  GET_MEETING_TYPES_FAILED,
  GET_MEETING_TYPES_SUCCESS,
  SET_LOADING,
  UPDATE_MEETING_TYPE_FAILED,
  UPDATE_MEETING_TYPE_SUCCESS,
} from "./constants";

export const getMeetingTypesSuccess = (meetingTypes) => ({
  type: GET_MEETING_TYPES_SUCCESS,
  payload: meetingTypes,
});

export const setLoading = () => ({
  type: SET_LOADING,
});

export const getMeetingTypesFailed = (error) => ({
  type: GET_MEETING_TYPES_FAILED,
  payload: error,
});
