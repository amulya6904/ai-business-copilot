import { cn } from "../../lib/utils";

const styles = {
  neutral: "bg-white text-slate-600 border border-line",
  success: "bg-success-soft text-success border border-success/10",
  warning: "bg-warning-soft text-warning border border-warning/10",
  danger: "bg-danger-soft text-danger border border-danger/10",
  accent: "bg-accent-soft text-accent border border-accent/10",
};

export function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
