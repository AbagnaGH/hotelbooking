import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Carousel } from 'react-bootstrap';
import RoomFeatures from '../../components/room/RoomFeatures';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors } from '../../redux/actions/roomActions';
import {
  checkBooking,
  getBookedDates,
  newBooking,
} from '../../redux/actions/bookingActions';
import {
  CHECK_BOOKING_RESET,
  NEW_BOOKING_RESET,
} from '../../redux/constants/bookingConstants';
import { usePaystackPayment } from 'react-paystack';

import NewReview from '../review/NewReview';
import ListReviews from '../review/ListReviews';

const RoomDetails = () => {
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();

  const dispatch = useDispatch();
  const router = useRouter();

  const { dates } = useSelector((state) => state.bookedDates);
  const { user } = useSelector((state) => state.loadedUser);
  // console.log(user && user.email);
  const { room, error } = useSelector((state) => state.getRoomDetails);

  const {
    loading: newBookingLoading,
    booking,
    success,
    error: newBookingError,
  } = useSelector((state) => state.newBooking);
  // console.log(booking && booking);

  const { available, loading: bookingLoading } = useSelector(
    (state) => state.checkBooking,
  );

  const excludedDates = [];

  dates.forEach((date) => {
    excludedDates.push(new Date(date));
  });

  const onChange = (dates) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      // Calclate days of stay

      const days = Math.floor(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000 + 1,
      );

      setDaysOfStay(days);

      dispatch(
        checkBooking(id, checkInDate.toString(), checkOutDate.toString()),
      );
    }
  };

  // paystack integration
  const config = {
    reference: new Date().getTime().toString(),
    email: user && user.email,
    firstname: user && user.name,
    amount: room && daysOfStay * room.pricePerNight * 100,
    currency: 'GHS',
    // amount: daysOfStay * room.pricePerNight,
    publicKey: process.env.PAYSTACK_API_KEY,
    metadata: {
      custom_fields: [
        {
          room: room && room.name,
          daysOfStay: daysOfStay,
        },
      ],
    },
  };

  // you can call this function anything
  const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    placeBookingsHandler(reference); //Awall added this
    toast.success('Payment made successfully');
    //console.log(reference);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    toast.error('Transaction Cancelled');
    router.push('/');
    // console.log('closed');
  };

  const PaystackHookExample = () => {
    const initializePayment = usePaystackPayment(config);
    return (
      <div>
        <button
          className="btn btn-block py-3 booking-btn"
          onClick={() => {
            initializePayment(onSuccess, onClose);
          }}
        >
          Pay - GHS {daysOfStay * room.pricePerNight}
        </button>
      </div>
    );
  };

  const { id } = router.query;

  useEffect(() => {
    dispatch(getBookedDates(id));

    toast.error(error);
    dispatch(clearErrors());

    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
      if (success) {
        dispatch({ type: NEW_BOOKING_RESET });
      }
    };
  }, [dispatch, success, booking, id, error]);

  const placeBookingsHandler = (params) => {
    //console.log(params);
    dispatch(
      newBooking({
        room: router.query.id,
        checkInDate,
        checkOutDate,
        daysOfStay,
        amountPaid: daysOfStay * room.pricePerNight * 100,
        paymentInfo: {
          id: params.transaction, //Awal added this
          status: params.status, //Awal added this
          reference: params.reference, //Awal added this
        },
      }),
    );
  };

  return (
    <>
      <Head>
        <title>{room && room.name} - Blue Planet</title>
      </Head>

      <div className="container container-fluid">
        <h2 className="mt-5">{room && room.name}</h2>
        <p>{room && room.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(room.ratings / 5) * 100}%` }}
            ></div>
          </div>
          <span id="no_of_reviews">({room && room.numOfReviews} Reviews)</span>
        </div>

        <Carousel hover="pause">
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: '100%', height: '440px' }}>
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    alt={room.name}
                    layout="fill"
                  />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room.description}</p>

            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>GHS {room.pricePerNight}</b> / night
              </p>

              <hr />

              <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>

              <DatePicker
                className="w-100"
                selected={checkInDate}
                onChange={onChange}
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                excludeDates={excludedDates}
                selectsRange
                inline
              />

              {available === true && (
                <div className="alert alert-success my-3 font-weight-bold">
                  Room is available. Book now.
                </div>
              )}
              {available === true && (
                <div className="alert alert-info my-3 font-weight-bold">
                  You booked for : {daysOfStay}{' '}
                  {daysOfStay === 1 ? 'day' : 'days'}
                </div>
              )}

              {available === false && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Room not available. Try different dates.
                </div>
              )}

              {available && !user && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Login to book room.
                </div>
              )}

              {available && user && (
                // <button
                // className="btn btn-block py-3 booking-btn"
                // // onClick={PaystackHookExample}
                // disabled={bookingLoading ? true : false}
                // >
                //   Pay - GHC {daysOfStay * room.pricePerNight}
                // </button>
                <PaystackHookExample />
              )}
            </div>
          </div>
        </div>

        <NewReview />

        {room.reviews && room.reviews.length > 0 ? (
          <ListReviews reviews={room.reviews} />
        ) : (
          <p>
            <b>No Reviews on this room</b>
          </p>
        )}
      </div>
    </>
  );
};

export default RoomDetails;
