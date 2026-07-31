import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all skills with their technologies
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data skill." }, { status: 500 });
  }
}

// POST create skill
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const technologyIds: string[] = body.technologyIds || [];

    const skill = await prisma.skill.create({
      data: {
        category: body.category,
        percentage: Number(body.percentage),
        technologies: {
          create: technologyIds.map((technologyId: string) => ({ technologyId })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan skill." }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const technologyIds: string[] = body.technologyIds || [];

    if (!body.id) {
      return NextResponse.json({ message: "ID wajib dikirim." }, { status: 400 });
    }

    // Delete old technology links, then recreate
    await prisma.skillTechnology.deleteMany({ where: { skillId: body.id } });

    const skill = await prisma.skill.update({
      where: { id: body.id },
      data: {
        category: body.category,
        percentage: Number(body.percentage),
        technologies: {
          create: technologyIds.map((technologyId: string) => ({ technologyId })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah skill." }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID wajib dikirim." }, { status: 400 });
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ message: "Skill berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus skill." }, { status: 500 });
  }
}