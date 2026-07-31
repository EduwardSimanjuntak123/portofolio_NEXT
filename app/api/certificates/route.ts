import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: "desc" },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data sertifikat." }, { status: 500 });
  }
}

// POST create certificate
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const certificate = await prisma.certificate.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        issueDate: new Date(body.issueDate),
        credential: body.credential || null,
        image: body.image || null,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan sertifikat." }, { status: 500 });
  }
}
