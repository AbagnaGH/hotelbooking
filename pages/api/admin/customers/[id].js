import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';

import {
  getCustomerDetails,
  updateCustomer,
} from '../../../../backend/controllers/authControllers';

import onError from '../../../../backend/middlewares/errors';

import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .get(getCustomerDetails);

handler.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateCustomer);


export default handler;
