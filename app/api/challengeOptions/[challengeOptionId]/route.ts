import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  const { challengeOptionId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.challengeOptions.findFirst({ where: { id: Number(challengeOptionId) } });
  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  const { challengeOptionId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  db.update("challengeOptions", { id: Number(challengeOptionId) }, body);
  return NextResponse.json({ ...body, id: Number(challengeOptionId) });
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  const { challengeOptionId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  db.deleteWhere("challengeOptions", (item: any) => item.id === Number(challengeOptionId));
  return NextResponse.json({ success: true });
};
