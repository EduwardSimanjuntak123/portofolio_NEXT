import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { technologies: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data project." }, { status: 500 });
  }
}

// POST create project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { technologies, ...data } = body;

    const project = await prisma.project.create({
      data: {
        ...data,
        startYear: Number(data.startYear),
        endYear: data.endYear ? Number(data.endYear) : null,
        technologies: {
          create: (technologies || []).map((name: string) => ({ name })),
        },
      },
      include: { technologies: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan project." }, { status: 500 });
  }
}
