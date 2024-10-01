'use client'; // Ensure this is at the top

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import Cards from './_components/Cards';
import { Budget, Expense } from '@/utils/Schema';
import db from '@/utils/DBconfig';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import BarChartDashBoard from './_components/BarChartDashBoard';
import BudgetItem from './budget/_components/BudgetItem';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();  // Get user from Clerk
  const [budgetList, setBudgetList] = useState<Array<typeof Budget.$inferSelect & { totalSpend: number; totalItem: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is available before fetching the budget list
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    setLoading(true);  // Show loader when fetching data
    try {
      const result = await db
        .select({
          ...getTableColumns(Budget),
          totalSpend: sql<number>`COALESCE(sum(${Expense.amount}), 0)`.mapWith(Number),
          totalItem: sql<number>`count(${Expense.id})`.mapWith(Number),
        })
        .from(Budget)
        .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
        .groupBy(Budget.id);

      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budget data: ', error);
    } finally {
      setLoading(false);  // Hide loader once data is fetched
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Display a loading state if the user isn't available yet
  }

  return (
    <div className="w-full min-h-screen p-5 flex flex-col gap-5 overflow-hidden">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-extrabold relative inline-block transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent before:content-['👋'] before:absolute before:-left-10 before:top-1/2 before:-translate-y-1/2 before:text-3xl before:opacity-100 before:transition-all before:duration-300 before:animate-wave after:content-['📦'] after:absolute after:-right-10 after:top-1/2 after:-translate-y-1/2 after:text-3xl after:opacity-100 after:transition-all after:duration-300 after:animate-wave hover:before:opacity-100 hover:after:opacity-100 hover:before:left-[-30px] hover:after:right-[-30px]">
          Hello {user?.fullName}
        </h1>
        <h3 className='text-xl font-semibold transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent'>
          Let's check your performance and flow of your money
        </h3>
      </div>

      {/* Ensure the Cards component only renders when budgetList is available */}
      {!loading && <Cards budgetList={budgetList} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {!loading && <BarChartDashBoard budgetList={budgetList} />}
        </div>
        <div className="flex flex-col gap-4">
          {budgetList.length > 0 ? (
            budgetList.map((budget, index) => (
              <div className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105" key={index}>
                <BudgetItem budget={budget} />
              </div>
            ))
          ) : (
            <button
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
              onClick={() => router.push('/budget')}  // Redirect to budget page
            >
              Create Budget
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
