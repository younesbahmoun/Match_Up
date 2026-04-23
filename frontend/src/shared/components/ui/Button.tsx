const variants = {
  blue: "bg-indigo-600 hover:bg-indigo-500",
  red: "bg-red-600 hover:bg-red-500",
  green: "bg-green-600 hover:bg-green-500",
  yellow: "bg-yellow-600 hover:bg-yellow-500",
};

type Variant = keyof typeof variants; // "blue" | "red" | "green" | "yellow"

// type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   children: React.ReactNode;
//   type?: "button" | "submit" | "reset";
//   disabled?: boolean;
//   variant?: Variant;
// };

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  children,
  type = "button",
  variant = "blue",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl px-4 py-3 font-semibold text-white transition active:scale-[0.99] ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}