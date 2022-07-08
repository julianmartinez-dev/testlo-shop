import { idID } from '@mui/material/locale';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return payOrder(req,res)
            break;
    
        default:
            return res.status(400).json({ message: 'Method not allowed' })
            break;
    }
}

const getPaypalBearerToken = async (): Promise<string|null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET
    const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL || '';

    const base64token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials');
    
    try {
        const { data } = await axios.post(PAYPAL_OAUTH_URL, body,{
            headers:{
                'Authorization': `Basic ${base64token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        return data.access_token;

    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response?.data)
        }else{
            console.log(error)
        }
        return null;
            
        }
    }


const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
    const paypalBearerToken = await getPaypalBearerToken()

    if(!paypalBearerToken){
        return res.status(500).json({ message: 'Error al obtener Paypal Token' })
    }

    const { transactionID = '', orderID = '' } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionID}`,{
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })
    //Verificar si el pago fue aceptado
    if(data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'El pago no se ha completado' })
    }

    await db.connect();
    const dbOrder = await Order.findById(orderID);

    //Verificar si el pedido existe en la base de datos
    if(!dbOrder){
        await db.disconnect();
        return res.status(404).json({ message: 'El pedido no existe' })
    }

    //Verificar que coinicida el monto pagado con el monto de la orden en bd
    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)){
        await db.disconnect();
        return res.status(401).json({ message: 'El monto pagado no coincide con el monto de la orden' })
    }

    //Si todo sale bien, marcamos la orden como pagada y le agregamos el transactionID
    dbOrder.transactionId = transactionID;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();
  return res.status(200).json({ message: 'Orden Pagada'});
};