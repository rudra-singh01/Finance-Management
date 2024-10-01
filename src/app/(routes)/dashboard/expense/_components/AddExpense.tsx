"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/DBconfig";
import { Budget, Expense } from "@/utils/Schema";
import React, { useState } from "react";
import { toast } from "sonner";
interface AddExpenseProps {
    budgetId: string;
}

const AddExpense = ({budgetId}: AddExpenseProps) => {
    const [Name, setName] = useState("");
    const [Amount, setAmount] = useState(0);
    const handleAddExpense = async () => {
        const name = Name as string;
        const amount = Number(Amount);
        const result = await db.insert(Expense).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdAt: new Date().toISOString(),
        }).returning({insertedId: Budget.id});
        
        // Add to expense functionality
        if(result && result.length > 0){
            toast.success("Budget successfully added");
            setName("");
            setAmount(0);
        }
             else {
            toast.error("Failed to add expense. Please try again.");
        }
    };
  return (
    <div>
      <div className="font-bold text-2xl">AddExpense</div>
      <div className="text-black flex flex-col justify-center gap-2 mt-4 ">
        <h2 className="text-lg font-light text-black">Expense Name</h2>
        <Input
          placeholder="e.g. phone bill & recharge"
          className="bg-white border-black transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setName(e.target.value)}
          value={Name}
          required
        />
      </div>
      <div className="text-black flex flex-col justify-center gap-2 mt-4 ">
        <h2 className="text-lg font-light text-black">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          type="number"
          className="bg-white border-black transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={Amount}
          required
        />
      </div>
      <div className="mt-4">
        <Button onClick={handleAddExpense} disabled={!Name || !Amount}>Add Expense</Button>
      </div>
    </div>
  );
};

export default AddExpense;
