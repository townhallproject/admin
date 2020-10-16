import {
  PENDING_EVENTS_TAB,
  LIVE_EVENTS_TAB,
  ARCHIVED_EVENTS_TAB,
} from "../../constants";

export const firebaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_DATABASE_URL
    : process.env.REACT_APP_TESTING_DATABASE_URL;
export const stateLegislatorsData = "state_legislators_data";
export const stateLegislatorsId = "state_legislators_id";
export const candidateData = "candidate_data";
export const candidateKeys = "candidate_keys";

export const PENDING_FEDERAL_PATH = "UserSubmission";
export const PENDING_STATE_PATH = "state_legislators_user_submission";
export const LIVE_FEDERAL_PATH = "townHalls";
export const LIVE_STATE_PATH = "state_townhalls";
export const ARCHIVED_FEDERAL_PATH = "archived_town_halls";
export const ARCHIVED_STATE_PATH = "archived_state_town_halls";
export const MEETING_TYPES_PATH = "meeting_types";
export const EVENTS_PATHS = {
  [PENDING_EVENTS_TAB]: {
    FEDERAL: PENDING_FEDERAL_PATH,
    STATE: PENDING_STATE_PATH,
  },
  [LIVE_EVENTS_TAB]: {
    FEDERAL: LIVE_FEDERAL_PATH,
    STATE: LIVE_STATE_PATH,
  },
  [ARCHIVED_EVENTS_TAB]: {
    FEDERAL: ARCHIVED_FEDERAL_PATH,
    STATE: ARCHIVED_STATE_PATH,
  },
  [PENDING_FEDERAL_PATH]: {
    FEDERAL_OR_STATE: "FEDERAL",
    STATUS: "PENDING",
  },
  [PENDING_STATE_PATH]: {
    FEDERAL_OR_STATE: "STATE",
    STATUS: "PENDING",
  },
  [LIVE_FEDERAL_PATH]: {
    FEDERAL_OR_STATE: "FEDERAL",
    STATUS: "LIVE",
  },
  [LIVE_STATE_PATH]: {
    FEDERAL_OR_STATE: "STATE",
    STATUS: "LIVE",
  },
  [ARCHIVED_FEDERAL_PATH]: {
    FEDERAL_OR_STATE: "FEDERAL",
    STATUS: "ARCHIVED",
  },
  [ARCHIVED_STATE_PATH]: {
    FEDERAL_OR_STATE: "STATE",
    STATUS: "ARCHIVED",
  },
};
export const ARCHIVE_MANAGER_URL = "https://archive-manager.herokuapp.com/";
export const ARCHIVE_MANAGER_DEV_URL = "http://localhost:5000/";
