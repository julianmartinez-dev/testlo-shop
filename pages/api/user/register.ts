import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { signToken, validateEmail } from '../../../utils';

type Data =
  | { message: string }
  | { token: string; user: { email: string; role: string; name: string } };

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);

    default:
      res.status(400).json({
        message: 'Bad Request',
      });
  }
}

const registerUser = async (req: NextApiRequest,res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body;


  //Validations
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
    });
  }
  if (name.length < 2) {
    return res.status(400).json({
      message: 'Name must be at least 2 characters long',
    });
  }

  if (validateEmail(email) === false) {
    return res.status(400).json({
      message: 'Email is not valid',
    });
  }

  //Check if user already exists
  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    await db.disconnect();
    return res.status(400).json({
      message: 'Email already in use',
    });
  }

  //Create new user
  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong, check server logs',
    });
  }

  const { _id, role } = newUser;

  const token = signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
