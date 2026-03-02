import { DatabaseZap, Globe, History, ShieldCheck } from "lucide-react";

import { API_BASE_URL } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function SettingsPanel({ onClearHistory }) {
  const entries = [
    {
      icon: Globe,
      title: "API Base URL",
      value: API_BASE_URL,
    },
    {
      icon: History,
      title: "History storage",
      value: "localStorage only",
    },
    {
      icon: DatabaseZap,
      title: "Backend contract",
      value: "Uses /health and POST /copilot/insight unchanged",
    },
    {
      icon: ShieldCheck,
      title: "Validation",
      value: "Client-side only via react-hook-form + zod",
    },
  ];

  return (
    <Card className="min-h-[620px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          UI-only controls and runtime references. No backend config is modified
          here.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <div
              key={entry.title}
              className="flex items-start gap-4 rounded-3xl border border-line bg-white/80 p-5"
            >
              <span className="rounded-2xl bg-accent-soft p-3 text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 text-sm text-slate-500">{entry.value}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-2">
          <Button variant="secondary" onClick={onClearHistory}>
            Clear local history
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
