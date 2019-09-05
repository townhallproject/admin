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

    const filtered =  filter(users, (ele) => ele.messages && ele.messages.length);
    const messages = map(filtered, (user) => {
      const index = findIndex(user.messages, message => message.body ===`Hi! This is Jenita with Town Hall Project. We're in the midst of a month-long Congressional--when hundreds of town halls are held, and we need YOUR help! Can you volunteer just 1 hour / week from your own home to help us make sure Americans are informed of crucial opportunities to Show Up and Speak Out? There’s no easier way to play a powerful part in holding our elected officials accountable. To learn more, please reply back with YES.`)
      if (index > 0) {
        user.messages = user.messages.slice(index)
      }
      return user;
    })
    return messages;
})

export const getUsersWithReplies = createSelector([getUsersWithMessages], (users) => {
  return filter(users, (ele) => ele.messages.length > 1);
})

export const getPotentialVolsWithReplyData = createSelector([getUsersWithMessages, getPotentialVols], (usersWithMessages, potentialVols) => {
  return map(potentialVols, vol => {
    const data = find(usersWithMessages, (user) => user.phoneNumber === vol.phoneNumber);
    if (data) {
      vol.respondedOn = moment(data.messages[1].time_stamp).format('L');
      vol.stateDistrict = data.stateDistrict;
    } else {
      console.log('vol had no data', vol)
    }
    return vol;
  })
})
