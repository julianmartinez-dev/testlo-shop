import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data = 
| { message: string }
| IUser[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getUsers(req,res)
            break;
        case 'PUT':
            return updateUser(req,res)
    
        default:
            res.status(400).json({ message: 'Method not allowed' })
            break;
    }
    
    
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) =>{
    await db.connect();
    const users = await User.find().select('-password');
    await db.disconnect();

    return res.status(200).json( users )
}
const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   const { userID = '', role = '' } = req.body;

   if(!isValidObjectId(userID)){
      return res.status(400).json({ message: 'UserID inválido' })
   }

   const validRoles = ['admin', 'user','super-user','CEO'];
   if(!validRoles.includes(role)){
       return res.status(400).json({ message: 'Rol inválido' })
   }

   await db.connect();
   const user = await User.findById(userID);

   

   if(!user){
        await db.disconnect()
        return res.status(400).json({ message: 'Usuario no encontrado' })
   }

   user.role = role
   await user.save();
  
   await db.disconnect();

    return res.status(200).json({ message: 'Usuario actualizado' })
}

