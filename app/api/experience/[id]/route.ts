import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const experience = await prisma.experience.update({
      where: { id },
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

    return NextResponse.json(experience);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah data." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ message: "Experience berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus data." }, { status: 500 });
  }
}
