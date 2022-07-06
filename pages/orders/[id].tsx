import { useState } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
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
  CircularProgress,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import {  CreditCardOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';

export type OrderResponseBody = {
    id: string;
    status: "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "PAYER_ACTION_REQUIRED";
}

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({order}) => {
  const { isPaid,numberOfItems,tax,total,subtotal,_id,orderItems,shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false);

  const router = useRouter();

  const onOrderCompleted = async (details : OrderResponseBody) =>{
    if(details.status !== 'COMPLETED'){
      return alert('No hay pago en paypal')
    }

    setIsPaying(true);
    try {
      const { data } = await tesloApi.post(`/orders/pay`,{
        transactionID : details.id,
        orderID : _id,
      })
      //Si todo sale bien1
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert('Error')
    }
  }

  return (
    <ShopLayout
      title="Resumen de la orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden {_id}
      </Typography>

      {/* <Chip sx={{my:2}} label='Pendiente de pago' variant='outlined' color='error' icon={<CreditCardOffOutlined/>}/> */}
      <Chip
        sx={{ my: 2 }}
        label={isPaid ? 'Orden Pagada' : 'Orden pendiente de pago'}
        variant="outlined"
        color={isPaid ? 'success' : 'error'}
        icon={<CreditCardOutlined />}
      />

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Resumen ({numberOfItems}{' '}
                {numberOfItems > 1 ? 'productos' : 'producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent={'space-between'}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>{shippingAddress.address}</Typography>
              <Typography>
                {shippingAddress.city} {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems,
                  subTotal: subtotal,
                  taxes: tax,
                  total,
                }}
              />

              <Box sx={{ mt: 1 }} display="flex" flexDirection="column">
                {
                  isPaying && (
                    <Box display="flex" justifyContent="center" className="fadeIn">
                      <CircularProgress />
                    </Box>
                  )
                }
                <Box sx={{display: isPaying ? 'none' : 'flex', flex: 1}} flexDirection="column">
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label={'Orden Pagada'}
                      variant="outlined"
                      color={'success'}
                      icon={<CreditCardOutlined />}
                    />
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: total.toString()
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then((details) => {
                            //Si el pago se realiza correctamente
                            onOrderCompleted(details);
                          });
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  
  const { id = '' } = query;
  const session:any = await getSession({req})

  //Si no hay una sesion, redirigir a login
  if(!session){
    return {
      redirect:{
        destination: `/auth/login?page=/orders/${id}`,
        permanent: false,
      }
    }
  }

  //Comprobar si existe una orden con ese id
  const order = await dbOrders.getOrderByID(id.toString());

  //Si no hay order redirigir al historial de ordenes
  if(!order){
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  //Si esta logueado pero no tiene permisos de ver esta orden, redirigir al historial de ordenes
  if(order.user !== session.user._id){
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }


  return {
    props: {
      order
    }
  }
}

export default OrderPage;
