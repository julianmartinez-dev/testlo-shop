import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['client', 'admin','super-user','CEO'],
        message: '{VALUE} is not a valid role',
        default: 'client',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);



const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;
