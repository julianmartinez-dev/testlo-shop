import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { CreditCardOutlined } from '@mui/icons-material';
import { Typography, Chip, Grid, Card, CardContent, Divider, Box } from '@mui/material';
import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';

interface Props {
    order : IOrder
}
const AdminOrderPage : NextPage<Props> = ({order}) => {
    const {
      isPaid,
      numberOfItems,
      tax,
      total,
      subtotal,
      _id,
      shippingAddress,
    } = order;
  return (
    <AdminLayout
      title="Resumen de la orden"
      subtitle={`Orden # ${_id}`}
      pageDescription="Resumen de la orden"
      icon={<CreditCardOutlined />}
    >

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

              <Chip
                sx={{ my: 2, display: 'flex', justifyContent: 'center' }}
                label={isPaid ? 'Orden Pagada' : 'Orden pendiente de pago'}
                variant="outlined"
                color={isPaid ? 'success' : 'error'}
                icon={<CreditCardOutlined />}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { id = '' } = ctx.query;
    
    const order = await dbOrders.getOrderByID(id.toString());

    if(!order){
        return{
            redirect:{
                destination: `/404`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default AdminOrderPage