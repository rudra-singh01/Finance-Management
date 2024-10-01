"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const Navbar = () => {
  const { user , isSignedIn } = useUser();
  const router = useRouter();

  const moveBy = () => {
    router.push('/sign-up')
  }
  return (
    <div>
        <nav className='w-full h-20 fixed bg-zinc-50 shadow-md '>
            <div className="main w-full h-full flex justify-between items-center px-10">
                <div className="logo w-14 rounded-lg overflow-hidden">
                  <img className='w-full object-cover' src="https://media.istockphoto.com/id/1176040154/vector/initial-o-and-statistics-business-chart-bar-design.jpg?s=612x612&w=0&k=20&c=bYhtAUHQicC3BVi2Yf9xv2djkF57FIjZHF9WaQYFNoI=" alt="" />
                </div>
                <div className="content flex items-center justify-center">
                    {isSignedIn ? (
                      <div className="flex items-center gap-2">
                        <UserButton/>
                        <h4 className='text-2xl'>{user?.fullName}</h4>
                      </div>
                    ) : (
                      <Button onClick={moveBy}><h4 className='text-xl'>Get Started</h4></Button>
                    )}
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Navbar