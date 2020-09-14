import { 
SET_FOUND_ZIPCODE
} from "./constants";

const initialState = {
  isInDatabase: 'init',
};

const userReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_FOUND_ZIPCODE:
      return {
        ...state,
        isInDatabase: payload,
      };

    default:
      return state;
  }
};

export default userReducer;