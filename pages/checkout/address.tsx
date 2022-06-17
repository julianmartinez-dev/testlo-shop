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

const AddressPage = () => {
  return (
    <ShopLayout
      title="Dirección"
      pageDescription="Confimar dirección del destino"
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nombre" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Apellido" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Dirección" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Dirección 2 (opcional)"
            variant="filled"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Codigo Postal" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Ciudad" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select variant="filled" label="Pais" value={1}>
              <MenuItem value={1}>Argentina</MenuItem>
              <MenuItem value={2}>Brasil</MenuItem>
              <MenuItem value={3}>Chile</MenuItem>
              <MenuItem value={4}>Uruguay</MenuItem>
              <MenuItem value={5}>Paraguay</MenuItem>
              <MenuItem value={6}>Peru</MenuItem>
              <MenuItem value={7}>Bolivia</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Teléfono" variant="filled" fullWidth />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Button className="circular-btn" color="secondary" size="large">
          Revisar Pedido
        </Button>
      </Box>
    </ShopLayout>
  );
};

export default AddressPage;
