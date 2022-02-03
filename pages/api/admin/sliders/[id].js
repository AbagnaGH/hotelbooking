import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';

import {
  getSingleSlider,
  updateSlider,
} from '../../../../backend/controllers/sliderControllers';

import onError from '../../../../backend/middlewares/errors';
import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateSlider);
handler.use(isAuthenticatedUser, authorizeRoles('admin')).get(getSingleSlider);

export default handler;
