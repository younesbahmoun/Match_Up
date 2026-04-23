import type { ReactNode } from "react";

type OwnerEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function OwnerEmptyState({
  title,
  description,
  action,
}: OwnerEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-[#2b3856] bg-[#151922] px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
