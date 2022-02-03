import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/middlewares/errors';

import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';
import {
  createNewSlider,
  getAllAdminSliders,
} from '../../../../backend/controllers/sliderControllers';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles('admin')).post(createNewSlider);
handler
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .get(getAllAdminSliders);

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default handler;
