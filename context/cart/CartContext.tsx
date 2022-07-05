import { createContext } from 'react';
import { ICartProduct, IShippingAddress } from '../../interfaces';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  taxes: number;
  total: number;

  shippingAddress?: IShippingAddress;

  //Methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateShippingaddress: (shippingAddress: IShippingAddress) => void;
}1
export const CartContext = createContext({} as ContextProps);