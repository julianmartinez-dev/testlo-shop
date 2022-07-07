import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from "../../components/layouts";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";
import { useState, useEffect } from 'react';

const UserPage = () => {

  const { data, error} = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(()=>{
    if(data){
      setUsers(data)
    }
  },[data])

  if(!data && !error) {
    return <div>Loading...</div>
  }

  if(error) {
    return <div>Error: {error.message}</div>
  }

  const onRoleUpdated = async (userID: string, newRole: string) => {
    const previusUsers = users.map(user => ({...user}));
    const updateUsers = users.map(user => ({
      ...user,
      role: user._id === userID ? newRole : user.role
    }))
    setUsers(updateUsers);

    try {
      await tesloApi.put('/admin/users',{userID, role: newRole})
    } catch (error) {
      setUsers(previusUsers);
      alert('No se pudo actualizar el rol del usuario.')
      console.log(error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'role', headerName: 'Rol', width: 300, renderCell: ({row}: GridValueGetterParams) =>{

      return (
        <Select
          value={row.role}
          label="Rol"
          onChange={(event) => onRoleUpdated(row.id,event.target.value) }
          sx={{ width: '300px' }}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="super-user">Super-User</MenuItem>
          <MenuItem value="CEO">CEO</MenuItem>
        </Select>
      );
    } },
  ];

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }))
  return (
    <AdminLayout
      title={'Usuarios'}
      pageDescription={'Mantenimiento de usuarios'}
      subtitle={'Mantenimiento de usuarios'}
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }} overflow={{xs: 'scroll', md: 'auto'}}>
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
}

export default UserPage;