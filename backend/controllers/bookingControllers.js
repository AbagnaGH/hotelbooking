import Booking from '../models/bookingModel';
import User from '../models/userModel';
import Room from '../models/roomModel';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
const _ = require('lodash');
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ErrorHandler from '../utils/errorHandler';
const axios = require('axios');

// let PayStack = require('paystack-node');
// let APIKEY = process.env.STRIPE_SECRET_KEY;
// const paystack = new PayStack(APIKEY);

const moment = extendMoment(Moment);

// Create new Booking   =>   /api/bookings
export const newBooking = catchAsyncErrors(async (req, res, next) => {
  const {
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    // amountPaid,
    paymentInfo,
  } = req.body;

  //add verification of transaction here transaction
  // verifyTransaction

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${req.body.paymentInfo.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (response.data.data.status === 'success') {
      const bookingdata = await new Booking({
        room,
        checkInDate,
        checkOutDate,
        daysOfStay,
        amountPaid: response.data.data.amount,
        paymentInfo,
        reference: response.data.data.reference,
        user: req.user._id,
      }).save();
      // console.log(bookingdata);
      res.send(bookingdata);
    }

    // console.log('Data', response.data);
    // console.log('REF ID', response.data.data.reference);

    // let ref = paymentInfo.reference;
  } catch (err) {
    console.log(err);
  }
});

// Create new booking   =>   /api/bookings/check
export const checkRoomBookingAvailability = catchAsyncErrors(
  async (req, res, next) => {
    let { roomId, checkInDate, checkOutDate } = req.query;

    checkInDate = new Date(checkInDate);
    checkOutDate = new Date(checkOutDate);

    const bookings = await Booking.find({
      room: roomId,
      $and: [
        {
          checkInDate: {
            $lte: checkOutDate,
          },
        },
        {
          checkOutDate: {
            $gte: checkInDate,
          },
        },
      ],
    });

    // Check if there is any booking available
    let isAvailable;

    if (bookings && bookings.length === 0) {
      isAvailable = true;
    } else {
      isAvailable = false;
    }

    res.status(200).json({
      success: true,
      isAvailable,
    });
  },
);

// Check booked dates of a room   =>   /api/bookings/check_booked_dates
export const checkBookedDatesOfRoom = catchAsyncErrors(
  async (req, res, next) => {
    const { roomId } = req.query;

    const bookings = await Booking.find({ room: roomId });

    let bookedDates = [];

    const timeDiffernece = moment().utcOffset() / 60;

    bookings.forEach((booking) => {
      const checkInDate = moment(booking.checkInDate).add(
        timeDiffernece,
        'hours',
      );
      const checkOutDate = moment(booking.checkOutDate).add(
        timeDiffernece,
        'hours',
      );

      const range = moment.range(moment(checkInDate), moment(checkOutDate));

      const dates = Array.from(range.by('day'));
      bookedDates = bookedDates.concat(dates);
    });

    res.status(200).json({
      success: true,
      bookedDates,
    });
  },
);

// Get all bookings of current user   =>   /api/bookings/profile
export const myBookings = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'room',
      select: 'name pricePerNight images',
    })
    .populate({
      path: 'user',
      select: 'name email',
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// Get booking details   =>   /api/bookings/:id
export const getBookingDetails = catchAsyncErrors(async (req, res, next) => {
  const booking = await Booking.findById(req.query.id)
    .populate({
      path: 'room',
      select: 'name pricePerNight images',
    })
    .populate({
      path: 'user',
      select: 'name email',
    });

  res.status(200).json({
    success: true,
    booking,
  });
});

// Get all bookings - ADMIN   =>   /api/admin/bookings
export const allAdminBookings = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate({
      path: 'room',
      select: 'name pricePerNight images',
    })
    .populate({
      path: 'user',
      select: 'name email',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// Delete booking - ADMIN   =>   /api/admin/bookings/id
export const deleteBooking = catchAsyncErrors(async (req, res, next) => {
  const booking = await Booking.findById(req.query.id);

  if (!booking) {
    return next(new ErrorHandler('Booking not found with this ID', 400));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
  });
});

// get monthly plan - ADMIN   =>   /api/admin/bookings/bookingstats
export const getMonthlyPlan = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.aggregate([
    {
      $group: {
        _id: null,
        numBookings: { $sum: 1 },
        totalSales: { $sum: '$amountPaid' },
        // daysOfStay: { $push: '$daysOfStay' },
        // checkInDate: { $push: '$checkInDate' },
        // checkOutDate: { $push: '$checkOutDate' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  const customers = await User.aggregate([
    {
      $match: { role: 'customer' },
    },
    {
      $group: {
        _id: null,
        numCustomers: { $sum: 1 },
        // joindate: { $push: '$createdAt' },
      },
    },
  ]);
  const dailyBookings = await Booking.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        bookings: { $sum: 1 },
        sales: { $sum: '$amountPaid' },
        avgPrice: { $avg: '$amountPaid' },
        minPrice: { $min: '$amountPaid' },
        maxPrice: { $max: '$amountPaid' },
        numDaysOfStay: { $sum: '$daysOfStay' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const dailyCustomers = await User.aggregate([
    {
      $match: { role: 'customer' },
    },

    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        numCustomers: { $sum: 1 },
      },
    },
  ]);

  const dailyReservation = await Booking.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        numReservation: { $sum: 1 },
      },
    },
  ]);

  const roomstats = await Room.aggregate([
    // { $match: { ratings: { $gte: 4 } } },
    {
      $group: {
        _id: { $toUpper: '$category' },
        // _id: '$ratings',
        numRooms: { $sum: 1 },
        numRatings: { $sum: '$ratings' },
        avgRatings: { $sum: '$ratings' },
        avgPrice: { $avg: '$pricePerNight' },
        minPrice: { $min: '$pricePerNight' },
        maxPrice: { $max: '$pricePerNight' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  const roomstotal = await Room.aggregate([
    // { $match: { ratings: { $gte: 4 } } },
    {
      $group: {
        _id: null,
        // _id: '$ratings',
        totalRooms: { $sum: 1 },
        totalRatings: { $sum: '$ratings' },
        avgRatings: { $sum: '$ratings' },
        avgPrice: { $avg: '$pricePerNight' },
        minPrice: { $min: '$pricePerNight' },
        maxPrice: { $max: '$pricePerNight' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  // const date = new Date();
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  // console.log('Last Month',lastMonth);
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  // console.log('Previous Month',previousMonth);

  const mothlyIncome = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: previousMonth },
      },
    },

    {
      $project: {
        month: { $month: '$createdAt' },
        // month: {
        //   $dateToString: {
        //     format: '%d/%m/%Y',
        //     date: '$createdAt',
        //   },
        // },
        sales: '$amountPaid',
      },
    },

    {
      $group: {
        _id: '$month',
        total: { $sum: '$sales' },
        months: { $push: '$month' },
      },
    },
  ]);

  res.status(200).json({
    dailyBookings,
    customers,
    bookings,
    roomstats,
    roomstotal,
    dailyCustomers,
    dailyReservation,
    mothlyIncome,
  });
});
