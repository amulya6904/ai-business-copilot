import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-ink text-white shadow-soft hover:bg-[#0b1e37] focus-visible:ring-2 focus-visible:ring-accent/50",
  secondary:
    "bg-white text-ink border border-line hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-accent/30",
  ghost:
    "bg-transparent text-slate-600 hover:bg-white/80 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/30",
  subtle:
    "bg-accent-soft text-accent hover:bg-[#d7e6ff] focus-visible:ring-2 focus-visible:ring-accent/30",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-sm",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
