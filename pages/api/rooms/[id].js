import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';

import { getSingleRoom } from '../../../backend/controllers/roomControllers';

import onError from '../../../backend/middlewares/errors';

const handler = nc({ onError });

dbConnect();

handler.get(getSingleRoom);

export default handler;
