import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [projectCount, skillCount, experienceCount, unreadCount, recentProjects, recentSkills, recentExperiences, recentMessages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.project.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, title: true, createdAt: true } }),
      prisma.skill.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, name: true, createdAt: true } }),
      prisma.experience.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, company: true, position: true, createdAt: true } }),
      prisma.contactMessage.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, name: true, subject: true, isRead: true, createdAt: true } }),
    ]);

    return NextResponse.json({
      stats: { projectCount, skillCount, experienceCount, unreadCount },
      recent: { recentProjects, recentSkills, recentExperiences, recentMessages },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data dashboard." }, { status: 500 });
  }
}
