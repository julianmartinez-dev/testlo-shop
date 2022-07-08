import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layouts';
import { IOrder, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 200 },
  { field: 'total', headerName: 'Monto total', width: 100 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: 'cantProduct',
    headerName: 'n° Productos',
    align: 'center',
    width: 100,
  },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Creada En',
    align: 'center',
    width: 300,
  },
];

const OrderPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if(!data && !error){
        return (<div>Cargando...</div>)
    }
    
    if(error){
        return (<div>Error: {error.message}</div>)
    }

    const rows = data!.map((order) => ({
      id: order._id,
      email: (order.user as IUser).email,
      name: (order.user as IUser).name,
      total: order.total,
      isPaid: order.isPaid,
      cantProduct: order.numberOfItems,
      createdAt :  order.createdAt,
    }));

  return (
    <AdminLayout
      title="Ordenes"
      subtitle="Mantenimiento de ordenes"
      pageDescription="Mantenimiento de ordenes"
      icon={<ConfirmationNumberOutlined />}
    >
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
  );}
export default OrderPage