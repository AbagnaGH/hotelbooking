import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';

import { getBookingDetails } from '../../../backend/controllers/bookingControllers';

import onError from '../../../backend/middlewares/errors';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).get(getBookingDetails);

export default handler;
