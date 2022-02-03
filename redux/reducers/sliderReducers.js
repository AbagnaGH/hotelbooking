import {
  NEW_SLIDER_FAIL,
  NEW_SLIDER_REQUEST,
  NEW_SLIDER_RESET,
  NEW_SLIDER_SUCCESS,
  ADMIN_SLIDERS_REQUEST,
  ADMIN_SLIDERS_SUCCESS,
  ADMIN_SLIDERS_FAIL,
  CLEAR_ERRORS,
  UPDATE_SLIDER_REQUEST,
  UPDATE_SLIDER_SUCCESS,
  UPDATE_SLIDER_RESET,
  UPDATE_SLIDER_FAIL,
  GET_ALL_SLIDERS_SUCCESS,
  GET_ALL_SLIDERS_FAIL,
  GET_SLIDER_DETAILS_SUCCESS,
  GET_SLIDER_DETAILS_FAIL,
} from '../constants/sliderConstants';

export const createNewSliderReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_SLIDER_REQUEST:
      return {
        loading: true,
      };

    case NEW_SLIDER_SUCCESS:
      return {
        loading: false,
        success: true,
        slider: action.payload,
      };

    case NEW_SLIDER_RESET:
      return {
        success: false,
      };

    case NEW_SLIDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const getAllSlidersByAdminReducer = (
  state = { sliders: [] },
  action,
) => {
  switch (action.type) {
    case ADMIN_SLIDERS_REQUEST:
      return {
        loading: true,
      };

    case GET_ALL_SLIDERS_SUCCESS:
      return {
        // roomsCount: action.payload.roomsCount,
        // resPerPage: action.payload.resPerPage,
        // filteredRoomsCount: action.payload.filteredRoomsCount,
        sliders: action.payload.sliders,
      };

    case ADMIN_SLIDERS_SUCCESS:
      return {
        loading: false,
        sliders: action.payload,
      };

    case GET_ALL_SLIDERS_FAIL:
    case ADMIN_SLIDERS_FAIL:
      return {
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Get  rooms details reducer
export const getSliderDetailsReducer = (state = { slider: {} }, action) => {
  switch (action.type) {
    case GET_SLIDER_DETAILS_SUCCESS:
      return {
        slider: action.payload,
      };
    case GET_SLIDER_DETAILS_FAIL:
      return {
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const sliderReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SLIDER_REQUEST:
      return {
        loading: true,
      };

    case UPDATE_SLIDER_SUCCESS:
      return {
        loading: false,
        isUpdated: action.payload,
      };

    case UPDATE_SLIDER_RESET:
      return {
        isUpdated: false,
      };

    case UPDATE_SLIDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
