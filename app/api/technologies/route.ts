import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all technologies
export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { skills: true, projects: true } },
      },
    });
    return NextResponse.json(technologies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data teknologi." }, { status: 500 });
  }
}

// POST create technology
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ message: "Nama teknologi wajib diisi." }, { status: 400 });
    }

    const technology = await prisma.technology.create({
      data: {
        name: body.name,
        logo: body.logo || null,
        category: body.category || null,
      },
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Nama teknologi sudah ada." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Gagal menambahkan teknologi." }, { status: 500 });
  }
}
