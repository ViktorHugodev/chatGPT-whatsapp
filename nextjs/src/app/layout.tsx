import { getServerSession } from 'next-auth'

import './globals.css'
import { authConfig } from './api/auth/[...nextauth]/authConfig'
import { SessionProvider } from './components/provider/SessionProvider'

export const metadata = {
  title: 'AssistantGPT',
  description: 'Assistente com suporte ao GPT-4',
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
