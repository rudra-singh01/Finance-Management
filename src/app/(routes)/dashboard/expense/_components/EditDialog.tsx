'use client'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import React, { useState, useEffect } from 'react'
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import db from "@/utils/DBconfig";
import { useUser } from "@clerk/nextjs";

import { toast } from "sonner";
import { Budget } from '@/utils/Schema';
import { eq } from 'drizzle-orm';
const EditDialog = ({ budget }) => { // 'any' ko 'number' type se replace kiya
  const [Emoji, setEmoji] = useState("😃");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [Amount, setAmount] = useState(0);
  const [Name, setName] = useState("");

  const {user} = useUser()
  console.log(budget);
  
  useEffect(() => {
    if (budget) { // Check if budget is not null
      setName(budget.name); // Budget name ko input field mein set karna
      setAmount(budget.amount); // Budget amount ko input field mein set karna
    }
  }, [budget]); // Budget change hone par useEffect run hoga
  
  const toggleEmojiPicker = () => {
    setOpenEmoji((prevState) => !prevState);
  };

  const handleEditBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Form submission ko rokne ke liye
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("User email not found");
      return;
    }

    try {
      const result = await db.update(Budget).set({
        name: Name,
        amount: Amount,
        createdBy: email,
        icon: Emoji,
      }).where(eq(Budget.id, budget.id));

      if(result){
        toast.success("Budget successfully updated");
      } else {
        toast.error("Error updating budget");
      }
    } catch (error) {
        console.error("Database error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
        
        <Dialog>
        <DialogTrigger asChild>
        <Button> <PenBox style={{visibility: 'visible'}}/> edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>
              <p className="text-lg font-light text-[#dadada]">
                Edit Budget
              </p>
            </DialogTitle>
            <DialogDescription>
              <Button onClick={toggleEmojiPicker} size={"lg"}>
                {Emoji}
              </Button>
              <div className="absolute">
                {openEmoji && (
                  <div className="z-999">
                    <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      setEmoji(emojiObject.emoji);
                      setOpenEmoji(false);
                    }}
                  />
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditBudget}>
            <div className="text-black flex flex-col justify-center gap-2">
              <h2 className="text-lg font-light text-white">Budget Name</h2>
              <Input
                placeholder="e.g. Groceries"
                className="bg-white border-black transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setName(e.target.value)}
                value={Name}
                required
              />
            </div>
            <div className="text-black flex flex-col justify-center gap-2 mt-4">
              <h2 className="text-lg font-light text-white">
                Enter Budget Amount
              </h2>
              <Input
                placeholder="e.g. 1000"
                type="number"
                className="bg-white border-black transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setAmount(Number(e.target.value))}
                value={Amount}
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
              disabled={!Name || !Amount}
            >
              update Budget
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditDialog