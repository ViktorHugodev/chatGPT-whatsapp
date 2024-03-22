import { prisma } from '@/app/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log('🚀 ~ POST ~ body:', body)
  const chatCreated = await prisma.chat.create({
    data: {
      messages: {
        create: {
          content: body.message,
        },
      },
    },
  })

  return NextResponse.json(chatCreated)
}

export async function GET(request: NextRequest) {
  const chats = await prisma.chat.findMany({
    orderBy: {
      created_at: 'desc',
    },
  })

  return NextResponse.json(chats)
}
