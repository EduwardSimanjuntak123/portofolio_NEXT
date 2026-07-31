import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update certificate
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        title: body.title,
        issuer: body.issuer,
        issueDate: new Date(body.issueDate),
        credential: body.credential || null,
        image: body.image || null,
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah sertifikat." }, { status: 500 });
  }
}

// DELETE certificate
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ message: "Sertifikat berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus sertifikat." }, { status: 500 });
  }
}
