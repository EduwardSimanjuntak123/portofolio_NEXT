const projects = [
  {
    title: "VokasiTera",
    desc: "Multi-Agent Academic System",
  },
  {
    title: "Rental Motor Kabupaten Toba",
    desc: "Rental Platform",
  },
  {
    title: "Seminar Management System",
    desc: "Academic Scheduling Platform",
  },
];

export default function ProjectsPage() {
  return (
    <section className="max-w-6xl mx-auto py-20">

      <h1 className="text-4xl font-bold mb-10">
        Projects
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {projects.map((project) => (
          <div
            key={project.title}
            className="border rounded-lg p-6"
          >
            <h2 className="font-bold text-xl">
              {project.title}
            </h2>

            <p className="mt-3">
              {project.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}