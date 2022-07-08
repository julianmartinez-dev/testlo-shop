import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { IProduct, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
  { 
      field: 'img',
       headerName: 'Foto',
       renderCell: ({row}: GridValueGetterParams) => { return (
         <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
           <CardMedia component={'img'} image={row.img} alt={row.title}/>
         </a>
       );}
 },
  { 
    field: 'title',
    headerName: 'Titulo',
    width: 350,
    renderCell: ({row}: GridValueGetterParams) => { return (
      <NextLink href={`/admin/products/${row.slug}`} passHref>
        <Link underline='always'>
          {row.title}
        </Link>
      </NextLink>
    )}
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const rows = data!.map(producto => ({
    id: producto._id,
    img: producto.images[0],
    title: producto.title,
    gender: producto.gender,
    type: producto.type,
    inStock: producto.inStock,
    price: producto.price,
    sizes: producto.sizes.join(', '),
    slug: producto.slug,
  }));

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subtitle="Mantenimiento de Productos"
      pageDescription="Mantenimiento de Productos"
      icon={<CategoryOutlined />}
    >
      <Box display={'flex'} justifyContent='end' sx={{mb: 2}}>
        <Button
          startIcon={ <AddOutlined />}
          color="secondary"
          href='/admin/products/new'
        >
          Crear Producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid
          item
          xs={12}
          sx={{ height: 650, width: '100%' }}
          overflow={{ xs: 'scroll', md: 'auto' }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
export default ProductsPage;
