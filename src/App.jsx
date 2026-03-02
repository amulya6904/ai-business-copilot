import { motion } from "framer-motion";
import { Database, History, Rocket, Settings } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

import { AppHeader } from "./components/app-header";
import { AppSidebar } from "./components/app-sidebar";
import { InsightForm } from "./components/insight-form";
import { InsightOutput } from "./components/insight-output";
import { fetchHealth, normalizeApiError, requestInsight } from "./lib/api";
import { extractDriverSeries, extractKpis } from "./lib/insights";
import { clearHistory, loadHistory, pushHistory } from "./lib/storage";

const HistoryPanel = lazy(() => import("./components/history-panel").then((module) => ({ default: module.HistoryPanel })));
const MetricsPanel = lazy(() => import("./components/metrics-panel").then((module) => ({ default: module.MetricsPanel })));
const SettingsPanel = lazy(() => import("./components/settings-panel").then((module) => ({ default: module.SettingsPanel })));

const mobileNavItems = [
  { id: "generate", label: "Generate", icon: Rocket },
  { id: "metrics", label: "Metrics", icon: Database },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

function createEntry(request, response) {
  return {
    id: `${Date.now()}-${request.metric}`,
    createdAt: new Date().toISOString(),
    request,
    response,
  };
}

export default function App() {
  const [activeView, setActiveView] = useState("generate");
  const [collapsed, setCollapsed] = useState(false);
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [requestPayload, setRequestPayload] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());
  const [copied, setCopied] = useState(false);
  const [timings, setTimings] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setHealthLoading(true);
      try {
        const data = await fetchHealth();
        if (active) {
          setHealth(data);
        }
      } catch {
        if (active) {
          setHealth(null);
        }
      } finally {
        if (active) {
          setHealthLoading(false);
        }
      }
    }

    load();
    const interval = window.setInterval(load, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  async function handleSubmit(values) {
    setLoading(true);
    setError(null);
    setRequestPayload(values);

    try {
      const response = await requestInsight(values);
      setInsight(response.data);
      setTimings(response.timings);
      setHistory(pushHistory(createEntry(values, response.data)));
      setActiveView("generate");
    } catch (requestError) {
      setError(normalizeApiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleHistoryLoad(entry) {
    setRequestPayload(entry.request);
    setInsight(entry.response);
    setTimings(null);
    setError(null);
    setActiveView("generate");
  }

  function handleCopy(payload) {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const driverSeries = useMemo(() => extractDriverSeries(insight), [insight]);
  const kpis = useMemo(() => extractKpis(insight), [insight]);

  const panelFallback = (
    <div className="rounded-[28px] border border-line bg-white/80 p-8 text-sm text-slate-500 shadow-soft">
      Loading panel...
    </div>
  );

  return (
    <div className="min-h-screen bg-wash p-4 text-ink lg:p-6">
      <div className="mx-auto flex max-w-[1680px] gap-4 lg:gap-6">
        <AppSidebar
          activeView={activeView}
          collapsed={collapsed}
          onCollapse={() => setCollapsed((value) => !value)}
          onSelect={setActiveView}
        />

        <main className="min-w-0 flex-1 space-y-6">
          <AppHeader health={health} healthLoading={healthLoading} />

          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeView;
              return (
                <button
                  key={item.id}
                  className={
                    active
                      ? "flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft"
                      : "flex items-center gap-2 rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600"
                  }
                  onClick={() => setActiveView(item.id)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {copied ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full border border-success/10 bg-success-soft px-4 py-2 text-sm font-semibold text-success"
              initial={{ opacity: 0, y: -8 }}
            >
              Insight JSON copied to clipboard.
            </motion.div>
          ) : null}

          {activeView === "generate" ? (
            <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
              <InsightForm
                initialValues={requestPayload}
                loading={loading}
                onSubmit={handleSubmit}
              />
              <InsightOutput
                driverSeries={driverSeries}
                error={error}
                insight={insight}
                kpis={kpis}
                loading={loading}
                onCopy={handleCopy}
                onRunAgain={() => requestPayload && handleSubmit(requestPayload)}
                timings={timings}
              />
            </div>
          ) : null}

          {activeView === "history" ? (
            <Suspense fallback={panelFallback}>
              <HistoryPanel
                items={history}
                onClear={() => {
                  clearHistory();
                  setHistory([]);
                }}
                onLoad={handleHistoryLoad}
              />
            </Suspense>
          ) : null}

          {activeView === "metrics" ? (
            <Suspense fallback={panelFallback}>
              <MetricsPanel />
            </Suspense>
          ) : null}

          {activeView === "settings" ? (
            <Suspense fallback={panelFallback}>
              <SettingsPanel
                onClearHistory={() => {
                  clearHistory();
                  setHistory([]);
                }}
              />
            </Suspense>
          ) : null}
        </main>
      </div>
    </div>
  );
}
