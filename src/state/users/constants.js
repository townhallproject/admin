import { makeConstant } from "../../utils";

const STATE_BRANCH = "USERS";

export const REQUEST_PENDING_USERS = makeConstant(STATE_BRANCH, 'REQUEST_PENDING_USERS');
export const REQUEST_CURRENT_USER_BY_ID = makeConstant(STATE_BRANCH, 'REQUEST_CURRENT_USER_BY_ID');
export const SUBMIT_REQUEST_ACCESS = makeConstant(STATE_BRANCH, 'SUBMIT_REQUEST_ACCESS');
export const APPROVE_USER_REQUEST = makeConstant(STATE_BRANCH, 'APPROVE_USER_REQUEST');
export const REJECT_USER_REQUEST = makeConstant(STATE_BRANCH, 'REJECT_USER_REQUEST');
export const RECEIVE_USER = makeConstant(STATE_BRANCH, 'RECEIVE_USER');
export const SET_ALL_USERS = makeConstant(STATE_BRANCH, 'SET_ALL_USERS');
export const REQUEST_FAILED = makeConstant(STATE_BRANCH, 'REQUEST_FAILED');
export const SUBMIT_REQUEST_ACCESS_SUCCESS = makeConstant(STATE_BRANCH, 'SUBMIT_REQUEST_ACCESS_SUCCESS');
export const REQUEST_CURRENT_USER_BY_ID_SUCCESS = makeConstant(STATE_BRANCH, 'REQUEST_CURRENT_USER_BY_ID');
export const REQUEST_USER_BY_ID_FAILED = makeConstant(STATE_BRANCH, 'REQUEST_USER_BY_ID_FAILED');
export const RECEIVE_PENDING_USERS = makeConstant(STATE_BRANCH, 'RECEIVE_PENDING_USERS');
export const REQUEST_PENDING_USERS_SUCCESS = makeConstant(STATE_BRANCH, 'REQUEST_PENDING_USERS_SUCCESS');
export const HANDLE_APPROVE_REJECT = makeConstant(STATE_BRANCH, 'HANDLE_APPROVE_REJECT');
export const SUBMIT_SUBSCRIBER_SUCCESS = makeConstant(STATE_BRANCH, 'SUBMIT_SUBSCRIBER_SUCCESS');
export const SUBMIT_SUBSCRIBER = makeConstant(STATE_BRANCH, 'SUBMIT_SUBSCRIBER');