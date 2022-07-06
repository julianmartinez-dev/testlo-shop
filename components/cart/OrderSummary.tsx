import { FC, useContext } from "react";
import { Grid, Typography } from "@mui/material"
import { CartContext } from "../../context";
import { formatMoney } from "../../utils";

interface Props{
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    taxes: number;
    total: number;
  }
}

export const OrderSummary:FC<Props> = ({orderValues}) => {

  //Si hay props, usarlas, sino usar el context
  const { numberOfItems,subTotal,taxes,total } = orderValues ? orderValues : useContext(CartContext);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Cant. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{numberOfItems} {numberOfItems > 1 ? 'items' : 'item'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatMoney(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos (21%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatMoney(taxes)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1">{formatMoney(total)}</Typography>
      </Grid>
    </Grid>
  );
}
