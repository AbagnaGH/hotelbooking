import { combineReducers } from 'redux';
import {
  newBookingReducer,
  bookedDatesReducer,
  bookingDetailsReducer,
  bookingReducer,
  bookingsReducer,
  checkBookingReducer,
  bookingSummaryReducer,
} from './bookingReducers';
import {
  checkReviewReducer,
  createNewRoomReducer,
  getAllRoomsByAdminReducer,
  getAllRoomsReducer,
  getRoomDetailsReducer,
  newReviewReducer,
  reviewReducer,
  roomReducer,
  roomReviewsReducer,
} from './roomReducers';
import {
  createNewSliderReducer,
  getAllSlidersByAdminReducer,
  getSliderDetailsReducer,
  sliderReducer,
} from './sliderReducers';
import {
  authReducer,
  customerDetailsReducer,
  customerReducer,
  forgotPasswordReducer,
  getAllCustomersReducer,
  getAllUsersReducer,
  loadedUserReducer,
  userDetailsReducer,
  userReducer,
} from './userReducers';

const rootReducer = combineReducers({
  getAllRooms: getAllRoomsReducer,
  getRoomDetails: getRoomDetailsReducer,
  room: roomReducer,
  auth: authReducer,
  loadedUser: loadedUserReducer,
  user: userReducer,
  customer: customerReducer,
  getAllUsers: getAllUsersReducer,
  getAllCustomers: getAllCustomersReducer,
  userDetails: userDetailsReducer,
  customerDetails: customerDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  checkBooking: checkBookingReducer,
  bookedDates: bookedDatesReducer,
  bookings: bookingsReducer,
  booking: bookingReducer,
  bookingDetails: bookingDetailsReducer,
  newBooking: newBookingReducer,
  newReview: newReviewReducer,
  checkReview: checkReviewReducer,
  roomReviews: roomReviewsReducer,
  review: reviewReducer,
  getAllRoomsByAdmin: getAllRoomsByAdminReducer,
  createNewRoom: createNewRoomReducer,
  createNewSlider: createNewSliderReducer,
  slider: sliderReducer,
  getAllSliders: getAllSlidersByAdminReducer,
  getSliderDetails: getSliderDetailsReducer,
  bookingSummary: bookingSummaryReducer,
});

export default rootReducer;
