"use client";
import db from "@/utils/DBconfig";
import { Budget, Expense } from "@/utils/Schema";
import { useUser } from "@clerk/nextjs";
import {desc,eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budget/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import EditDialog from "../_components/EditDialog";
// import { Button } from "@/components/ui/button";
// import { PenBox } from "lucide-react";

interface BudgetData {
  totalSpend: number;
  totalItem: number;
  id: number;
  name: string;
  amount: number;
  icon: string | null;
  createdBy: string;
}

const Page = ({ params }: { params: { id: string } }) => {
  const { user } = useUser();
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [expenseList, setExpenseList] = useState<Array<typeof Expense.$inferSelect>>([]);

  useEffect(() => {
    if (user) {
      bugetInfo();
    }
  }, [user]);

  const bugetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budget),
        totalSpend: sql<number>`COALESCE(sum(${Expense.amount}), 0)`.mapWith(Number),
        totalItem: sql<number>`count(${Expense.id})`.mapWith(Number),
      })
      .from(Budget)
      .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
      .where(eq(Budget.id, Number(params.id)))
      .groupBy(Budget.id)
      getExpenseList();

    if (result.length > 0) {
      setBudgetData(result[0]);
    }
  };

  const getExpenseList = async () => {
    const result = await db.select()
      .from(Expense)
      .where(eq(Expense.budgetId, parseInt(params.id)))
      .orderBy(desc(Expense.id))

      setExpenseList(result)
  }

  return (
    <div className="p-5 w-full min-h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-8 px-10">
        <h1
          className="text-4xl font-extrabold relative inline-block transition-all duration-300 hover:scale-105 cursor-pointer
                         bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                         before:content-['💰'] before:absolute before:-left-10 before:top-1/2 before:-translate-y-1/2 before:text-3xl before:opacity-0 before:transition-all before:duration-300
                         after:content-['📊'] after:absolute after:-right-10 after:top-1/2 after:-translate-y-1/2 after:text-3xl after:opacity-0 after:transition-all after:duration-300
                         hover:before:opacity-100 hover:after:opacity-100 hover:before:left-[-30px] hover:after:right-[-30px]"
        >
          My Expense List
        </h1>
        <EditDialog budget={budgetData!} />
      </div>
      <div className="mb-8 float-left w-full mr-4 flex gap-10 ">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-4">
            <BudgetItem budget={budgetData}/>
          </div>
        </div>
        <div className="mx-[20vw]">
          <AddExpense budgetId={params.id}/>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Latest Expenses</h2>
        <ExpenseListTable 
          expenseList={expenseList} 
          refreshData={() => {
            // Yahan pe data refresh karne ka logic daalna padega
          }}
        />
      </div>

    </div>
  );
};

export default Page;
