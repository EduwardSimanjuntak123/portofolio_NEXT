import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const about = await prisma.about.findFirst();

  return NextResponse.json(about);
}

export async function POST(req: Request) {
  const body = await req.json();

  const about = await prisma.about.create({
    data: body,
  });

  return NextResponse.json(about);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const about = await prisma.about.findFirst();

  if (!about) {
    return NextResponse.json(
      { message: "Data tidak ditemukan" },
      { status: 404 }
    );
  }

  const updated = await prisma.about.update({
    where: {
      id: about.id,
    },
    data: body,
  });

  return NextResponse.json(updated);
}