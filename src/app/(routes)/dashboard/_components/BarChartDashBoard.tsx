"use client"
import React from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BarChartDashBoard = ({
  budgetList,
}: {
  budgetList: {
    id: number;
    name: string;
    amount: number;
    totalSpend: number;
  }[];
}) => {
  return (
    <div className="border rounded-lg p-5 flex flex-col gap-10">
      <h2 className="text-2xl font-bold mb-4">Activities</h2>
      <ResponsiveContainer width={'80%'} height={400}>
        <BarChart 
          data={budgetList}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={'80%'} height={400}>
        <PieChart>
          <Pie
            data={budgetList}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name} // {{ edit_1 }}: Show budget name as label
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalSpend"
          >
            {budgetList.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartDashBoard;
