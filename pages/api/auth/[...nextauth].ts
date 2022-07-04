import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@correo.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'contraseña' },
      },
      async authorize(credentials, req) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
  ],

  //Callbacks
  callbacks: {
    async jwt({token, account, user}){
      if(account){
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'credentials':
            token.user = user
            break;
          case 'oauth':
            //TODO: crear usuario o verificar si existe en la BD
          default:
            break;
        }
      }
      return token;
    },
    async session({session, token, user}){
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  }
});
