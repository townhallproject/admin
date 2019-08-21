import { createSelector } from "reselect";
import { filter } from "lodash";

export const getTotalSMSUsers = state => state.smsUsers.totalSmsUsers;
export const getUserCache = state => state.smsUsers.userCache;
export const getPotentialVols = state => state.smsUsers.potentialVols;

export const getUsersWithMessages = createSelector([getUserCache], (users) => {
    return filter(users, (ele) => ele.messages && ele.messages.length);
})

export const getUsersWithReplies = createSelector([getUsersWithMessages], (users) => {
  return filter(users, (ele) => ele.messages.length > 1);
})