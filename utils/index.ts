import jwt from 'jsonwebtoken'

export const formatMoney = (amount: number) : string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export const signToken = (_id:string, email:string) : string => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('JWT_SECRET_SEED is not defined');
    }

    return jwt.sign(
        //Payload
        {_id, email},
        //Secret
        process.env.JWT_SECRET_SEED,
        //Options
        {
            expiresIn: '30d',
        }
    )
}

export const isValidToken = (token:string) : Promise<string> => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('JWT_SECRET_SEED is not defined');
    }

    return new Promise( (resolve, reject) =>{
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (error, payload) =>{
                if(error){
                    reject(error);
                }
                const { _id } = payload as {_id: string}
                resolve(_id);
            });
        } catch (error) {
            reject(error);
        }
    })
}

export const validateEmail = (email: string) : boolean =>{
     const emailRegex =
       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegex.test(email.toLowerCase());
}

export const countries = [
  {
    name: 'Costa Rica',
    code: 'CRI',
  },
  {
    name: 'Argentina',
    code: 'ARG',
  },
  {
    name: 'Venezuela',
    code: 'VEN',
  },
  {
    name: 'Guatemala',
    code: 'GTM',
  },
  {
    name: 'Mexico',
    code: 'MEX',
  },
  {
    name: 'Belice',
    code: 'BLZ',
  },
  {
    name: 'Puerto Rico',
    code: 'PRI',
  },
  {
    name: 'Ecuador',
    code: 'ECU',
  },
  {
    name: 'Panamá',
    code: 'PAN',
  },
  {
    name: 'Honduras',
    code: 'HND',
  },
  {
    name: 'Bolivia',
    code: 'BOL',
  },
  {
    name: 'El Salvador',
    code: 'SLV',
  },
  {
    name: 'Peru',
    code: 'PER',
  },
  {
    name: 'Uruguay',
    code: 'URY',
  },
  {
    name: 'Colombia',
    code: 'COL',
  },
  {
    name: 'Republica Dominicana',
    code: 'DOM',
  },
  {
    name: 'España',
    code: 'ESP',
  },
  {
    name: 'Paraguay',
    code: 'PRY',
  },
  {
    name: 'Chile',
    code: 'CHL',
  },
  {
    name: 'Cuba',
    code: 'CUB',
  },
  {
    name: 'Nicaragua',
    code: 'NIC',
  },
];