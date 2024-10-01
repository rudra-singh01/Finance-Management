"use client";
import React, { useEffect, useCallback } from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";
import db from "@/utils/DBconfig";
import { Budget } from "@/utils/Schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      CheckBudget();
    }
  }, [user]);

  const CheckBudget = useCallback(async () => {
    try {
      if (user?.primaryEmailAddress?.emailAddress) {
        const budget = await db
          .select()
          .from(Budget)
          .where(eq(Budget.createdBy, user.primaryEmailAddress.emailAddress));

        console.log("Budget:", budget);

        if (budget.length === 0) {
          console.log(
            "Koi budget nahi hai, budget page pe redirect kar raha hoon"
          );
          router.push("/dashboard/budget");
        }
      } else {
        console.error("User ka email address undefined hai.");
      }
    } catch (error) {
      console.error("Budget fetch karne mein error aaya:", error);
    }
  }, [user, router]);

  return (
    <div>
      <div className="fixed md:w-[20vw] hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-[21vw] bg-zinc-100 text-black">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Dashboardlayout;
