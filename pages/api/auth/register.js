import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import onError from '../../../backend/middlewares/errors';

import { registerUser } from '../../../backend/controllers/authControllers';

const handler = nc({ onError });
dbConnect();
handler.post(registerUser);
export default handler;
