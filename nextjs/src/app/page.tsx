'use client'
import useSWR from 'swr'
import ClientHttp, { fetcher } from '@/http/http'
import { PlusIcon } from './components/icons/PlusIcon'
import { MessageIcon } from './components/icons/MessageIcon'
import { Chat } from '@prisma/client'
import { Message } from 'postcss'
import { ArrowRightIcon } from './components/icons/ArrowRightIcon'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
type ChatWithFirstMessage = Chat & {
  messages: [Message]
}

function ChatItemError({ children }: { children: any }) {
  return (
    <li className='w-full text-gray-100 bg-gray-800'>
      <div className='md:max-w-2xl lg:max-w-xl xl:max-w-3xl py-6 m-auto flex flex-row items-start space-x-4'>
        <Image src='/logo-robot.png' width={30} height={30} alt='' />
        <div className='relative w-[calc(100%-115px)] flex flex-col gap-1'>
          <span className='text-red-500'>Ops! Ocorreu um erro: {children}</span>
        </div>
      </div>
    </li>
  )
}
const Loading = () => <span className='animate-spin bg-white h-6 w-[5px] rounded'></span>

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdParam = searchParams.get('id')
  const [chatId, setChatId] = useState(chatIdParam)
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
    })
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const textArea = event.currentTarget.querySelector('textarea') as HTMLTextAreaElement
    const message = textArea?.value

    if (!chatId) {
      const newChat = await ClientHttp.post(`chats`, { message })
      setChatId(newChat.id)
      mutateChats([newChat, ...chats!], false)
    } else {
      const newMessage = await ClientHttp.post(`chats/${chatId}/messages`, { message })
      mutateMessages([...messages!, newMessage], false)
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
          onClick={() => router.push('/')}
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
                  {chat.messages[0].content}
                  <div className='absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#3f4679]'></div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* END SIDEBAR */}
      {/* MAIN CONTENT */}
      <div className='flex-1 flex-col relative'>
        <ul id='chatting' className='h-screen overflow-y-auto bg-gray-800'>
          {messages!.map((message, key) => (
            <li className='text-white' key={message.id}>
              {message.content}
            </li>
          ))}
          {/* {messages?.map((message, key) => (
            <ChatItem
              key={key}
              content={message.content}
              is_from_bot={message.is_from_bot}
            />
          ))}
          {messageLoading && (
            <ChatItem
              content={messageLoading}
              is_from_bot={true}
              loading={true}
            />
          )}
          {errorMessageLoading && (
            <ChatItemError>{errorMessageLoading}</ChatItemError>
          )} */}
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
                  // disabled={messageLoading}
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
