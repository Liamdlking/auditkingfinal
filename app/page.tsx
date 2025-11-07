import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-white border-b">
        <div className="container-max py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">👑</span>
              </div>
              <span className="text-2xl font-extrabold">Audit King</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3">Audit & Inspection checksheets</h1>
            <p className="text-gray-600 mb-6">
              Create templates, run inspections, collaborate in real time, export branded PDFs.
            </p>
            <div className="flex gap-3">
              <Link href="/login" className="btn">Sign in</Link>
              <a href="#screens" className="btn-secondary">See screenshots</a>
            </div>
          </div>
          <div className="flex-1">
            <div id="screens" className="card p-4">
              <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                Dashboard / Templates / Inspections
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
