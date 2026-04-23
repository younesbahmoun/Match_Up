import type { ReactNode } from "react";

type OwnerPanelProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function OwnerPanel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: OwnerPanelProps) {
  return (
    <section
      className={`rounded-3xl border border-[#24314d] bg-[#181b23] p-5 shadow-[0_16px_40px_-28px_rgba(14,165,233,0.35)] ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}

      {children}
    </section>
  );
}
