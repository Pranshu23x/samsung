import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  const { unitId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const data = db.query.units.findFirst({ where: { id: Number(unitId) } });
  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  const { unitId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  const body = await req.json();
  db.update("units", { id: Number(unitId) }, body);
  return NextResponse.json({ ...body, id: Number(unitId) });
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  const { unitId } = await params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized.", { status: 401 });
  db.deleteWhere("units", (item: any) => item.id === Number(unitId));
  return NextResponse.json({ success: true });
};
