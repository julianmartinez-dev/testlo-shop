import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = { message: string } | IProduct;


export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
     switch (req.method) {
       case 'GET':
         return getProduct(req, res);
       default:
         return res.status(400).json({
           message: 'Method not allowed',
         });
     }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { slug } = req.query;
 
    await db.connect();
    const product = await Product.findOne({ slug }).lean()
    await db.disconnect();

    if(!product){
        return res.status(404).json({
            message: 'Product not found'
        })
    }

 
    product.images = product.images.map((image) => {
      return image.includes('cloudi')
        ? image
        : `${process.env.HOST_NAME}/products/${image}`;
    });1



    return res.status(200).json(product);
}
