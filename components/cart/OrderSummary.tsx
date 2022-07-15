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

  const { numberOfItems, subTotal, total, taxes } = useContext( CartContext );
    
    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, taxes };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Cant. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {summaryValues.numberOfItems}{' '}
          {summaryValues.numberOfItems > 1 ? 'items' : 'item'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatMoney(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos (21%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatMoney(summaryValues.taxes)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1">
          {formatMoney(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
}
