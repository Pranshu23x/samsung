import { NextResponse } from "next/server";

// Stripe webhook — disabled for demo mode.
export async function POST() {
  return new NextResponse(null, { status: 200 });
}
