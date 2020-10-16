import {
  GET_MEETING_TYPES,
  GET_MEETING_TYPES_SUCCESS,
  GET_MEETING_TYPES_FAILED,
  UPDATE_MEETING_TYPE,
  UPDATE_MEETING_TYPE_SUCCESS,
  UPDATE_MEETING_TYPE_FAILED,
} from "./constants";

const initialState = {
  allMeetingTypes: [],
  error: null,
  loading: false,
  updateLoading: false,
  success: false,
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
    case UPDATE_MEETING_TYPE:
      return {
        ...state,
        updateLoading: true,
        success: false,
      };

    case GET_MEETING_TYPES:
      return {
        ...state,
        loading: true,
      };

    case GET_MEETING_TYPES_SUCCESS:
      return {
        ...state,
        allMeetingTypes: payload,
        loading: false,
        error: null,
      };

    case UPDATE_MEETING_TYPE_SUCCESS:
      return {
        ...state,
        allMeetingTypes: state.allMeetingTypes.map((meetingType) => {
          if (meetingType.id == payload.id) {
            meetingType = { ...meetingType, ...payload };
          }
          return meetingType;
        }),
        updateLoading: false,
        success: true,
        error: null,
      };

    case GET_MEETING_TYPES_FAILED:
    case UPDATE_MEETING_TYPE_FAILED:
      console.log(`GET_EVENTS_FAILED: ${payload}`);
      return {
        ...state,
        loading: false,
        updateLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default meetingTypesReducer;
