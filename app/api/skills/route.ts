import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===============================
// GET ALL SKILLS
// ===============================
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data skill.",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// CREATE SKILL
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        percentage: Number(body.percentage),
        icon: body.icon,
      },
    });

    return NextResponse.json(skill, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menambahkan skill.",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// UPDATE SKILL
// ===============================
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          message: "ID wajib dikirim.",
        },
        {
          status: 400,
        }
      );
    }

    const updated = await prisma.skill.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        category: body.category,
        percentage: Number(body.percentage),
        icon: body.icon,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengubah skill.",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// DELETE SKILL
// ===============================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          message: "ID wajib dikirim.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.skill.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Skill berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menghapus skill.",
      },
      {
        status: 500,
      }
    );
  }
}