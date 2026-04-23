type OwnerTopbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M12 4a4 4 0 0 0-4 4v2.2c0 .7-.2 1.4-.6 2l-1 1.5A1.5 1.5 0 0 0 7.7 16h8.6a1.5 1.5 0 0 0 1.3-2.3l-1-1.5c-.4-.6-.6-1.3-.6-2V8a4 4 0 0 0-4-4Z"        d="M12 4a4 4 0 0 0-4 4v2.2c0 .7-.2 1.4-.6 2l-1 1.5A1.5 1.5 0 0 0 7.7 16h8.6a1.5 1.5 0 0 0 1.3-2.3l-1-1.5c-.4-.6-.6-1.3-.6-2V8a4 4 0 0 0-4-4Z"

        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 18a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M10.3 3.3a1 1 0 0 1 1.4 0l.7.7c.4.4 1 .5 1.5.4l1-.3a1 1 0 0 1 1.2.7l.2.9c.1.5.5 1 1 1.2l.9.4a1 1 0 0 1 .5 1.3l-.4 1c-.2.5-.2 1.1 0 1.6l.4 1a1 1 0 0 1-.5 1.3l-.9.4c-.5.2-.9.7-1 1.2l-.2.9a1 1 0 0 1-1.2.7l-1-.3c-.5-.1-1.1 0-1.5.4l-.7.7a1 1 0 0 1-1.4 0l-.7-.7a1.8 1.8 0 0 0-1.5-.4l-1 .3a1 1 0 0 1-1.2-.7l-.2-.9c-.1-.5-.5-1-1-1.2l-.9-.4a1 1 0 0 1-.5-1.3l.4-1c.2-.5.2-1.1 0-1.6l-.4-1a1 1 0 0 1 .5-1.3l.9-.4c.5-.2.9-.7 1-1.2l.2-.9a1 1 0 0 1 1.2-.7l1 .3c.5.1 1.1 0 1.5-.4l.7-.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function OwnerTopbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
}: OwnerTopbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#222a3c] px-6 py-4">
      {onSearchChange ? (
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 rounded-2xl border border-[#273250] bg-[#1b2740] px-4 py-2.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="m20 20-4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3 text-slate-300">
        <button
          type="button"
          className="rounded-xl border border-[#273250] bg-[#151b28] p-2.5 transition hover:bg-[#1b2232]"
        >
          <IconBell />
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#273250] bg-[#151b28] p-2.5 transition hover:bg-[#1b2232]"
        >
          <IconSettings />
        </button>
      </div>
    </div>
  );
}
