import React, { useEffect, useState } from "react";
import { Calculator, Wallet, List } from "lucide-react";

const Cards = ({
    budgetList,
}: {
    budgetList: {
        id: number;
        name: string;
        amount: number;
        totalSpend: number;
    }[];
}) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);

    useEffect(() => {
        console.log(budgetList);
        calculateInfo();
    }, [budgetList]); // Added budgetList as dependency

    const Lenght = budgetList.length;

    const calculateInfo = () => {
        let TotalBudget_ = 0;
        let TotalSpend_ = 0;
        budgetList.forEach((elm) => {
            TotalBudget_ += elm.amount;
            TotalSpend_ += elm.totalSpend;
        });
        setTotalAmount(TotalBudget_);
        setTotalSpend(TotalSpend_);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Total Budget</h3>
                    <p className="text-xl font-bold">{totalAmount}</p>
                </div>
                <Calculator className="w-6 h-6" />
            </div>
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Total Spend</h3>
                    <p className="text-xl font-bold">{totalSpend}</p>
                </div>
                <Wallet className="w-6 h-6" />
            </div>
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">No. of Budget</h3>
                    <p className="text-xl font-bold">{Lenght}</p>
                </div>
                <List className="w-6 h-6" />
            </div>
        </div>
    );
};

export default Cards;
