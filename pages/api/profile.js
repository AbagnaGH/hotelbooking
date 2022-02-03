import nc from 'next-connect';
import dbConnect from '../../backend/config/dbConnect';
import onError from '../../backend/middlewares/errors';
import { currentUserProfile } from '../../backend/controllers/authControllers';
import { isAuthenticatedUser } from '../../backend/middlewares/auth';

const handler = nc({ onError });
dbConnect();
handler.use(isAuthenticatedUser).get(currentUserProfile);
// handler.get(getAllRooms);
// handler.get(getSingleRoom);
export default handler;
