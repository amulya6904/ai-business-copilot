import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        "glass panel-border rounded-[28px] bg-white/85 shadow-panel",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("border-b border-line/70 px-6 py-5", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h2 className={cn("text-lg font-bold tracking-tight text-ink", className)}>
      {children}
    </h2>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}
