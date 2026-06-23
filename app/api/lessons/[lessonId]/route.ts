import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  const { lessonId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.lessons.findFirst({ where: { id: Number(lessonId) } });
  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  const { lessonId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  db.update("lessons", { id: Number(lessonId) }, body);
  return NextResponse.json({ ...body, id: Number(lessonId) });
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  const { lessonId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  db.deleteWhere("lessons", (item: any) => item.id === Number(lessonId));
  return NextResponse.json({ success: true });
};
