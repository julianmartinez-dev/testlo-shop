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
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const SummaryPage = () => {
  return (
    <ShopLayout
      title="Resumen de la orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
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
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar Orden
                </Button>
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
import { GetServerSideProps } from 'next'
import { isValidToken } from '../../utils';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = ''} = req.cookies;
  let userID = '';
  let validToken = false;

  try {
    await isValidToken(token);
    validToken = true;
  } catch (error) {
    validToken = false;
  }

  if(!validToken) {
    return {
      redirect: {
        destination: '/auth/login?page=/checkout/summary',
        permanent: false,
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default SummaryPage;
