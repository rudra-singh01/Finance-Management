import React from 'react'
import BudgetList from './_components/BudgetList'

const Budget = () => {
  return (
    <div className='p-5 w-full min-h-screen overflow-hidden flex flex-col'>
      <h1 className="text-4xl font-extrabold mb-8 relative inline-block transition-all duration-300 hover:scale-105 cursor-pointer
                     bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                     before:content-['💰'] before:absolute before:-left-10 before:top-1/2 before:-translate-y-1/2 before:text-3xl before:opacity-0 before:transition-all before:duration-300
                     after:content-['📊'] after:absolute after:-right-10 after:top-1/2 after:-translate-y-1/2 after:text-3xl after:opacity-0 after:transition-all after:duration-300
                     hover:before:opacity-100 hover:after:opacity-100 hover:before:left-[-30px] hover:after:right-[-30px]">
        My Budget List
      </h1>
      <div className="flex-grow relative">
        <div className="absolute inset-0 overflow-x-auto">
          <div className="min-w-max">
            <BudgetList/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Budget