'use client'
import useSWR from 'swr'
import { fetcher } from '@/http/http'

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
  const { data } = useSWR('chats', fetcher)
  console.log('🚀 ~ Home ~ data:', data)
  return <h1>Hello world</h1>
}
