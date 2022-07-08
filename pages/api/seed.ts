import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDB } from '../../database'
import { Product, User } from '../../models'

type Data = {
    message: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if(process.env.NODE_ENV === 'production'){
        return res.status(401).json({
            message: 'No se puede ejecutar esta acción en producción'
        })
    }

    await db.connect()
    await User.deleteMany();
    await User.insertMany(seedDB.initialData.users)
    await Product.deleteMany();
    await Product.insertMany(seedDB.initialData.products);
    await db.disconnect();

    res.status(200).json({
        message: 'Base de datos inicializada'
    })
}