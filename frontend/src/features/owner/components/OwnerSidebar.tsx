import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

type SidebarItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "My Terrains",
    to: "/owner/terrains",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 7.5 12 12l9-4.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Dashboard",
    to: "/owner/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="13"
          y="10"
          width="8"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
];

export default function OwnerSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="group/sidebar w-full border-b border-slate-800 bg-[#0b1528] text-slate-100 lg:w-20 lg:border-r lg:border-b-0 lg:hover:w-72 lg:transition-all lg:duration-300">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-4 lg:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/35 bg-blue-500/20 text-blue-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path
              d="M4 14.5 12 5l8 9.5M7 12.5V19h10v-6.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover/sidebar:max-w-[180px] lg:group-hover/sidebar:opacity-100">
          MatchUp
        </h1>
      </div>

      <div className="px-4 py-6">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover/sidebar:max-w-[180px] lg:group-hover/sidebar:opacity-100">
          Owner space
        </p>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-500/20 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`
              }
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100">
                {item.icon}
              </span>
              <span className="text-sm lg:max-w-0 lg:overflow-hidden lg:whitespace-nowrap lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover/sidebar:max-w-[150px] lg:group-hover/sidebar:opacity-100">
                {item.label}
              </span>
            </NavLink>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M10 17 15 12l-5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12H4m8 8h4a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm lg:max-w-0 lg:overflow-hidden lg:whitespace-nowrap lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover/sidebar:max-w-[150px] lg:group-hover/sidebar:opacity-100">
              Logout
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
