import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET settings (single record)
export async function GET() {
  try {
    const setting = await prisma.setting.findFirst();
    return NextResponse.json(setting);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil pengaturan." }, { status: 500 });
  }
}

// PUT upsert settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const existing = await prisma.setting.findFirst();

    let setting;
    if (existing) {
      setting = await prisma.setting.update({
        where: { id: existing.id },
        data: {
          websiteTitle: body.websiteTitle,
          description: body.description,
          logo: body.logo || null,
          favicon: body.favicon || null,
          cv: body.cv || null,
          primaryColor: body.primaryColor || "#2563eb",
        },
      });
    } else {
      setting = await prisma.setting.create({
        data: {
          websiteTitle: body.websiteTitle,
          description: body.description,
          logo: body.logo || null,
          favicon: body.favicon || null,
          cv: body.cv || null,
          primaryColor: body.primaryColor || "#2563eb",
        },
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}
