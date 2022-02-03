import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';

import {
  updateRoom,
  deleteRoom,
} from '../../../../backend/controllers/roomControllers';

import onError from '../../../../backend/middlewares/errors';
import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateRoom);

handler.use(isAuthenticatedUser, authorizeRoles('admin')).delete(deleteRoom);

export default handler;
