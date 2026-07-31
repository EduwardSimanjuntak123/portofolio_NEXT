import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { technologyIds, ...data } = body;

    // Delete old technology links then recreate
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        startYear: Number(data.startYear),
        endYear: data.endYear ? Number(data.endYear) : null,
        technologies: {
          create: (technologyIds || []).map((technologyId: string) => ({ technologyId })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah project." }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus project." }, { status: 500 });
  }
}
