import { withAuth } from '@/app/api/withAuth'
import { prisma } from '@/app/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface GetMessagesProps {
  params: {
    chatId: string
  }
}
export const GET = withAuth(async (_request: NextRequest, token, { params }) => {
  console.log('params GET:', params)
  const chat = await prisma.chat.findUniqueOrThrow({
    where: {
      id: params.chatId,
    },
  })
  if (chat.user_id !== token.sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const messages = await prisma.message.findMany({
    where: {
      chat_id: params.chatId,
    },
    orderBy: {
      created_at: 'asc',
    },
  })

  return NextResponse.json(messages)
})
export const POST = withAuth(async (request: NextRequest, token, { params }: GetMessagesProps) => {
  const body = await request.json()
  const chat = await prisma.chat.findUniqueOrThrow({
    where: {
      id: params.chatId,
    },
  })

  if (chat.user_id !== token.sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const message = await prisma.message.create({
    data: {
      content: body.message,
      chat_id: params.chatId,
    },
  })

  return NextResponse.json(message)
})
