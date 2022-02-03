import {
  NEW_SLIDER_FAIL,
  NEW_SLIDER_REQUEST,
  NEW_SLIDER_SUCCESS,
  CLEAR_ERRORS,
  ADMIN_SLIDERS_SUCCESS,
  ADMIN_SLIDERS_FAIL,
  ADMIN_SLIDERS_REQUEST,
  UPDATE_SLIDER_REQUEST,
  GET_SLIDER_DETAILS_SUCCESS,
  GET_SLIDER_DETAILS_FAIL,
  UPDATE_SLIDER_FAIL,
  UPDATE_SLIDER_SUCCESS,
} from '../constants/sliderConstants';

import axios from 'axios';
import absoluteUrl from 'next-absolute-url';

// Create new Slider
export const newSlider = (sliderData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_SLIDER_REQUEST,
    });

    const config = {
      'Content-Type': 'application/json',
    };
    const { data } = await axios.post('/api/admin/sliders', sliderData, config);
    dispatch({
      type: NEW_SLIDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: NEW_SLIDER_FAIL, payload: message });
  }
};

// Get all sliders - ADMIN
export const getAllSlidersByAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SLIDERS_REQUEST });

    const { data } = await axios.get(`/api/admin/sliders`);
    // console.log(data);
    dispatch({
      type: ADMIN_SLIDERS_SUCCESS,
      payload: data.sliders,
    });
  } catch (error) {
    console.log(error);

    dispatch({
      type: ADMIN_SLIDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateSlider = (id, sliderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SLIDER_REQUEST });
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.put(
      `/api/admin/sliders/${id}`,
      sliderData,
      config,
    );

    dispatch({
      type: UPDATE_SLIDER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SLIDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get slider details
export const getSliderDetails = (req, id) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);

    let url;

    if (req) {
      url = `${origin}/api/admin/sliders/${id}`;
    } else {
      url = `/api/admin/sliders/${id}`;
    }

    const { data } = await axios.get(url);
    // console.log(data);
    dispatch({
      type: GET_SLIDER_DETAILS_SUCCESS,
      payload: data.slider,
    });
  } catch (error) {
    dispatch({
      type: GET_SLIDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
