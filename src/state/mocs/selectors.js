import { createSelector } from 'reselect';
import {
  map,
  find
} from 'lodash';

export const getAllMocsIds = state => state.mocs.allMocIds;
export const get116thCongressData = state => state.mocs[116];
export const get115thCongress = state => state.mocs[115];

export const get116thCongress = createSelector([get116thCongressData], (congress) => {
    return map(congress, ele => {
        if (!ele) {
            console.log(ele)
            return;
        }
        const role = find(ele.roles, (ele) => ele.congress === '116')
        console.log(role)
        return {
            ...ele,
            ...role,
        }  })
})

export const getAllMocNames = createSelector([getAllMocsIds], (mocIdObjs) => {
    return map(mocIdObjs, 'nameEntered');
})

