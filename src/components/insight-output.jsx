import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clipboard,
  Download,
  Play,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Suspense, lazy } from "react";

import { downloadJson } from "../lib/utils";
import { KpiGrid } from "./kpi-grid";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const DriverChart = lazy(() =>
  import("./driver-chart").then((module) => ({ default: module.DriverChart })),
);

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-10 w-4/5 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-3xl border border-line bg-slate-100"
          />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-3xl border border-line bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-danger/15 bg-danger-soft/60 px-8 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-danger shadow-soft">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h3 className="mt-6 text-xl font-bold text-ink">Insight generation failed</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Status: <span className="font-semibold">{error.status}</span>. {error.message}
      </p>
      {error.body ? (
        <pre className="mt-4 max-w-full overflow-x-auto rounded-3xl border border-white/60 bg-white/80 px-5 py-4 text-left text-xs leading-6 text-slate-500">
          {error.body}
        </pre>
      ) : null}
      <div className="mt-4 rounded-3xl border border-white/60 bg-white/70 px-5 py-4 text-sm text-slate-500">
        Suggestion: confirm the backend is running, then check `/health` to see
        whether the database and Ollama are both available.
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-dashed border-line bg-mist/70 px-8 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-accent shadow-soft">
        <Sparkles className="h-7 w-7" />
      </span>
      <h3 className="mt-6 text-xl font-bold text-ink">No insight yet</h3>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
        Fill out the builder on the left and generate an insight. The executive
        narrative, chart, actions, and risks will appear here.
      </p>
    </div>
  );
}

export function InsightOutput({
  insight,
  loading,
  error,
  onRunAgain,
  onCopy,
  driverSeries,
  kpis,
  timings,
}) {
  return (
    <div className="space-y-5">
      <Card className="min-h-[620px]">
        <CardHeader className="flex flex-col gap-4 border-b border-line/70 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <CardTitle>Insight Output</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              A polished view over the existing API response. No server behavior
              is modified.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!insight}
              onClick={() => insight && onCopy(insight)}
              variant="secondary"
            >
              <Clipboard className="h-4 w-4" />
              Copy
            </Button>
            <Button
              disabled={!insight}
              onClick={() =>
                insight &&
                downloadJson(
                  `insight-${Date.now()}.json`,
                  insight,
                )
              }
              variant="secondary"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
            <Button disabled={!insight || loading} onClick={onRunAgain} variant="ghost">
              <Play className="h-4 w-4" />
              Run again
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? <LoadingState /> : null}
          {!loading && error ? <ErrorState error={error} /> : null}
          {!loading && !error && !insight ? <EmptyState /> : null}
          {!loading && !error && insight ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Executive summary
                </p>
                <h3 className="text-3xl font-bold tracking-tight text-ink">
                  {insight.title}
                </h3>
                <p className="max-w-3xl text-sm leading-7 text-slate-500">
                  {insight.summary}
                </p>
                {timings?.deltaSeconds || timings?.llmSeconds ? (
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    {timings.deltaSeconds ? (
                      <span className="rounded-full border border-line bg-white px-3 py-1">
                        Delta: {timings.deltaSeconds}s
                      </span>
                    ) : null}
                    {timings.llmSeconds ? (
                      <span className="rounded-full border border-line bg-white px-3 py-1">
                        LLM: {timings.llmSeconds}s
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <KpiGrid items={kpis} />

              <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink">Key Drivers</p>
                  <div className="grid gap-3">
                    {insight.key_drivers?.length ? (
                      insight.key_drivers.map((driver) => (
                        <div
                          key={driver}
                          className="rounded-3xl border border-line bg-white/85 px-4 py-4 shadow-soft"
                        >
                          <p className="text-sm font-medium leading-6 text-ink">
                            {driver}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-line bg-mist/70 px-5 py-6 text-sm text-slate-500">
                        No key drivers were returned.
                      </div>
                    )}
                  </div>
                </div>

                <Suspense
                  fallback={
                    <div className="rounded-[28px] border border-line bg-white/85 p-6 text-sm text-slate-500 shadow-soft">
                      Loading chart...
                    </div>
                  }
                >
                  <DriverChart data={driverSeries} />
                </Suspense>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-line bg-white/85 p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-success-soft p-3 text-success">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">Actions</p>
                      <p className="text-sm text-slate-500">
                        Next steps derived from the returned insight JSON.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {insight.actions?.length ? (
                      insight.actions.map((action) => (
                        <div
                          key={action}
                          className="rounded-3xl border border-line bg-mist/70 px-4 py-4 text-sm leading-6 text-ink"
                        >
                          {action}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-line bg-mist/70 px-4 py-5 text-sm text-slate-500">
                        No actions were returned.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-line bg-white/85 p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-warning-soft p-3 text-warning">
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">Risks</p>
                      <p className="text-sm text-slate-500">
                        Framed as decision-maker considerations for the same
                        insight payload.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {insight.risks?.length ? (
                      insight.risks.map((risk) => (
                        <div
                          key={risk}
                          className="rounded-3xl border border-line bg-mist/70 px-4 py-4 text-sm leading-6 text-ink"
                        >
                          {risk}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-line bg-mist/70 px-4 py-5 text-sm text-slate-500">
                        No risks were returned.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
