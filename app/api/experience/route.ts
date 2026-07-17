import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        position: body.position,
        location: body.location || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description,
        logo: body.logo || null,
      },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan data." }, { status: 500 });
  }
}
