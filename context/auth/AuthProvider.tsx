import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { FC, useReducer, useEffect } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();


  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  },[status, data])

  // useEffect(() => {
  //   checkToken();
  // },[])

  // const checkToken = async () => {
  //   const token = Cookies.get('token');
  //   if(token){
  //     try {
  //       const { data } = await tesloApi.get('/user/validate-token');
  //       Cookies.set('token', data.token);
  //       dispatch({ type: '[Auth] - Login', payload: data.user });
  //     } catch (error) {
  //       Cookies.remove('token');
  //     }
  // }
  // }

  const loginUser = async (email: string, password: string) : Promise<boolean> =>{
      try {
        const { data } = await tesloApi.post('/user/login', { email, password });
        const { token, user } = data;
        Cookies.set('token', token); // set token in cookie
        dispatch({ type: '[Auth] - Login', payload: user})
        return true;
      } catch (error) {
        return false;
      }
  }

  const registerUser = async (name: string, email: string, password: string): Promise<{hasError: boolean; message?:string}> =>{
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        const { message } = error.response?.data as { message: string };

        return {
          hasError: true,
          message
        }
      }

      return {
        hasError: true,
        message: 'Ocurrió un error al registrarse'
      }
    }
  }

  const logoutUser = async () => {
    
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('country');
    Cookies.remove('city');
    Cookies.remove('zip');
    Cookies.remove('phone');

    signOut();

  }



  return (
    <AuthContext.Provider
      value={{
        ...state,

        //Methods
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};