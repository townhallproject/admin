import {
  SUBMIT_ZIPCODE_LOCATION,
  LOOKUP_ZIPCODE,
  SET_FOUND_ZIPCODE
} from "./constants";

export const lookUpZipcode = (zipCode) => ({
  payload: zipCode,
  type: LOOKUP_ZIPCODE,
})

export const submitZipcode = payload => ({
  type: SUBMIT_ZIPCODE_LOCATION,
  payload
});

export const setFoundZipcode = payload => ({
  type: SET_FOUND_ZIPCODE,
  payload
});