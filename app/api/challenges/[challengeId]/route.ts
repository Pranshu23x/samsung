import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  const { challengeId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.challenges.findFirst({ where: { id: Number(challengeId) } });
  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  const { challengeId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  db.update("challenges", { id: Number(challengeId) }, body);
  return NextResponse.json({ ...body, id: Number(challengeId) });
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  const { challengeId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  db.deleteWhere("challenges", (item: any) => item.id === Number(challengeId));
  return NextResponse.json({ success: true });
};
