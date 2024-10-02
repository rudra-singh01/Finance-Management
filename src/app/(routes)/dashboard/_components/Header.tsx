import db from "@/utils/DBconfig";
import { Budget, Expense } from "@/utils/Schema";
import { UserButton, useUser } from "@clerk/nextjs";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { useRouter } from "next/navigation"; // useRouter ko import kiya
import React, { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter(); // useRouter ka instance banaya
  const [budgetList, setBudgetList] = useState<Array<typeof Budget.$inferSelect & { totalSpend: number; totalItem: number }>>([]);
  const [search, setSearch] = useState<string>('');
  const { user } = useUser();
  const [matchedBudgets, setMatchedBudgets] = useState<Array<typeof Budget.$inferSelect & { totalSpend: number; totalItem: number }>>([]);
  const [notFound, setNotFound] = useState<boolean>(false); // Not found state

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  useEffect(() => {
    const matched = budgetList.filter(budget => budget.name.toLowerCase().includes(search.toLowerCase()));
    setMatchedBudgets(matched);
    setNotFound(matched.length === 0 && search.length > 0); // Check if no budgets matched
  }, [search, budgetList]);

  const getBudgetList = async () => {
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
    } 
  };

  const handleSearchClick = (id?: number) => {
    if (id) {
      router.push(`/dashboard/expense/${id}`); // Budget page pe redirect karne ke liye
    } else {
      router.push(`/dashboard/budget`); // Agar id nahi hai toh sirf budget page pe redirect
    }
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-10">
      <div className="Header p-5 border-b border-zinc-300 shadow-sm flex items-center justify-between max-w-7xl mx-auto bg-zinc-100">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              onFocus={() => setMatchedBudgets(budgetList)} // Show all budgets when focused
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search karo..."
              className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => handleSearchClick(matchedBudgets[0]?.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {search && ( // Show matched budgets only when there's a search term
            <div className="absolute top-full w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
              {matchedBudgets.map((budget, index) => (
                <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSearchClick(budget.id)}>
                  {budget.name}
                </div>
              ))}
              {notFound && ( // Show not found message
                <div className="p-2 text-red-500">Budget not Found!</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
