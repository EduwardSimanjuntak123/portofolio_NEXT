import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update blog
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        cover: body.cover || null,
        content: body.content,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(blog);
  } catch (error: unknown) {
    console.error(error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ message: "Slug sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal mengubah blog." }, { status: 500 });
  }
}

// DELETE blog
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Blog berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus blog." }, { status: 500 });
  }
}
