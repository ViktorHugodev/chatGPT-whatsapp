'use client'
import { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'
type SessionProviderProps = PropsWithChildren<{
  session: Session
}>

export function SessionProvider(props: SessionProviderProps) {
  return <NextAuthSessionProvider>{props.children}</NextAuthSessionProvider>
}
