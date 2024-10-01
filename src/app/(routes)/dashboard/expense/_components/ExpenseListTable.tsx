import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import db from "@/utils/DBconfig"
import { Expense } from "@/utils/Schema"
import { eq } from "drizzle-orm"
import { toast } from "sonner"
import { TrashIcon } from "lucide-react" // Lucide-react se TrashIcon import kiya gaya hai
import { Dialog,  DialogContent, DialogClose, } from "@radix-ui/react-dialog";
// DialogButton import kiya gaya hai, lekin yeh error de raha hai, isliye yeh comment out kiya gaya hai
// import {DialogButton} from '@radix-ui/react-dialog'

interface ExpenseListTableProps {
  expenseList: {
    id: number;
    name: string;
    amount: number;
    budgetId: number | null;
    createdAt: string | null;
  }[];
  refreshData: () => void;
}

const ExpenseListTable: React.FC<ExpenseListTableProps> = ({ expenseList, refreshData }) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteExpense = async (id: number) => {
    setDeleteId(id);
  }

  const confirmDelete = async () => {
    try {
      if (deleteId) {
        const result = await db.delete(Expense).where(eq(Expense.id, deleteId))
        if (result) {
          toast.success("Expense delete ho gaya hai")
          refreshData(); // Yahan pe refreshData function ko call kiya gaya hai
        } else {
          toast.error("Expense delete karne mein problem hui")
        }
      }
    } catch (error) {
      console.error("Expense delete karte waqt error aaya:", error)
      toast.error("Kuch gadbad ho gayi. Phir se koshish karein.")
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 text-white">
            <TableHead className="w-[200px] py-3">Name</TableHead>
            <TableHead className="py-3">Amount</TableHead>
            <TableHead className="py-3">Date</TableHead>
            <TableHead className="text-right py-3">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseList.map((expense, index) => (
            <TableRow key={expense.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <TableCell className="font-medium py-3">{expense.name}</TableCell>
              <TableCell className="py-3 text-green-600 font-semibold">₹{expense.amount.toFixed(2)}</TableCell>
              <TableCell className="py-3 text-gray-600">{expense.createdAt ? format(new Date(expense.createdAt), 'dd MMM yyyy') : 'N/A'}</TableCell>
              <TableCell className="text-right py-3">
                <Button size="sm" className="hover:bg-red-600 transition-colors duration-200" onClick={() => handleDeleteExpense(expense.id)}>
                  <TrashIcon className="h-5 w-5 mr-2" />Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this expense?</h2>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button size="sm" className="mr-2">Cancel</Button>
            </DialogClose>
            <Button size="sm" className="bg-red-600 text-white" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExpenseListTable