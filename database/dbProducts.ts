import { IProduct } from "../interfaces";
import { Product } from "../models";
import { db } from "./"
import { disconnect } from './db';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect()

    if(!product){
        return null
    }

    product.images = product.images.map( image => {
      return image.includes('cloudi') ? image : `${process.env.HOST_NAME}/products/${image}`
    })

    console.log(product.images)

    return JSON.parse(JSON.stringify(product))
}

interface ProductSlug{
    slug: string
}

export const getAllProductsSlug = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select('slug -_id').lean();
  await db.disconnect();

  return slugs;
};

export const getProductsByQuery = async (query: string): Promise<IProduct[]> => {
    await db.connect();
    query = query.toLowerCase()
    const products = await Product.find({ $text: { $search: query } }).select('title images price inStock slug -_id').lean();
    await db.disconnect()

    const updatedProducts = products.map( product => {
      product.images = product.images.map((image) => {
        return image.includes('cloudi')
          ? image
          : `${process.env.HOST_NAME}/products/${image}`;
      });

      return product;
    })

   


    return updatedProducts;
}

export const getAllProducts= async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find()
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();

   const updatedProducts = products.map((product) => {
     product.images = product.images.map((image) => {
       return image.includes('cloudi')
         ? image
         : `${process.env.HOST_NAME}/products/${image}`;
     });

     return product;
   });

  return updatedProducts;
};
