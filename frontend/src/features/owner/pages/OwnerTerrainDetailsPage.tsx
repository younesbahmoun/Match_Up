import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OwnerSidebar from "@/features/owner/components/OwnerSidebar";
import TerrainForm, {
  type TerrainFormValues,
} from "@/features/owner/components/TerrainForm";
import type { Terrain } from "@/features/owner/types/terrain";
import {
  deleteOwnerTerrain,
  getOwnerTerrainById,
  updateOwnerTerrain,
  type TerrainMutationInput,
} from "@/features/owner/services/terrainService";

function toTerrainFormValues(terrain: Terrain): TerrainFormValues {
  return {
    name: terrain.name,
    city: terrain.city,
    address: terrain.address,
    description: terrain.description,
    player_count: String(terrain.playerCount),
    hour_price: String(terrain.hourPrice),
  };
}

function toTerrainPayload(values: TerrainFormValues): TerrainMutationInput | null {
  const payload: TerrainMutationInput = {
    name: values.name.trim(),
    city: values.city.trim(),
    address: values.address.trim(),
    description: values.description.trim(),
    player_count: Number(values.player_count),
    hour_price: Number(values.hour_price),
  };

  if (!payload.name || !payload.city || !payload.address) {
    return null;
  }

  if (!Number.isFinite(payload.player_count) || payload.player_count < 1) {
    return null;
  }

  if (!Number.isFinite(payload.hour_price) || payload.hour_price < 0) {
    return null;
  }

  return payload;
}

export default function OwnerTerrainDetailsPage() {
  const { terrainId } = useParams<{ terrainId: string }>();
  const navigate = useNavigate();

  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateTerrain(values: TerrainFormValues) {
    if (!terrain || !terrainId) {
      return;
    }

    const payload = toTerrainPayload(values);
    if (!payload) {
      setError("Please fill all required fields with valid values.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const updated = await updateOwnerTerrain(terrainId, payload);
      setTerrain(updated);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update terrain");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteTerrain() {
    if (!terrain || !terrainId) {
      return;
    }

    const hasConfirmed = window.confirm(
      `Delete "${terrain.name}"? This action cannot be undone.`
    );
    if (!hasConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);https://www.chess.com/game/167671221436
      setError(null);

      await deleteOwnerTerrain(terrainId);
      navigate("/owner/terrains", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete terrain");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    async function loadTerrain() {
      if (!terrainId) {
        setError("Missing terrain id.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await getOwnerTerrainById(terrainId);
        setTerrain(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load terrain details");
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadTerrain();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [terrainId]);

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar />

        <main className="flex-1">
          <div className="border-b border-slate-800 bg-slate-950/40 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Terrain Details</h2>
              <button
                type="button"
                onClick={() => navigate("/owner/terrains")}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Back to terrains
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {isLoading && <p className="text-slate-400">Loading terrain details...</p>}

            {error && (
              <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {!isLoading && terrain && (
              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                  <img
                    src={terrain.image}
                    alt={terrain.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{terrain.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {terrain.city} - {terrain.address}
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-blue-200/80">
                        Price / hour
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {terrain.hourPrice} <span className="text-sm">DH</span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                    {terrain.description || "No description available."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        Players
                      </p>
                      <p className="text-base font-semibold text-white">
                        {terrain.playerCount}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        City
                      </p>
                      <p className="text-base font-semibold text-white">{terrain.city}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(true)}
                      className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
                    >
                      Edit Terrain
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleDeleteTerrain}
                      className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Delete Terrain"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {showEditModal && terrain && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <TerrainForm
              key={`edit-${terrain.id}`}
              mode="edit"
              initialValues={toTerrainFormValues(terrain)}
              isSubmitting={isSubmitting}
              onClose={() => setShowEditModal(false)}
              onSubmit={handleUpdateTerrain}
            />
          </div>
        </div>
      )}
    </div>
  );
}
