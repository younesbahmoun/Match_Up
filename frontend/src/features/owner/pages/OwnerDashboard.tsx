import OwnerSidebar from "@/features/owner/components/OwnerSidebar";

const upcomingMatches = [
  {
    id: "m-001",
    teamA: "Atlas Lions",
    teamB: "City Stars",
    date: "Friday, 19:00",
    terrain: "Elite Arena",
  },
  {
    id: "m-002",
    teamA: "Blue Hunters",
    teamB: "Rabat Club",
    date: "Saturday, 21:00",
    terrain: "Victory Field",
  },
  {
    id: "m-003",
    teamA: "North Eagles",
    teamB: "Orange FC",
    date: "Sunday, 18:30",
    terrain: "Champions Club",
  },
];

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar />

        <main className="flex-1">
          <div className="border-b border-slate-800 bg-slate-950/40 px-4 py-5 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">Owner Dashboard</h2>
            <p className="mt-1 text-sm text-slate-300">
              Quick view of upcoming matches.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-lg font-semibold text-white">Upcoming Matches</h3>

              <div className="mt-4 space-y-3">
                {upcomingMatches.map((match) => (
                  <article
                    key={match.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {match.teamA} vs {match.teamB}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {match.date} - {match.terrain}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
