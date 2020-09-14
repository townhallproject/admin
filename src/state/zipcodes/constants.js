import { makeConstant } from "../../utils";

const STATE_BRANCH = "ZIPCODES";

export const LOOKUP_ZIPCODE = makeConstant(STATE_BRANCH, 'LOOKUP_ZIPCODE');
export const SUBMIT_ZIPCODE_LOCATION = makeConstant(STATE_BRANCH, 'SUBMIT_ZIPCODE_LOCATION');
export const SET_FOUND_ZIPCODE = makeConstant(STATE_BRANCH, 'SET_FOUND_ZIPCODE');
