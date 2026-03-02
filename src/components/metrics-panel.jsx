import { BarChart3, Globe2, LayoutList, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const metricCards = [
  {
    icon: Wallet,
    name: "revenue",
    description: "Overall revenue trend and period-over-period comparison.",
  },
  {
    icon: BarChart3,
    name: "revenue_by_category",
    description: "Category level revenue change, suitable for product mix analysis.",
  },
  {
    icon: Globe2,
    name: "revenue_by_region",
    description: "Regional performance shifts across the selected periods.",
  },
  {
    icon: LayoutList,
    name: "revenue_by_sub_category",
    description: "Granular revenue contribution deltas for sub-categories.",
  },
];

export function MetricsPanel() {
  return (
    <Card className="min-h-[620px]">
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Static reference list for the currently supported analytics metrics.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              className="rounded-3xl border border-line bg-white/80 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-accent-soft p-3 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{metric.name}</p>
                  <p className="text-sm text-slate-500">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
