import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function KpiGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const positive = item.label === "Delta" || item.label === "Change";
        const Icon = positive ? TrendingUp : TrendingDown;

        return (
          <Card key={item.label} className="overflow-hidden">
            <CardHeader className="border-b-0 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{item.label}</CardTitle>
                <span className="rounded-2xl bg-white p-2 text-accent shadow-soft">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-2xl font-bold tracking-tight text-ink">
                {item.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
