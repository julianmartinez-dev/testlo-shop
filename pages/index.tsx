import {Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { useProducts } from '../hooks'



const Home: NextPage = () => {

  const { products, isLoading } = useProducts('/products')


  return (
    <ShopLayout
      title={'TesloShop - Home'}
      pageDescription={'Pagina principal de Teslo Shop'}
    >
      <Typography variant="h1" component={'h1'}>
        Tienda
      </Typography>
      <Typography variant="h2" component={'h2'} sx={{ mb: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <h1>Cargando...</h1> : <ProductList products={products} />}
    </ShopLayout>
  );
}

export default Home
