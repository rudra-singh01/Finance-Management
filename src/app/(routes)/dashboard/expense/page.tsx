import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
    <div className='p-5 w-full min-h-screen flex flex-col items-center justify-center'>
      <h1 className="text-3xl font-bold mb-8 text-center">
        Expense Page
      </h1>
      <p className="text-xl mb-6 text-center">
        Please select a budget first or create a new budget.
      </p>
      <Link href="/dashboard/budget" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
        Go to Budget Page
      </Link>
    </div>
    </div>
  )
}

export default page