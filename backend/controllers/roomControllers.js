import cloudinary from 'cloudinary';
import Room from '../models/roomModel';
import Booking from '../models/bookingModel';
import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import APIFeatures from '../utils/apiFeatures';

// Create new room   =>   /api/rooms
export const createNewRoom = catchAsyncErrors(async (req, res) => {
  const images = req.body.images;

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'bookit/rooms',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  const room = await Room.create(req.body);

  res.status(200).json({
    success: true,
    room,
  });
});

// get all rooms
export const getAllRooms = catchAsyncErrors(async (req, res) => {
  const resPerPage = 4;

  const roomsCount = await Room.countDocuments();
  const apiFeatures = new APIFeatures(Room.find({}), req.query)
    .search()
    .filter();

  apiFeatures.pagination(resPerPage);
  let rooms = await apiFeatures.query;
  let filteredRoomsCount = rooms.length;

  res.status(200).json({
    success: true,
    roomsCount,
    resPerPage,
    filteredRoomsCount,
    rooms,
  });
});

// Get room details   =>   /api/rooms/:id
export const getSingleRoom = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler('Room not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});

// Update room details   =>   /api/rooms/:id
export const updateRoom = catchAsyncErrors(async (req, res) => {
  let room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler('Room not found with this ID', 404));
  }

  if (req.body.images) {
    // Delete images associated with the room
    for (let i = 0; i < room.images.length; i++) {
      await cloudinary.v2.uploader.destroy(room.images[i].public_id);
    }

    let imagesLinks = [];
    const images = req.body.images;

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'bookit/rooms',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    room,
  });
});

// Delete room   =>   /api/rooms/:id
export const deleteRoom = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler('Room not found with this ID', 404));
  }

  // Delete images associated with the room
  for (let i = 0; i < room.images.length; i++) {
    await cloudinary.v2.uploader.destroy(room.images[i].public_id);
  }

  await room.remove();

  res.status(200).json({
    success: true,
    message: 'Room is deleted.',
  });
});

// Create a new room review =>/api/review

export const createRoomReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, roomId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const room = await Room.findById(roomId);

  const isReviewed = room.reviews.find(
    // if review user === to the current user then update the review
    (r) => r.user.toString() === req.user._id.toString(),
  );
  if (isReviewed) {
    room.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    room.reviews.push(review);
    room.numOfReviews = room.reviews.length;
  }

  room.ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) /
    room.reviews.length;
  await room.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Check Review Availability   =>   /api/reviews/check_review_availability
export const checkReviewAvailability = catchAsyncErrors(async (req, res) => {
  const { roomId } = req.query;

  const bookings = await Booking.find({ user: req.user._id, room: roomId });

  let isReviewAvailable = false;
  if (bookings.length > 0) isReviewAvailable = true;

  res.status(200).json({
    success: true,
    isReviewAvailable,
  });
});

// Admin Routes
export const getAllAdminRooms = catchAsyncErrors(async (req, res) => {
  const rooms = await Room.find({}).sort({ createdAt: -1 }).exec();
  res.status(200).json({
    success: true,
    rooms,
  });
});

// Get all room reviews - ADMIN   =>   /api/reviews
export const getRoomReviews = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);
  if (!room) {
    return next(new ErrorHandler('Room not found with this ID', 404));
  }
  res.status(200).json({
    success: true,
    reviews: room.reviews,
  });
});

// Delete room review - ADMIN   =>   /api/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.roomId);
  if (!room) {
    return next(new ErrorHandler('Room not found with this ID', 404));
  }
  const reviews = room.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString(),
  );

  const numOfReviews = reviews.length;

  const ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Room.findByIdAndUpdate(
    req.query.roomId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  );

  res.status(200).json({
    success: true,
  });
});

/**Room Stats */

// get room starts - ADMIN   =>   /api/admin/rooms/roomstats
export const getAllStats = catchAsyncErrors(async (req, res) => {
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

  res.status(200).json({
    success: true,
    roomstats,
  });
});
