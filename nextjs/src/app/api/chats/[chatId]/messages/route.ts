import { withAuth } from '@/app/api/withAuth'
import { prisma } from '@/app/prisma/prisma'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

interface GetMessagesProps {
  params: {
    chatId: string
  }
}
export const GET = withAuth(async (_request: NextRequest, _token, { params }) => {
  console.log('params GET:', params)

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
export const POST = withAuth(async (request: NextRequest, _token, { params }: GetMessagesProps) => {
  const body = await request.json()
  const chat = await prisma.chat.findUniqueOrThrow({
    where: {
      id: params.chatId,
    },
  })

  const message = await prisma.message.create({
    data: {
      content: body.message,
      chat_id: params.chatId,
    },
  })

  return NextResponse.json(message)
})
