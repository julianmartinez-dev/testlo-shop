import { Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NextLink from "next/link";
import { FC } from "react";
import { initialData } from "../../database/products"
import { ItemCounter } from "../ui";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  editable?: boolean;
}

export const CartList:FC<Props> = ({editable=false}) => {
  return (
    <>
      {productsInCart.map((product) => (
        <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug}>
          <Grid item xs={3}>
            <NextLink href={'/product/slug'} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.images[0]}`}
                    component="img"
                    sx={{ borderRadius: '5px' }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography variant={'body1'}>{product.title}</Typography>
              <Typography variant={'body1'}>Talla: <strong>M</strong></Typography>

              {
                editable
                ? <ItemCounter />
                : <Typography variant={'body1'}>Cantidad: <strong>1</strong></Typography>
              }

            </Box>
          </Grid>
          <Grid item xs={2} display='flex' alignItems={'center'} justifyContent='center' flexDirection='column'>
            <Typography variant={'subtitle1'}>${product.price}</Typography>
            {
              editable && <Button variant='text' color='secondary'>Eliminar</Button>
            }
            
          </Grid>
        </Grid>
      ))}
    </>
  );
}
