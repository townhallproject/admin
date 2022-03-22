import { createSelector } from 'reselect';
import {
  map,
  find
} from 'lodash';

export const getAllMocState = state => state.mocs;
export const getAllMocsIds = state => state.mocs.allMocIds;
export const getNthCongressData = n_congress => state => state.mocs[n_congress];
export const get116thCongressData = state => state.mocs[116];
export const get115thCongress = state => state.mocs[115];
export const getSelectedState = state => state.mocs.selectedStateLeg;
export const getCurrentlyEditingPerson = state => state.mocs.currentlyEditingPerson;

export const getNthCongress = n_congress => createSelector(
    getNthCongressData(n_congress),
    congress => {
        return map(congress, ele => {
            if (!ele) {
                return;
            }
            const role = find(ele.roles, (ele) => ele.congress === n_congress.toString());
            const mergedPerson = {
              ...ele,
              ...role,
            }
            mergedPerson.id = ele.id; // make sure id is the moc id and not the role id
            return mergedPerson;
        });
    }
)

export const get116thCongress = getNthCongress(116);

export const getAllMocNames = createSelector([getAllMocsIds], (mocIdObjs) => {
    return map(mocIdObjs, 'nameEntered');
})

export const getSelectedStateData = createSelector([getSelectedState, getAllMocState], (selectedUsState, mocData) => {
    return mocData[selectedUsState];
})

export const getSelectedStateLeg = createSelector([getSelectedStateData], (stateLegData) => {
    return map(stateLegData, ele => {
      if (!ele) {
        return;
      }
      const role = ele.roles[ele.current_office_index];
       const mergedPerson = {
         ...ele,
         ...role,
       }
       mergedPerson.id = ele.id; // make sure id is the moc id and not the role id
       return mergedPerson;
    })
})