"use client";

import { useState } from "react";
import { plans } from "./plans-config";
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  async function actionButton(planTitle: string, billingCycle: string) {
    if (!user) {
      router.push("/login");
      return;
    }

    let productId: string = "";

    if (planTitle == "Starter") {
      if (billingCycle == "monthly") {
        productId = "";
      } else if (billingCycle == "yearly") {
        productId = "";
      }
    } else if (planTitle == "Pro") {
      if (billingCycle == "monthly") {
        productId = process.env.NEXT_PUBLIC_DODO_PRO_MONTHLY!;
      } else if (billingCycle == "yearly") {
        productId = process.env.NEXT_PUBLIC_DODO_PRO_YEARLY!;
      }
    } else if (planTitle == "Ultra") {
      if (billingCycle == "monthly") {
        productId = process.env.NEXT_PUBLIC_DODO_ULTRA_MONTHLY!;
      } else if (billingCycle == "yearly") {
        productId = process.env.NEXT_PUBLIC_DODO_ULTRA_YEARLY!;
      }
    }

    let productType = "subscription";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/${productType}?productId=${productId}&firebaseUserId=${user.uid}&userEmail=${user.email}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();
    router.push(data.payment_link);
  }

  return (
    <div className="bg-white">
      <PricingTableOne
        plans={plans}
        className="w-full max-w-4xl mx-auto"
        title={`We offer ${plans.length} plans`}
        description="Choose the plan that's right for you"
        onPlanSelect={(planTitle, billingCycle) =>
          actionButton(planTitle, billingCycle)
        }
        size="medium" // small, medium, large
        theme="classic" // minimal or clas
        // sic
      />
    </div>
  );
}
