'use client'
import useSWR from 'swr'
import ClientHttp, { fetcher } from '@/http/http'
import { PlusIcon } from './components/icons/PlusIcon'
import { MessageIcon } from './components/icons/MessageIcon'
import { Chat } from '@prisma/client'
import { Message } from 'postcss'
import { ArrowRightIcon } from './components/icons/ArrowRightIcon'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useLayoutEffect, useState } from 'react'
import useSWRSubscription from 'swr/subscription'
import { ChatItem } from './components/ChatItem'
import { ChatItemError } from './components/ChatItemError'
import LogoutButton from './components/LogoutItem'
import { signOut } from 'next-auth/react'

type ChatWithFirstMessage = Chat & {
  messages: [Message]
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdParam = searchParams.get('id')
  const [chatId, setChatId] = useState<string | null>(chatIdParam)
  const [messageId, setMessageId] = useState<string | null>(null)

  const { data: chats, mutate: mutateChats } = useSWR<ChatWithFirstMessage[]>('chats', fetcher, {
    fallbackData: [],
    revalidateOnFocus: false,
  })
  const { data: messages, mutate: mutateMessages } = useSWR<Message[]>(
    chatId ? `chats/${chatId}/messages` : null,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
    },
  )
  const { data: messageLoading, error: errorMessageLoading } = useSWRSubscription(
    messageId ? `/api/messages/${messageId}/events` : null,
    (path: string, { next }) => {
      console.log('event initiated')
      const eventSource = new EventSource(path)
      eventSource.onmessage = event => {
        console.log('🚀 ~ useSWRSubscription onmessage ~ event:', event)
        const newMessage = JSON.parse(event.data)
        next(null, newMessage.content)
      }
      eventSource.onerror = event => {
        console.log('🚀 ~ useSWRSubscription onerror ~ event:', event)
        eventSource.close()
        //@ts-ignore
        next(event.data, null)
      }
      eventSource.addEventListener('end', event => {
        console.log('🚀 ~ useSWRSubscription onend ~ event:', event)
        eventSource.close()
        const newMessage = JSON.parse(event.data)
        mutateMessages(messages => [...messages!, newMessage], false)
        next(null, null)
      })
      return () => {
        console.log('close event source')
        eventSource.close()
      }
    },
  )

  useEffect(() => {
    setChatId(chatIdParam)
  }, [chatIdParam])

  useEffect(() => {
    const textArea = document.querySelector('#message') as HTMLTextAreaElement
    textArea?.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
      }
    })
    textArea?.addEventListener('keyup', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        const form = document.querySelector('#form') as HTMLFormElement
        const submitForm = form?.querySelector('button') as HTMLButtonElement
        form.requestSubmit(submitForm)
        return
      }
      if (textArea.scrollHeight >= 200) {
        textArea.style.overflowY = 'scroll'
      } else {
        textArea.style.overflowY = 'hidden'
        textArea.style.height = 'auto'
        textArea.style.height = textArea.scrollHeight + 'px'
      }
    })
  }, [])
  useLayoutEffect(() => {
    if (!messageLoading) {
      return
    }
    const chatting = document.querySelector('#chatting') as HTMLUListElement
    chatting.scrollTop = chatting.scrollHeight
  }, [messageLoading])
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const textArea = event.currentTarget.querySelector('textarea') as HTMLTextAreaElement
    const message = textArea?.value

    if (!chatId) {
      const newChat: ChatWithFirstMessage = await ClientHttp.post(`chats`, { message })
      mutateChats([newChat, ...chats!], false)
      setChatId(newChat.id)
      setMessageId(newChat.messages[0].id)
    } else {
      const newMessage = await ClientHttp.post(`chats/${chatId}/messages`, { message })
      mutateMessages([...messages!, newMessage], false)
      setMessageId(newMessage.id)
    }

    textArea.value = ''
  }

  return (
    <div className='overflow-hidden w-full h-full relative flex'>
      {/* SIDE BAR */}
      <div className='bg-gray-900 w-[300px] flex h-screen flex-col p-2'>
        {/* -- button new chat -- */}
        <button
          className='flex p-3 gap-3 rounded hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 border border-white/20'
          onClick={() => {
            router.push('/')
            setChatId(null)
            setMessageId(null)
          }}
        >
          <PlusIcon className='w-5 h-5' />
          Novo chat
        </button>
        {/* -- end button new chat -- */}

        {/* -- chats -- */}
        <div className='flex-grow overflow-y-auto -mr-2 overflow-hidden'>
          {chats!.map((chat, key) => (
            <div className='pb-2 text-gray-100 text-sm mr-2' key={key}>
              <button
                className='flex p-3 gap-3 rounded hover:bg-[#3f4679] cursor-pointer hover:pr-4 group w-full'
                onClick={() => router.push(`/?id=${chat.id}`)}
              >
                <MessageIcon className='h-5 w-5' />
                <div className='max-h-5 overflow-hidden break-all relative w-full text-left'>
                  {chat.messages[0]?.content}
                  <div className='absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#3f4679]'></div>
                </div>
              </button>
            </div>
          ))}
        </div>

        <LogoutButton />
      </div>
      {/* END SIDEBAR */}
      {/* MAIN CONTENT */}
      <div className='flex-1 flex-col relative'>
        <ul id='chatting' className='h-screen overflow-y-auto bg-gray-800'>
          {messages?.map((message, key) => (
            <ChatItem key={key} content={message.content} is_from_bot={message.is_from_bot} />
          ))}
          {messageLoading && (
            <ChatItem content={messageLoading} is_from_bot={true} loading={true} />
          )}
          {errorMessageLoading && <ChatItemError>{errorMessageLoading}</ChatItemError>}
          <li className='h-36 bg-gray-800'></li>
        </ul>

        <div className='absolute bottom-0 w-full !bg-transparent bg-gradient-to-b from-gray-800 to-gray-950'>
          <div className='mb-6 mx-auto max-w-3xl'>
            <form id='form' onSubmit={onSubmit}>
              <div className='flex flex-col py-3 pl-4 relative text-white bg-gray-700 rounded'>
                <textarea
                  id='message'
                  tabIndex={0}
                  rows={1}
                  placeholder='Digite sua pergunta'
                  className='resize-none pr-14 bg-transparent pl-0 outline-none'
                ></textarea>
                <button
                  type='submit'
                  className='absolute top-1 text-gray-400 bottom-2.5 rounded hover:text-gray-400 hover:bg-gray-900 md:right-4'
                  disabled={messageLoading}
                >
                  <ArrowRightIcon className='text-white-500 w-8' />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* END MAIN CONTENT */}
    </div>
  )
}
