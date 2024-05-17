import { signOut } from 'next-auth/react'
import { LogoutIcon } from '../icons/LogoutIcon'
import ClientHttp from '@/http/http'

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true })
    const { url: logoutUrl } = await ClientHttp.get(
      `logout-url?${new URLSearchParams({ redirect: window.location.origin })}`,
    )
    window.location.href = logoutUrl
  }

  return (
    <button
      className='flex p-3 mt-1 gap-3 rounded hover:bg-gray-500/10 text-sm text-white'
      onClick={handleLogout}
    >
      Log Out <LogoutIcon className='h-5 w-5' />
    </button>
  )
}

export default LogoutButton
