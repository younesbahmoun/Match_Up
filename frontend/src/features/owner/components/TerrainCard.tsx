export type Terrain = {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  playerCount: number;
  hourPrice: number;
  image: string;
};

type TerrainCardProps = {
  terrain: Terrain;
  onDetails?: (terrain: Terrain) => void;
};

export default function TerrainCard({
  terrain,
  onDetails,
}: TerrainCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-[0_12px_28px_-20px_rgba(59,130,246,0.7)] transition hover:-translate-y-1 hover:border-blue-500/40">
      <div className="relative h-40 w-full overflow-hidden bg-slate-800">
        <img
          src={terrain.image}
          alt={terrain.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/35 to-transparent" />

        <div className="absolute left-3 top-3 rounded-xl border border-blue-300/30 bg-blue-500/15 px-3 py-1.5 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100/80">
            Price / Hour
          </p>
          <p className="mt-0.5 text-xl font-extrabold leading-none text-white">
            {terrain.hourPrice}
            <span className="ml-1 text-xs font-semibold text-blue-100">DH</span>
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">{terrain.name}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {terrain.city} - {terrain.address}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-400">
          {terrain.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Players
            </p>
            <p className="text-sm font-semibold text-white">
              {terrain.playerCount}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              City
            </p>
            <p className="text-sm font-semibold text-white">
              {terrain.city}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => onDetails?.(terrain)}
            className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
