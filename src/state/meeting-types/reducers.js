import {
  GET_MEETING_TYPES_SUCCESS,
  GET_MEETING_TYPES_FAILED,
  SET_LOADING,
  UPDATE_MEETING_TYPE_SUCCESS,
  UPDATE_MEETING_TYPE_FAILED,
} from "./constants";

const initialState = {
  allMeetingTypes: [],
  error: null,
  loading: false,
};

const meetingTypesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };

    case GET_MEETING_TYPES_SUCCESS:
      return {
        ...state,
        allMeetingTypes: payload,
        loading: false,
        error: null,
      };

    // case GET_USER_EMAIL_FOR_EVENT_SUCCESS:
    //   return {
    //     ...state,
    //     allEvents: state.allEvents.map((event) => event.eventId === payload.eventId ? {
    //       ...event,
    //       userEmail: payload.email
    //     } : event)
    // };

    case GET_MEETING_TYPES_FAILED:
      console.log(`GET_EVENTS_FAILED: ${payload}`);
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default meetingTypesReducer;
