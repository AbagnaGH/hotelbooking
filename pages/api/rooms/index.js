import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';

import {
  getAllRooms,
  createNewRoom,
} from '../../../backend/controllers/roomControllers';

import onError from '../../../backend/middlewares/errors';
import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.get(getAllRooms);

// handler.use(isAuthenticatedUser, authorizeRoles('admin')).post(createNewRoom);

export default handler;
