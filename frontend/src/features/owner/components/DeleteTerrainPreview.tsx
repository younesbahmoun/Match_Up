type DeleteTerrainPreviewProps = {
  terrainName: string;
};

export default function DeleteTerrainPreview({
  terrainName,
}: DeleteTerrainPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Delete Template
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">
        Delete terrain confirmation
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        This is a static preview of the delete step in the CRUD flow. No action
        is triggered here.
      </p>

      <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4">
        <p className="text-sm font-medium text-red-200">
          Are you sure you want to delete <span className="text-white">{terrainName}</span>?
        </p>
        <p className="mt-2 text-sm text-red-100/80">
          This template block is visual only and helps preview a real product
          confirmation pattern.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-xl border border-red-500/30 bg-red-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Delete Terrain
        </button>
      </div>
    </section>
  );
}
