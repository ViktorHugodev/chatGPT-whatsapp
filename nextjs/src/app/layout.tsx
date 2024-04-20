import { getServerSession } from 'next-auth'

import './globals.css'
import { authConfig } from './api/auth/[...nextauth]/authConfig'
import { SessionProvider } from './components/provider/SessionProvider'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authConfig)
  return (
    <html lang='en'>
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
