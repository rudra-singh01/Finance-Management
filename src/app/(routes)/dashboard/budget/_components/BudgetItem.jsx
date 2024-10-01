import Link from "next/link";
import React, { useState, useEffect } from "react";

const BudgetItem = ({ budget }) => {
  const [localBudget, setLocalBudget] = useState(budget);

  useEffect(() => {
    setLocalBudget(budget);
  }, [budget]);

  if (!localBudget) {
    return <p>Loading...</p>;
  }

  const spendPercentage = localBudget.amount ? (localBudget.totalSpend / localBudget.amount) * 100 : 0;
  const remainingAmount = localBudget.amount ? localBudget.amount - localBudget.totalSpend : 0;

  return (
    <Link href={`/dashboard/expense/${localBudget.id}`} className="w-full sm:w-1/2 lg:w-1/3 p-2 sm:p-4">
      <div className="budget-item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl md:text-3xl bg-green-100 p-2 sm:p-3 rounded-full">{localBudget.icon}</span>
              <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800">{localBudget.name}</h2>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">₹{localBudget.amount}</p>
          </div>

          <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Spend: ₹{localBudget.totalSpend}</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Total Items: {localBudget.totalItem}</p>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm md:text-base">
              <span className="text-gray-600">Spend</span>
              <span className="font-semibold text-gray-800">₹{localBudget.totalSpend}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${spendPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm md:text-base">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold text-gray-800">₹{remainingAmount}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-3 sm:p-4">
          <p className="text-center text-xs sm:text-sm md:text-base font-medium text-green-800">
            {remainingAmount > 0 ? `₹${remainingAmount} remaining` : "Remaining budget is over!"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
