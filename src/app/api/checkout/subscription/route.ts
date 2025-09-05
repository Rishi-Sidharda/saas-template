import { dodopayments } from "../../../../lib/dodopayments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const firebaseUserId = searchParams.get("firebaseUserId");
    const userEmail = searchParams.get("userEmail");

    if (typeof productId !== "string" || productId.trim() === "") {
      return NextResponse.json(
        { error: "Missing or invalid productId query parameter" },
        { status: 400 }
      );
    }

    const response = await dodopayments.subscriptions.create({
      product_id: productId,
      quantity: 1,
      payment_link: true,
      return_url: process.env.NEXT_PUBLIC_BASE_URL,
      customer: {
        email: userEmail?.toString() as any, 
        name: userEmail?.toString() as any,
      },
      billing: {
        city: "",
        country: "US",
        state: "",
        street: "",
        zipcode: "",
      },
      metadata: {
        firebaseUserId: firebaseUserId?.toString() as any,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
