import { useState, type ChangeEvent, type FormEvent } from "react";

export type TerrainFormValues = {
  name: string;
  city: string;
  address: string;
  description: string;
  player_count: string;
  hour_price: string;
};

type TerrainFormProps = {
  mode: "create" | "edit";
  initialValues: TerrainFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TerrainFormValues) => void | Promise<void>;
};

export default function TerrainForm({
  mode,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: TerrainFormProps) {
  const [values, setValues] = useState<TerrainFormValues>(initialValues);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-[0_24px_70px_-35px_rgba(59,130,246,0.55)] backdrop-blur">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {mode === "create" ? "Create New Terrain" : "Edit Terrain"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode === "create"
            ? "Add the terrain information below."
            : "Update terrain information and save changes."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Terrain Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter terrain name"
              value={values.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              City
            </label>
            <input
              name="city"
              type="text"
              placeholder="Enter city"
              value={values.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="Enter full address"
              value={values.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Write a short description"
              value={values.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Player Count
            </label>
            <input
              name="player_count"
              type="number"
              min={1}
              placeholder="Ex: 10"
              value={values.player_count}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Hour Price (DH)
            </label>
            <input
              name="hour_price"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 250"
              value={values.hour_price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Terrain"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
