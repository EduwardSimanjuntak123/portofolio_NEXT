const skills = [
  "Laravel",
  "Flutter",
  "Python",
  "MySQL",
  "Docker",
  "Git",
  "REST API",
  "AI Agent",
];

export default function SkillsPage() {
  return (
    <section className="max-w-6xl mx-auto py-20">

      <h1 className="text-4xl font-bold mb-10">
        Skills
      </h1>

      <div className="grid md:grid-cols-4 gap-4">

        {skills.map((skill) => (
          <div
            key={skill}
            className="border rounded-lg p-4"
          >
            {skill}
          </div>
        ))}

      </div>

    </section>
  );
}