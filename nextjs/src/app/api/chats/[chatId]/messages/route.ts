import { prisma } from '@/app/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface GetMessagesProps {
  params: {
    chatId: string
  }
}
export async function GET(_request: NextRequest, { params }: GetMessagesProps) {
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
}
export async function POST(request: NextRequest, { params }: GetMessagesProps) {
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
}
