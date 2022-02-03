import mongoose from 'mongoose';
import timeZone from 'mongoose-timezone';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const bookingSchema = new Schema({
  room: {
    type: ObjectId,
    // required: true,
    ref: 'Room',
  },
  user: {
    type: ObjectId,
    // required: true,
    ref: 'User',
  },
  checkInDate: {
    type: Date,
    // required: true,
  },
  checkOutDate: {
    type: Date,
    // required: true,
  },
  amountPaid: {
    type: Number,
    // required: true,
  },
  daysOfStay: {
    type: Number,
    // required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      // required: true,
    },
    reference: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reference: {
    type: String,
    required: true,
  },
});

bookingSchema.plugin(timeZone);

export default mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema);
