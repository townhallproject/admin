import { createLogic } from "redux-logic"
import { find } from "lodash";
import moment from 'moment';
import {
  GET_URL_HASH,
  GET_URL_HASH_SUCCESS,
  SELECTION_REQUEST_FAILED,
  CHANGE_FEDERAL_STATE_RADIO,
  CHANGE_DATE_LOOKUP,
  GENERAL_FAIL,
  CHANGE_TIME_ZONE,
  CHANGE_ARCHIVED_TIME_ZONE,
  SET_TEMP_ADDRESS,
  GEOCODE_TEMP_ADDRESS,
} from "./constants";
import {
  resetOldEvents,
  updateExistingEvent,
  updateOldEvent,
} from "../events/actions";
import { toggleIncludeLiveEventsInLookup } from "./actions";

const getUrlLogic = createLogic({
  process() {
    const hash = document.location.hash
    return hash.replace((/[#/]/g), '') || 'dashboard';
  },
  processOptions: {
    failType: SELECTION_REQUEST_FAILED,
    successType: GET_URL_HASH_SUCCESS,
  },
  type: GET_URL_HASH,
});

const onSelectionChangeLogic = createLogic({
  process(deps, dispatch, done) {
    dispatch(resetOldEvents());
    dispatch(toggleIncludeLiveEventsInLookup(false))
    done();
  },
  type: [CHANGE_FEDERAL_STATE_RADIO, CHANGE_DATE_LOOKUP],
});

const requestLatLngLogic = createLogic({
  type: GEOCODE_TEMP_ADDRESS,
  processOptions: {
    successType: SET_TEMP_ADDRESS,
    failType: GENERAL_FAIL,
  },
  process(deps) {
    const {
      action,
      httpClient,
    } = deps;
    const {
      payload
    } = action;
    return httpClient
      .get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDP8q2OVisSLyFyOUU6OTgGjNNQCq7Q3rE')
      .set('Accept', 'application/json')
      .query({
        address: payload,
      })
      .then((r) => {
        console.log(r.body.results[0]);
        const {
          results,
        } = r.body;
        if (results) {
          const stateData = find(results[0].address_components, {
            types: ['administrative_area_level_1', 'political']
          });
          console.log(stateData)
          return {
              address: results[0].formatted_address.split(', USA')[0],
              stateName: stateData ? stateData.long_name : null,
              state: stateData ? stateData.short_name : null,
              lat: results[0].geometry.location.lat,
              lng: results[0].geometry.location.lng,
            }
        }
        return Promise.reject(new Error('error geocoding'));
      });
  }
})

const requestTimeZoneLogic = createLogic({
  type: CHANGE_TIME_ZONE,
  processOptions: {
    failType: GENERAL_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      httpClient,
    } = deps;
    const {
      payload
    } = action;
    console.log(payload);
    const time = Date.parse(`${payload.date} ${payload.time}`) / 1000;
    const loc = `${payload.lat},${payload.lng}`;
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${time}&key=AIzaSyBvs-ugD9uydf8lUBwiwvN4dB5X9lbgpLw`;
    httpClient.get(url)
      .then((r) => {
        const response = r.body;
        console.log(response)
        if (!response.timeZoneName) {
          return Error('no timezone results', response);
        }
        const timezoneAb = response.timeZoneName.split(' ');
        const timeZone = timezoneAb.reduce((acc, cur) => {
          acc += cur[0];
          return acc;
        }, '');
        const offset = response.rawOffset / 60 / 60 + response.dstOffset / 60 / 60;
        let utcoffset;
        if (Number(offset) === offset) {
          utcoffset = `UTC${offset}00`;
        } else {
          const fract = ((offset * 10) % 10) / 10;
          const integr = Math.trunc(offset);
          let mins = (Math.abs(fract * 60)).toString();
          const zeros = '00';
          mins = zeros.slice(mins.length) + mins;
          utcoffset = `UTC${integr}${mins}`;
        }

        const dateObj = moment(`${payload.date} ${payload.time} ${utcoffset}`).utc().valueOf();
        console.log(dateObj, moment(dateObj).format());

        const path = payload.pathForEvents;
        const eventId = payload.eventId;
        const eventData = {
          dateObj: dateObj,
          timeZone: timeZone,
        }
        dispatch(updateExistingEvent(eventData, path, eventId));
        done();
      })
  }
});

const requestArchivedTimeZoneLogic = createLogic({
  type: CHANGE_ARCHIVED_TIME_ZONE,
  processOptions: {
    failType: GENERAL_FAIL,
  },
  process(deps, dispatch, done) {
    const {
      action,
      httpClient,
    } = deps;
    const {
      payload
    } = action;
    const time = Date.parse(`${payload.date} ${payload.time}`) / 1000;
    const loc = `${payload.lat},${payload.lng}`;
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${time}&key=AIzaSyBvs-ugD9uydf8lUBwiwvN4dB5X9lbgpLw`;
    httpClient.get(url)
      .then((r) => {
        const response = r.body;
        console.log(response)
        if (!response.timeZoneName) {
          return Error('no timezone results', response);
        }
        const offset = response.rawOffset / 60 / 60 + response.dstOffset / 60 / 60;
        const newTimeStart = moment.parseZone(payload.timeStart).utcOffset(offset, true);
        const newTimeEnd = moment.parseZone(payload.timeEnd).utcOffset(offset, true);
        const eventData = {
          timestamp: newTimeStart.format('x'),
          timeStart: newTimeStart.format(),
          timeEnd: newTimeEnd.format(),
        }
        dispatch(updateOldEvent(eventData, payload.eventId));
        done();
      })
  }
});

export default [
    requestLatLngLogic,
    requestTimeZoneLogic,
    requestArchivedTimeZoneLogic,
    getUrlLogic,
    onSelectionChangeLogic,
];