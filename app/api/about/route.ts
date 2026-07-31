import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    return NextResponse.json(about);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const about = await prisma.about.create({ data: body });
    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan data." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const about = await prisma.about.findFirst();

    const data = {
      fullName: body.fullName,
      title: body.title,
      description: body.description,
      photo: body.photo || null,
      resume: body.resume || null,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      github: body.github || null,
      linkedin: body.linkedin || null,
      instagram: body.instagram || null,
      website: body.website || null,
    };

    let updated;
    if (about) {
      updated = await prisma.about.update({ where: { id: about.id }, data });
    } else {
      updated = await prisma.about.create({ data });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan data." }, { status: 500 });
  }
}