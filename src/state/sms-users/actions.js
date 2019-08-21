import { 
  REQUEST_TOTAL_USERS, REQUEST_CACHE, SEND_SMS_MESSAGE, RECEIVE_MESSAGE, REQUEST_POTENTIAL_VOLS
} from "./constants";

export const requestTotalCount = () => ({
  type: REQUEST_TOTAL_USERS,
});

export const requestCache = () => ({
  type: REQUEST_CACHE,
})

export const sendMessage = (payload) => ({
  payload,
  type: SEND_SMS_MESSAGE,
})

export const receiveMessage = payload => ({
  payload,
  type: RECEIVE_MESSAGE,
})

export const requestPotentialVols = () => ({
  type: REQUEST_POTENTIAL_VOLS,
})