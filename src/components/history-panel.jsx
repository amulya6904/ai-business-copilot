import { Clock3, RotateCcw, Trash2 } from "lucide-react";

import { formatTimestamp } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function HistoryPanel({ items, onLoad, onClear }) {
  return (
    <Card className="min-h-[620px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>History</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Stored in localStorage. The latest 10 successful runs are available
            here.
          </p>
        </div>
        <Button variant="ghost" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length ? (
          items.map((item) => (
            <button
              key={item.id}
              className="w-full rounded-3xl border border-line bg-white/80 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
              onClick={() => onLoad(item)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{item.response.title}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.request.metric} · {item.request.period_a_start} to{" "}
                    {item.request.period_a_end}
                  </p>
                </div>
                <Button variant="subtle" size="sm">
                  <RotateCcw className="h-4 w-4" />
                  Load
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                {formatTimestamp(item.createdAt)}
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-mist/70 p-8 text-center text-sm text-slate-500">
            No client-side history yet. Generate an insight and it will appear
            here automatically.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
