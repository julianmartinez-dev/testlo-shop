import { Chip, Grid, Typography,Link } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { DataGrid, GridColDef,GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    { field: 'paid', headerName: 'Pagada', description:'Muestra si la orden fue pagada o no', width: 200, renderCell: (params: GridValueGetterParams) =>{
        return (
            params.row.paid
             ? <Chip color='success' label='Pagada' variant='outlined'/>
             : <Chip color='error' label='Pendiente' variant='outlined'/>
        )
    } },
    {field: 'showorder', sortable: false, headerName: 'Ver Orden', width: 200, renderCell: (params: GridValueGetterParams) =>{
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">Ver Orden</Link>
        </NextLink>
      )
    }}
];

const rows = [
    { id: 1, paid:false,fullname: 'John Doe' },
    { id: 2, paid:false,fullname: 'Jane Doe' },
    { id: 3, paid:false,fullname: 'John Doe' },
    { id: 4, paid:false,fullname: 'Jane Doe' },
    { id: 5, paid:false,fullname: 'John Doe' },
    { id: 6, paid:false,fullname: 'Jane Doe' },
    { id: 7, paid:true,fullname: 'John Doe' },
    { id: 8, paid:true,fullname: 'Jane Doe' },
    { id: 9, paid:true,fullname: 'John Doe' },
    { id: 10,paid:true, fullname: 'Jane Doe' },
    { id: 11,paid:true, fullname: 'John Doe' },
    { id: 12,paid:true, fullname: 'Jane Doe' },
    { id: 13,paid:true, fullname: 'John Doe' },
]

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component={'h1'}>
        Historial de ordenes
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
}

export default HistoryPage