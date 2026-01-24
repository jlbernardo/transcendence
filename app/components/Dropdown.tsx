'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore'
import { logout } from '@/services/authentication';
import { useState } from 'react';

export default function Dropdown() {
    const profile = useUserStore((state) => state.profile);
    const logoutStore = useUserStore((state) => state.logout);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    async function handleLogout() {
        try {
            setIsLoading(true);
            const response = await logout();
            console.log('Logout completed successfully');
            logoutStore();
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed on backend:', error);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
    <Menu as="div">
      <MenuButton className="w-full">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-2 z-10 mt-2 w-56 origin-top-right divide-y divide-white/25 rounded-md bg-fuchsia-950 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <p className="px-4 pt-1 text-sm text-gray-400">Signed in as</p>
          <p className="px-4 pb-2 text-sm font-medium text-white truncate">{profile?.user.email || "Guest"}</p>
        </div>
        {/* <div className="py-1">
          <MenuItem>
            <a
              href="/friends"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Friends
            </a>
          </MenuItem>
           <MenuItem>
            <a
              href="/chat"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Conversations
            </a>
          </MenuItem>
        </div> */}
        <div className="py-1">
          <MenuItem>
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Profile
            </a>
          </MenuItem>
          {/* <MenuItem>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Account settings
            </a>
          </MenuItem> */}
        </div>
        <div className="py-1">
          <MenuItem>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
