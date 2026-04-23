type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  options: Option[];
};

export default function Select({ label, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <select className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-900 text-slate-100"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}