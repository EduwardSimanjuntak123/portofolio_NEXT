import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.about.create({
    data: {
      fullName: "Eduward Gilbert Simanjuntak",
      title: "Software Engineer & AI Developer",
      description: "Passionate in building Web, Mobile, and AI Applications.",

      email: "eduward@email.com",

      github: "https://github.com/eduward",
      linkedin: "https://linkedin.com/in/eduward",
      instagram: "https://instagram.com/eduward"
    }
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });