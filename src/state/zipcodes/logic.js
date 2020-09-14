import { createLogic } from "redux-logic"

import { LOOKUP_ZIPCODE, SET_FOUND_ZIPCODE, SUBMIT_ZIPCODE_LOCATION } from "./constants";

const lookupZipcodeLogic = createLogic({
  process({
      firebasedb, 
      action,
    }) {
    const {
      payload,
    } = action;
    return firebasedb.ref(`zips/${payload}`).once('value')
      .then((snapshot) => {
        console.log(snapshot.val(), snapshot.exists())
        if (snapshot.exists()) {
          
          return true
        } else {
          return false
        }
      })
        
  },
  processOptions: {
    successType: SET_FOUND_ZIPCODE,
  },
  type: LOOKUP_ZIPCODE,
});

const saveZipcode = createLogic({
  process(deps) {
    const {
      action,
      firebasedb,
    } = deps;
    const { payload } = action;
    const { zipcode, lat, lng } = payload;
    console.log(payload)
    return 'init';
    // return firebasedb.ref(`zips/${payload.zipcode}`).update({
    //   ZIP: zipcode,
    //   LAT: lat,
    //   LNG: lng
    // }).then(() => {
    //   return true
    // })
 
  },
  processOptions: {
    successType: SET_FOUND_ZIPCODE,
  },
  type: SUBMIT_ZIPCODE_LOCATION,
});

export default [
  lookupZipcodeLogic,
  saveZipcode,
];