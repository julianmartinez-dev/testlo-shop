import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { FC } from "react"

interface Props{
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ItemCounter:FC<Props> = ({quantity,onIncrement,onDecrement}) => {
  return (
    <Box display='flex' alignItems='center'>
        <IconButton onClick={onDecrement}>
            <RemoveCircleOutline/>
        </IconButton>
        <Typography sx={{width: 40, textAlign: 'center'}}>{quantity}</Typography>
        <IconButton onClick={onIncrement}>
            <AddCircleOutline/>
        </IconButton>
    </Box>
  )
}
