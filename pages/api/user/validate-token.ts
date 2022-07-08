import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { isValidToken, signToken } from '../../../utils';

type Data =
  | { message: string }
  | { token: string; user: { email: string; role: string; name: string } };

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return checkJTW(req, res);

    default:
      res.status(400).json({
        message: 'Bad Request',
      });
  }
}

const checkJTW = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;

  let userID = '';

  try {
      userID = await isValidToken(token);
  } catch (error) {
      return res.status(401).json({
          message: 'Invalid Token',
      })
  }

  await db.connect();
  const user = await User.findById(userID).lean();
  await db.disconnect();

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
    });
  }

  const { email, _id, role, name } = user; 

  return res.status(200).json({
    token: signToken(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
};
