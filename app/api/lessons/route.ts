import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.lessons.findMany();
  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  const [inserted] = db.insert("lessons", [body]).returning();
  return NextResponse.json(inserted ?? body);
};
