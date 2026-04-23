import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSidebar from "@/features/owner/components/OwnerSidebar";
import TerrainCard from "@/features/owner/components/TerrainCard";
import TerrainForm, {
  type TerrainFormValues,
} from "@/features/owner/components/TerrainForm";
import type { Terrain } from "@/features/owner/types/terrain";
import {
  createOwnerTerrain,
  getOwnerTerrains,
  type TerrainMutationInput,
} from "@/features/owner/services/terrainService";

const emptyTerrainFormValues: TerrainFormValues = {
  name: "",
  city: "",
  address: "",
  description: "",
  player_count: "",
  hour_price: "",
};

export default function OwnerTerrainsPage() {
  const navigate = useNavigate();

  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [playersFilter, setPlayersFilter] = useState("");

  const uniqueCities = useMemo(
    () =>
      Array.from(new Set(terrains.map((terrain) => terrain.city)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [terrains]
  );

  const filteredTerrains = useMemo(() => {
    const normalizedMaxPrice = Number(maxPriceFilter);
    const normalizedPlayers = Number(playersFilter);
    const hasPriceFilter = maxPriceFilter.trim() !== "";
    const hasPlayersFilter = playersFilter.trim() !== "";

    return terrains.filter((terrain) => {
      if (cityFilter !== "all" && terrain.city !== cityFilter) {
        return false;
      }

      if (
        hasPriceFilter &&
        (!Number.isFinite(normalizedMaxPrice) || terrain.hourPrice > normalizedMaxPrice)
      ) {
        return false;
      }

      if (
        hasPlayersFilter &&
        (!Number.isFinite(normalizedPlayers) || terrain.playerCount < normalizedPlayers)
      ) {
        return false;
      }

      return true;
    });
  }, [terrains, cityFilter, maxPriceFilter, playersFilter]);

  function openCreateModal() {
    setError(null);
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
  }

  function resetFilters() {
    setCityFilter("all");
    setMaxPriceFilter("");
    setPlayersFilter("");
  }

  function prepareTerrainPayload(
    values: TerrainFormValues
  ): TerrainMutationInput | null {
    const payload: TerrainMutationInput = {
      name: values.name.trim(),
      city: values.city.trim(),
      address: values.address.trim(),
      description: values.description.trim(),
      player_count: Number(values.player_count),
      hour_price: Number(values.hour_price),
    };

    if (!payload.name || !payload.city || !payload.address) {
      setError("Name, city and address are required.");
      return null;
    }

    if (!Number.isFinite(payload.player_count) || payload.player_count < 1) {
      setError("Player count must be at least 1.");
      return null;
    }

    if (!Number.isFinite(payload.hour_price) || payload.hour_price < 0) {
      setError("Hour price must be a valid positive value.");
      return null;
    }

    return payload;
  }

  const loadTerrains = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getOwnerTerrains();
      setTerrains(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleCreateTerrain(values: TerrainFormValues) {
    const payload = prepareTerrainPayload(values);
    if (!payload) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createOwnerTerrain(payload);
      closeCreateModal();
      await loadTerrains();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create terrain");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openTerrainDetails(terrain: Terrain) {
    navigate(`/owner/terrains/${terrain.id}`);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTerrains();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar />

        <main className="flex-1">
          <div className="border-b border-slate-800 bg-slate-950/40 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Terrains</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Manage your terrains in one simple place.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Create Terrain
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-medium text-blue-300 transition hover:text-blue-200"
                >
                  Reset
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Price Max (DH)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maxPriceFilter}
                    onChange={(event) => setMaxPriceFilter(event.target.value)}
                    placeholder="Ex: 300"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Ville
                  </label>
                  <select
                    value={cityFilter}
                    onChange={(event) => setCityFilter(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">All cities</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Players Min
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={playersFilter}
                    onChange={(event) => setPlayersFilter(event.target.value)}
                    placeholder="Ex: 10"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </section>

            {isLoading && <p className="text-slate-400">Loading terrains...</p>}

            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {!isLoading && !error && terrains.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-300">
                    Showing <span className="font-semibold">{filteredTerrains.length}</span>{" "}
                    of <span className="font-semibold">{terrains.length}</span>{" "}
                    terrains
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredTerrains.map((terrain) => (
                    <TerrainCard
                      key={terrain.id}
                      terrain={terrain}
                      onDetails={openTerrainDetails}
                    />
                  ))}
                </div>

                {filteredTerrains.length === 0 && (
                  <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-8 text-center">
                    <h3 className="text-lg font-semibold text-white">
                      No terrain matches your filters
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Try changing the price, ville or players filter.
                    </p>
                  </div>
                )}
              </section>
            )}

            {!isLoading && !error && terrains.length === 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-10 text-center">
                <h3 className="text-lg font-semibold text-white">No terrains found</h3>
                <p className="mt-2 text-sm text-slate-400">
                  You do not have any terrains yet.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Create your first terrain
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          onClick={closeCreateModal}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <TerrainForm
              mode="create"
              initialValues={emptyTerrainFormValues}
              isSubmitting={isSubmitting}
              onClose={closeCreateModal}
              onSubmit={handleCreateTerrain}
            />
          </div>
        </div>
      )}
    </div>
  );
}
