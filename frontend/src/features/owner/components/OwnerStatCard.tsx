import type { ReactNode } from "react";

type Accent = "green" | "blue" | "orange" | "slate";

type OwnerStatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: Accent;
};

const accentClasses: Record<Accent, string> = {
  green: "bg-emerald-500/15 text-emerald-300",
  blue: "bg-sky-500/15 text-sky-300",
  orange: "bg-orange-500/15 text-orange-300",
  slate: "bg-slate-700/70 text-slate-200",
};

export default function OwnerStatCard({
  icon,
  label,
  value,
  accent = "green",
}: OwnerStatCardProps) {
  return (
    <article className="rounded-3xl border border-[#24314d] bg-[#1b1f27] p-5">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
    </article>
  );
}
