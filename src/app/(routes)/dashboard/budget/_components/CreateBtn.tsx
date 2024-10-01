"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/DBconfig";
import { Budget } from "@/utils/Schema";
import { useUser } from "@clerk/nextjs";
import { toast   } from "sonner";

const CreateBtn = ({refreshData}:{refreshData:()=>void}) => { 
  const [Emoji, setEmoji] = useState("😃");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [Amount, setAmount] = useState(0);
  const [Name, setName] = useState("");

  const {user} = useUser()

  const toggleEmojiPicker = () => {
    setOpenEmoji((prevState) => !prevState);
  };

  const handleAddBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Form submission ko rokne ke liye
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("User email not found");
      return;
    }

    try {
      const result = await db.insert(Budget).values({
        name: Name,
        amount: Amount,
        createdBy: email,
        icon: Emoji,
      }).returning({insertedId:Budget.id});

      if(result && result.length > 0){
        toast.success("Budget successfully added");
        setName("");
        setAmount(0);
        setEmoji("😃");
        refreshData();
      } else {
        toast.error("Error adding budget");
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
          <div className="border-2 py-[4vw] border-dashed border-black rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-xl bg-zinc-200">
            <span className="text-3xl mr-2">+</span>
            <h3 className="text-lg font-semibold">Create New Budget</h3>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>
              <p className="text-lg font-light text-[#dadada]">
                Create New Budget
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
          <form onSubmit={handleAddBudget}>
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
              Add Budget
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBtn;