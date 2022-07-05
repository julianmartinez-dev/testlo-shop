import { IOrderItem, IShippingAddress, IUser } from './';


export interface IOrder {
    _id?            : string;
    user?           : IUser | string;
    orderItems      : IOrderItem[];
    shippingAddress : IShippingAddress;
    paymentResult?  : string;
    numberOfItems   : number;
    subtotal        : number;
    tax             : number;
    total           : number;
    isPaid          : boolean;
    paidAt?         : string;
}


