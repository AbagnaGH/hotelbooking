import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';

import {
  getUserDetails,
  updateUser,
  deleteUser,
} from '../../../../backend/controllers/authControllers';

import onError from '../../../../backend/middlewares/errors';

import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles('admin')).get(getUserDetails);

handler.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateUser);

handler.use(isAuthenticatedUser, authorizeRoles('admin')).delete(deleteUser);

export default handler;
