import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Chip, Grid, Typography, Box } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { IProduct, ICartProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';
import {
  NextPage,
  GetStaticProps,
  GetStaticPaths,
} from 'next';
import { CartContext } from '../../context';
interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const router = useRouter()
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct({...tempCartProduct, size: size})
  }

  const onIncrement = () =>{
    if(tempCartProduct.quantity < product.inStock){
      setTempCartProduct({...tempCartProduct, quantity: tempCartProduct.quantity + 1})
    }else{
      return;
    }
  }

  const onDecrement = () =>{
    if(tempCartProduct.quantity > 1){
      setTempCartProduct({...tempCartProduct, quantity: tempCartProduct.quantity - 1})
    }else{
      return;
    }
  }

  const onAddToCart = () =>{

    if(tempCartProduct.size === undefined){
      return;
    }
    addProductToCart(tempCartProduct);
    router.push('/cart')
    
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display={'flex'} flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                quantity={tempCartProduct.quantity}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={(size: ISize) => onSelectedSize(size)}
              />
            </Box>

            {product.inStock ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddToCart}
              >
                {tempCartProduct.size
                  ? 'Agregar al carrito'
                  : 'Selecciona una talla'}
              </Button>
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductsSlug();

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};

export default ProductPage;
