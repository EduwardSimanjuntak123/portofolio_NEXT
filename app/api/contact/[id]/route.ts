import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — mark as read/unread
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: body.isRead },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal memperbarui pesan." }, { status: 500 });
  }
}

// DELETE — hapus pesan
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus pesan." }, { status: 500 });
  }
}
