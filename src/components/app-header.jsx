import { CloudLightning, Sparkles } from "lucide-react";

import { Badge } from "./ui/badge";
import { HealthPill } from "./health-pill";

export function AppHeader({ health, healthLoading }) {
  return (
    <header className="flex flex-col gap-4 rounded-[30px] border border-white/50 bg-white/70 px-6 py-5 shadow-soft backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-soft">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl text-ink">
              AI Business Insights Copilot
            </h1>
            <p className="text-sm text-slate-500">
              Premium analytics workspace for generating executive insights from
              your existing FastAPI services.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="accent">
          <CloudLightning className="h-3.5 w-3.5" />
          Local
        </Badge>
        <HealthPill health={health} loading={healthLoading} />
      </div>
    </header>
  );
}
