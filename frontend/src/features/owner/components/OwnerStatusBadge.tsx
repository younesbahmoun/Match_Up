import type { ReservationStatus } from "@/features/owner/types/reservation";

type OwnerStatusBadgeProps = {
  status: ReservationStatus;
};

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  confirmed: {
    label: "Confirmed",
    className: "border-emerald-500/25 bg-emerald-500/15 text-emerald-300",
  },
  pending_payment: {
    label: "Pending",
    className: "border-amber-500/25 bg-amber-500/15 text-amber-300",
  },
  expired: {
    label: "Expired",
    className: "border-rose-500/25 bg-rose-500/15 text-rose-300",
  },
  payment_failed: {
    label: "Failed",
    className: "border-rose-500/25 bg-rose-500/15 text-rose-300",
  },
};

export default function OwnerStatusBadge({ status }: OwnerStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "border-slate-700 bg-slate-800 text-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
