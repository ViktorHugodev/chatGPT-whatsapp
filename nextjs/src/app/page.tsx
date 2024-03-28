'use client'
import useSWR from 'swr'
import { fetcher } from '@/http/http'
import { PlusIcon } from './components/icons/PlusIcon'
import { MessageIcon } from './components/icons/MessageIcon'

// function ChatItemError({ children }: { children: any }) {
//   return (
//     <li className='w-full text-gray-100 bg-gray-800'>
//       <div className='md:max-w-2xl lg:max-w-xl xl:max-w-3xl py-6 m-auto flex flex-row items-start space-x-4'>
//         {/* <Image src='/logo-robot.png' width={30} height={30} alt='' /> */}
//         <div className='relative w-[calc(100%-115px)] flex flex-col gap-1'>
//           <span className='text-red-500'>Ops! Ocorreu um erro: {children}</span>
//         </div>
//       </div>
//     </li>
//   )
// }
const Loading = () => <span className='animate-spin bg-white h-6 w-[5px] rounded'></span>
export default function Home() {
  const { data: chats } = useSWR('chats', fetcher)
  console.log('🚀 ~ Home ~ data:', chats)
  return (
    <div>
      <div className='bg-gray-900 w-[300px] flex h-screen flex-col p-2'>
        {/* -- button new chat -- */}
        <button
          className='flex p-3 gap-3 rounded hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 border border-white/20'
          onClick={() => {}}
        >
          <PlusIcon className='w-5 h-5' />
          New chat
        </button>
        {/* -- end button new chat -- */}
        {/* -- chats -- */}
        <div className='flex-grow overflow-y-auto -mr-2 overflow-hidden'>
          {chats?.map((chat, key) => (
            <div className='pb-2 text-gray-100 text-sm mr-2' key={key}>
              <button
                className='flex p-3 gap-3 rounded hover:bg-[#3f4679] cursor-pointer hover:pr-4 group w-full'
                onClick={() => {}}
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
    </div>
  )
}
