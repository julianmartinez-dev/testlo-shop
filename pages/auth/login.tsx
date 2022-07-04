import { useState, useContext } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'
import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { SubmitHandler, useForm,  } from 'react-hook-form';
import { isEmail } from '../../utils/validations';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  
  const router = useRouter()
  const { loginUser } = useContext(AuthContext);
  const { register,handleSubmit,formState: { errors }} = useForm<FormData>();
  const [showError, setShowError] = useState(false)

  const destination = router.query.page?.toString() || '/';

  const onSubmit: SubmitHandler<FormData> = async ({email, password}) => {

    setShowError(false)
    
    await signIn('credentials', { email, password })

    // const isValidLogin = await loginUser(email, password);

    // if(!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }    
    // router.replace(destination)
  
  }

   
  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: (value) => isEmail(value),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                type="submit"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={router.query.page ? `/auth/register?page=${destination}` : '/auth/register'} passHref>
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
   
  const session = await getSession({req});
  const { page = '/' } = query
  if(session) {
    return{
      redirect: {
        destination: page.toString(),
        permanent: false,
      }
    }
  }


  return {
    props: {
      
    }
  }
}

export default LoginPage