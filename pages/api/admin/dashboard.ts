import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number,
    paidOrders: number; //isPaid: true
    notPaidOrders: number;
    numberOfClientes: number; //role: client
    numberOfProducts: number;
    productsWithNoInventory: number; //0
    lowInventory: number; // <10

}

export default async function  (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    try {
        await db.connect()
        const [
          numberOfOrders,
          paidOrders,
          numberOfClientes,
          numberOfProducts,
          productsWithNoInventory,
          lowInventory,
        ] = await Promise.all([
          Order.countDocuments(),
          Order.countDocuments({ isPaid: true }),
          User.countDocuments({ role: 'client' }),
          Product.countDocuments(),
          Product.countDocuments({ inStock: 0 }),
          Product.countDocuments({ inStock: { $lt: 10 } }),
        ]);

        
        await db.disconnect()
       
        return res.status(200).json({
            numberOfOrders,
            paidOrders,
            notPaidOrders: numberOfOrders - paidOrders,
            numberOfClientes,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory
        })
    }
     catch (error) {
        await db.disconnect()
        console.log(error);
    }
}

