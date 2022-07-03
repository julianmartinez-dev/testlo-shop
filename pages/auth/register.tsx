import React, { useState, useContext } from 'react'
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts'
import { isEmail } from '../../utils/validations';
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';

type FormData = {
  name: string,
  email: string,
  password: string,
}

const RegisterPage = () => {

  const router = useRouter()
  const { registerUser } = useContext(AuthContext)
  const { register,handleSubmit,formState: { errors }} = useForm<FormData>();
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const destination = router.query.page?.toString() || '/';

  

  const onSubmit: SubmitHandler<FormData> = async ({email, password, name}) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password)

    if(hasError){
      setShowError(true);
      setErrorMessage(message!)
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    router.replace(destination)
  }

  
  return (
    <AuthLayout title="Registrarse">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear Cuenta
              </Typography>
              <Chip
                label={errorMessage}
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
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
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.page
                    ? `/auth/register?page=${destination}`
                    : '/auth/register'
                }
                passHref
              >
                <Link underline="always">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage