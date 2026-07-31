import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update technology
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const technology = await prisma.technology.update({
      where: { id },
      data: {
        name: body.name,
        logo: body.logo || null,
        category: body.category || null,
      },
    });

    return NextResponse.json(technology);
  } catch (error: unknown) {
    console.error(error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ message: "Nama teknologi sudah ada." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal mengubah teknologi." }, { status: 500 });
  }
}

// DELETE technology
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.technology.delete({ where: { id } });
    return NextResponse.json({ message: "Teknologi berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus teknologi." }, { status: 500 });
  }
}
