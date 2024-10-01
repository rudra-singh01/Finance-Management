"use client"
import React from 'react'
import { LayoutDashboard, Wallet, CreditCard, ArrowUpCircle } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'

const SideNav = () => {
    const router = useRouter()
    const menuItems = [
      { name: 'Dashboard', link: '/dashboard', icon: LayoutDashboard },
      { name: 'Budget', link: '/dashboard/budget', icon: Wallet },
      { name: 'Expense', link: '/dashboard/expense', icon: CreditCard },
      { name: 'Upgrade', link: '/dashboard/upgrade', icon: ArrowUpCircle },
    ]
    const path = usePathname()
    
    
  return (
    <div>
        <div className="main w-full h-screen bg-zinc-100 p-4 shadow-sm relative">
            <div className="logo mb-8 flex justify-center items-center">
                <img className='w-[5vw] h-[5VW]'
                    src="https://r2.erweima.ai/imgcompressed/compressed_c91fd23d4370d531174ca24861bfab7d.webp" alt="Logo" 
                />
            </div>
            <nav>
                <ul className='pt-10 flex flex-col items-center justify-center gap-10'>
                    {menuItems.map((item, index) => (
                        <li key={index} 
                            onClick={() => router.push(item.link)}
                            className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${path === item.link ? 'text-blue-500 bg-blue-100' : ''}`}>
                            <item.icon size={24}/>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex items-center gap-5">
                <UserButton />
                <div className="flex items-center justify-center text-center">
                    <h5 className="mt-2 text-black text-lg">Profile</h5>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideNav