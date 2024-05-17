import KeycloakProvider from 'next-auth/providers/keycloak'

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID as string,
      clientSecret: process.env.KEYCLOAK_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER as string,
      // issuer: 'http://localhost:9000/realms/master',
    }),
  ],
}
