import { createSelector } from 'reselect';
import {
  map,
  find,
} from 'lodash';

export const getAllResearchers = state => state.researchers.allResearchers;
export const getAllResearchedMocData = state => state.researchers.allResearchedMocs;

export const getAllResearcherEmails = createSelector([getAllResearchers], (allResearchers) => {
  return allResearchers.filter((r) => r.email).map((r) => r.email);
});

export const getResearchersEmailById = createSelector([getAllResearchers], (allResearchers) => {
  return allResearchers.reduce((obj, r) => {
    if (r.uid) return Object.assign(obj, {[r.uid]: r.email});
    else return obj;
  }, {});
});

export const combineMocNamesWithResearchers = createSelector([getAllResearchers, getAllResearchedMocData],
  (allResearchers, allResearchedMocs) => map(allResearchers, (researcher) => {
    const mocs = map(researcher.mocs, (moc) => {
      const mocData = find(allResearchedMocs, mocData => (mocData.id === moc.id));
      if (!mocData) {
          return moc;
      }
      return {
        ...moc,
        ...mocData,
      };
    })
    return {
        ...researcher,
        mocs,
    }
  })
);
