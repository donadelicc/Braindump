import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-8xl font-bold text-deep-sea mb-8">BRAIN DUMP</h1>

        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ta opp en brainstorming økt, og få strukturert analyse med
            kategoriserte innsikter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🎤</div>
              <h3 className="font-semibold text-gray-800 mb-2">Ta opp lyd</h3>
              <p className="text-gray-600 text-sm">
                Last opp lydfiler eller ta opp lyd direkte i appen.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Transkriber diskusjonen
              </h3>
              <p className="text-gray-600 text-sm">
                Få nøyaktige transkripsjoner med norsk språkstøtte.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Generer strukturert innsikt
              </h3>
              <p className="text-gray-600 text-sm">
                AI-drevet analyse med kategorier og innsikter.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/brain-dump"
          className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Start DUMP
        </Link>
      </div>
    </div>
  );
}
