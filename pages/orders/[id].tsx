import NextLink from 'next/link';
Link;
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
import { CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de la orden #123123"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden #asd12313
      </Typography>

      {/* <Chip sx={{my:2}} label='Pendiente de pago' variant='outlined' color='error' icon={<CreditCardOffOutlined/>}/> */}
      <Chip
        sx={{ my: 2 }}
        label="Orden ya fue pagada"
        variant="outlined"
        color="success"
        icon={<CreditCardOutlined />}
      />

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Resumen (3 productos)
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

              <Typography>Julian Martinez</Typography>
              <Typography>Liniers 736</Typography>
              <Typography>San Francisco, 2400</Typography>
              <Typography>Argentina</Typography>
              <Typography>356433398</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent={'end'}>
                <NextLink href="/checkout/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
              </Box>

              <Chip
                sx={{ my: 2 }}
                label="Orden ya fue pagada"
                variant="outlined"
                color="success"
                icon={<CreditCardOutlined />}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
