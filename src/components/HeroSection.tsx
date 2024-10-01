'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const moveTo = () => {
    router.push('/dashboard')
  }
  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col bg-zinc-100'>
        <div className="content flex flex-col items-center justify-center text-center gap-4 w-full">
            <section className=" text-white w-full">
              <div className="w-full px-4 py-32 lg:flex lg:h-screen lg:items-center">
                <div className="w-full text-center">
                  <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                    Apne Kharche Ka Management Karo
                    <span className="sm:block">Apne Paise Par Control Rakho</span>
                  </h1>

                  <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-black">
                    Apna budget banana shuru karo aur apne paise bachao
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button onClick={moveTo}>
                      Get Started Now
                    </Button>

                    
                  </div>
                </div>
              </div>
            </section>
        </div>
        <div className='w-full h-screen p-10 -mt-[10vw]'>
            <img className='w-full h-full object-cover' src="https://cdn.dribbble.com/userupload/4288318/file/original-73288197e9d98c95006e258d3ab69325.png" alt="hero" />
        </div>
    </div>
  )
}

export default HeroSection

