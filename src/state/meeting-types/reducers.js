import {
  GET_MEETING_TYPES,
  GET_MEETING_TYPES_SUCCESS,
  GET_MEETING_TYPES_FAILED,
  // UPDATE_MEETING_TYPE_SUCCESS,
  // UPDATE_MEETING_TYPE_FAILED,
} from "./constants";

const initialState = {
  allMeetingTypes: [],
  error: null,
  loading: false,
  iconFlags: [
    {
      text: "In Person",
      data: "in-person",
    },
    {
      text: "Activist Event",
      data: "activism",
    },
    {
      text: "Tele Town Hall",
      data: "tele",
    },
    {
      text: "Campaign Town Hall",
      data: "campaign",
    },
    {
      text: "Staff",
      data: "staff",
    },
    {
      text: "HR 1 Event",
      data: "hr-one",
    },
    {
      text: "Youth Vote Town Hall",
      data: "next-gen",
    },
    {
      text: "March For Our Lives",
      data: "mfol",
    },
  ],
};

const meetingTypesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MEETING_TYPES:
      return {
        ...state,
        loading: true,
      };

    case GET_MEETING_TYPES_SUCCESS:
      console.log({ payload });
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
