export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto py-20">

      <h1 className="text-4xl font-bold mb-10">
        Contact Me
      </h1>

      <form className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
        />

        <textarea
          rows={5}
          placeholder="Message"
          className="w-full border p-3 rounded"
        />

        <button
          className="bg-black text-white px-6 py-3 rounded"
        >
          Send
        </button>

      </form>

    </section>
  );
}