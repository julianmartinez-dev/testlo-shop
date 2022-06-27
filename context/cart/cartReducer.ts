import { ICartProduct } from '../../interfaces';
import { CartState } from './';


type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] } 
   | { type: '[Cart] - Update Cart', payload: ICartProduct[] } 


export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

   switch (action.type) {
     case '[Cart] - LoadCart from cookies | storage':
       return {
         ...state,
          cart: [...action.payload]
       };
     case '[Cart] - Update Cart':
       return {
         ...state,
        cart: [...action.payload]
       };

     default:
       return state;
   }

}