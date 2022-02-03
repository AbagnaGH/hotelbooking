import nc from 'next-connect';
// import bodyParser from 'body-parser';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/middlewares/errors';
import {
  createNewRoom,
  getAllAdminRooms,
} from '../../../../backend/controllers/roomControllers';
import {
  isAuthenticatedUser,
  authorizeRoles,
} from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles('admin')).get(getAllAdminRooms);
handler.use(isAuthenticatedUser, authorizeRoles('admin')).post(createNewRoom);

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default handler;
