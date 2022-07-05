import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { isValidToken } from '../../utils';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Box,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import Cookies from 'js-cookie';

const SummaryPage = () => {
  const router = useRouter()
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      if (!Cookies.get('firstName')) {
        router.push('/checkout/address');
      }
    }, [router]);

  if(!shippingAddress){
    return (<></>)
  }

  const { firstName, lastName, address, address2 = '', city, zip, country, phone } = shippingAddress;

  const onCreateOrder = async () =>{
    setIsPosting(true);

    const { hasError, message } = await createOrder();

    if(hasError){
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`)
  }

  return (
    <ShopLayout
      title="Resumen de la orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container mt={2}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                {`Resumen (${numberOfItems}) ${
                  numberOfItems > 1 ? 'productos' : 'producto'
                }`}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent={'space-between'}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>
                {city} {zip}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent={'end'}>
                <NextLink href="/checkout/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection={'column'}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{marginTop: '10px' ,display: errorMessage ? 'flex' : 'none'}}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};


export default SummaryPage;
