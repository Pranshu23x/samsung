import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.courses.findFirst({ where: { id: Number(courseId) } });
  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  const [updated] = db
    .insert("courses", [{ ...body, id: Number(courseId) }])
    .returning();
  return NextResponse.json(updated ?? body);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  db.deleteWhere("courses", (item: any) => item.id === Number(courseId));
  return NextResponse.json({ success: true });
};
