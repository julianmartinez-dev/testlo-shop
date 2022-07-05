import { FC, useEffect, useReducer } from 'react';
import { ICartProduct, IShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  taxes: number;
  total: number;
  shippingAddress?: IShippingAddress;
}



const CART_INITIAL_VALUE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  taxes: 0,
  total: 0,
  shippingAddress : undefined,
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_VALUE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if(Cookie.get('firstName')){
      const cookieAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
        zip: Cookie.get('zip') || '',
      }
  
      dispatch({
        type: '[Cart] - Load ShippingAddress from cookies',
        payload: cookieAddress,
      }) 
    }
  },[])

  useEffect(() => {
    if(state.isLoaded){
      Cookie.set('cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((acc, curr) => acc + curr.quantity,0);
    const subTotal = state.cart.reduce((acc, curr) => acc + curr.quantity * curr.price,0);
    const taxes = subTotal * 0.21;
    const total = subTotal + taxes;

    const orderSummary = {
      numberOfItems,
      subTotal,
      taxes,
      total
    };

    dispatch({
      type: '[Cart] - Update Order Summary',
      payload: orderSummary,
    })

  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart) {
      return dispatch({
        type: '[Cart] - Update Cart',
        payload: [...state.cart, product],
      });
    }

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: '[Cart] - Update Cart',
        payload: [...state.cart, product],
      });
    }

    //Acumular
    const updateProducts = state.cart.map((item) => {
      if (item._id !== product._id) return item;
      if (item.size !== product.size) return item;

      item.quantity += product.quantity;
      return item;
    });

    return dispatch({
      type: '[Cart] - Update Cart',
      payload: updateProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Change Product Quantity',
      payload: product,
    });
  };
  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove Product',
      payload: product,
    });
  };

  const updateShippingaddress = (shippingAddress: IShippingAddress) => {
    Cookie.set('firstName', shippingAddress.firstName);
    Cookie.set('lastName', shippingAddress.lastName);
    Cookie.set('address', shippingAddress.address);
    Cookie.set('address2', shippingAddress.address2 || '');
    Cookie.set('zip', shippingAddress.zip);
    Cookie.set('city', shippingAddress.city);
    Cookie.set('country', shippingAddress.country);
    Cookie.set('phone', shippingAddress.phone);
    
    dispatch({
      type: '[Cart] - Update ShippingAddress',
      payload: shippingAddress,
    });
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateShippingaddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
