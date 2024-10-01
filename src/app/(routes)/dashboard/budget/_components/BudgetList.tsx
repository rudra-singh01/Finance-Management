'use client';
import React, { useEffect, useState } from 'react';
import CreateBtn from './CreateBtn';
import db from '@/utils/DBconfig';
import { Budget, Expense } from '@/utils/Schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';

const BudgetList = () => {
  const [budgetList, setBudgetList] = useState<Array<typeof Budget.$inferSelect & { totalSpend: number; totalItem: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    setLoading(true);  // Show loader when fetching data
    try {
      const result = await db.select({
        ...getTableColumns(Budget),
        totalSpend: sql<number>`COALESCE(sum(${Expense.amount}), 0)`.mapWith(Number),
        totalItem: sql<number>`count(${Expense.id})`.mapWith(Number),
      })
      .from(Budget)
      .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
      .groupBy(Budget.id);

      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budget data: ", error);
    } finally {
      setLoading(false);  // Hide loader once data is fetched
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <CreateBtn refreshData={getBudgetList} />
      </div>

      <div className="flex flex-wrap justify-center">
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-slate-200 rounded-lg h-[180px] animate-pulse"></div>
            </div>
          ))
        ) : (
          budgetList.length > 0 ? (
            budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
          ) : (
            <p className="text-center mt-4 text-gray-500">No budgets found. Click the button above to create a new budget.</p>
          )
        )}
      </div>
    </>
  );
};

export default BudgetList;
