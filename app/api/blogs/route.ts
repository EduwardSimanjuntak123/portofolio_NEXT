import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET all blog posts
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data blog." }, { status: 500 });
  }
}

// POST create blog post
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug || slugify(body.title),
        cover: body.cover || null,
        content: body.content,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ message: "Slug sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal menambahkan blog." }, { status: 500 });
  }
}
