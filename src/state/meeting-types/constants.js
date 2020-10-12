import { makeConstant } from "../../utils";
const STATE_BRANCH = "MEETING_TYPES";

export const GET_MEETING_TYPES_SUCCESS = makeConstant(
  STATE_BRANCH,
  "GET_MEETING_TYPES_SUCCESS"
);
export const SET_LOADING = makeConstant(STATE_BRANCH, "SET_LOADING");
export const GET_MEETING_TYPES_FAILED = makeConstant(
  STATE_BRANCH,
  "GET_MEETING_TYPES_FAILED"
);
export const UPDATE_MEETING_TYPE_SUCCESS = makeConstant(
  STATE_BRANCH,
  "UPDATE_MEETING_TYPE_SUCCESS"
);
export const UPDATE_MEETING_TYPE_FAILED = makeConstant(
  STATE_BRANCH,
  "UPDATE_MEETING_TYPE_FAILED"
);
