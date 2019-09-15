import { createSelector } from "reselect";
import moment from 'moment';
import {
  filter,
  map,
  findIndex,
  find,
} from "lodash";

export const getTotalSMSUsers = state => state.smsUsers.totalSmsUsers;
export const getUserCache = state => state.smsUsers.userCache;
export const getPotentialVols = state => state.smsUsers.potentialVols;

export const getUsersWithMessages = createSelector([getUserCache], (users) => {
  return filter(users, (ele) => ele.messages && ele.messages.length);
})

export const getUsersWithReplies = createSelector([getUsersWithMessages], (users) => {
  return filter(users, (ele) => ele.messages.length > 1);
})

export const getRecentConversations = createSelector([getUsersWithReplies], (filtered) => {
    return filter(filtered, (user) => {
      const date = moment(user.messages[0].time_stamp);
      const aWeekAgo = moment().subtract(1, 'week');
      return date.isAfter(aWeekAgo);
    })
})

export const getPotentialVolsWithReplyData = createSelector([getRecentConversations, getPotentialVols], (usersWithMessages, potentialVols) => {
  const vols =  map(potentialVols, vol => {
    const data = find(usersWithMessages, (user) => user.phoneNumber === vol.phoneNumber);
    if (data) {
      vol.respondedOn = moment(data.messages[1].time_stamp).format('L');
      vol.stateDistrict = data.stateDistrict;
      return vol;
    } else {
      return null;
    }
  })
  return filter(vols);
})
