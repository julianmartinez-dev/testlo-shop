import { useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts';
import { isValidToken, countries } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = () : FormData => {

  return {
    firstName : Cookies.get('firstName') || '',
    lastName  : Cookies.get('lastName') || '',
    address   : Cookies.get('address') || '',
    address2  : Cookies.get('address2') || '',
    zip       : Cookies.get('zip') || '',
    city      : Cookies.get('city') || '',
    country   : Cookies.get('country') || '',
    phone     : Cookies.get('phone') || '',
  }
}

const AddressPage = () => {
  const router = useRouter();
  const { updateShippingaddress } = useContext(CartContext);
  const {register,handleSubmit,formState: { errors },reset} = useForm<FormData>({defaultValues:{
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: 'Argentina',
    phone: '',
  }});
  
  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset])

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    updateShippingaddress(data);
    router.push('/checkout/summary')
  };

  return (
    <ShopLayout
      title="Dirección"
      pageDescription="Confimar dirección del destino"
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register('firstName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register('lastName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register('address', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (opcional)"
              variant="filled"
              fullWidth
              {...register('address2')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Codigo Postal"
              variant="filled"
              fullWidth
              {...register('zip', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register('city', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                variant="filled"
                label="Pais"
                {...register('country', {
                  required: 'Este campo es requerido',
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register('phone', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
          <Button
            className="circular-btn"
            color="secondary"
            size="large"
            type="submit"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;
  let userID = '';
  let validToken = false;

  try {
    await isValidToken(token);
    validToken = true;
  } catch (error) {
    validToken = false;
  }

  if (!validToken) {
    return {
      redirect: {
        destination: '/auth/login?page=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AddressPage;
