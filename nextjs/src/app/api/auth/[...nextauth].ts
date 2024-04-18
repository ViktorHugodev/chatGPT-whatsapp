import NextAuth from 'next-auth/next'
import KeycloakProvider from 'next-auth/providers/keycloak'

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID as string,
      clientSecret: process.env.KEYCLOAK_SECRET as string,
      // issuer: process.env.KEYCLOAK_ISSUER,
      issuer: 'http://localhost:9000/auth/realms/master',
    }),
  ],
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
