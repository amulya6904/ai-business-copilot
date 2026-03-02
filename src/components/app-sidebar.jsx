import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  History,
  Rocket,
  Settings,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const items = [
  { id: "generate", label: "Generate Insight", icon: Rocket },
  { id: "metrics", label: "Metrics", icon: Database },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ activeView, collapsed, onCollapse, onSelect }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 96 : 272 }}
      className="glass panel-border scrollbar-thin hidden h-[calc(100vh-48px)] shrink-0 overflow-y-auto rounded-[30px] bg-white/75 p-4 shadow-panel lg:flex lg:flex-col"
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        {!collapsed ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Workspace
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Insight orchestration console
            </p>
          </div>
        ) : (
          <div />
        )}
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeView;
          return (
            <button
              key={item.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200",
                active
                  ? "bg-ink text-white shadow-soft"
                  : "text-slate-600 hover:bg-white hover:text-ink",
              )}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed ? (
                <span className="text-sm font-semibold">{item.label}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-line/80 bg-mist/80 p-4">
        {!collapsed ? (
          <>
            <p className="text-sm font-semibold text-ink">Design note</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The UI stays client-only. History, helper ranges, downloads, and
              charting do not change the backend contract.
            </p>
          </>
        ) : (
          <span className="flex justify-center text-slate-400">...</span>
        )}
      </div>
    </motion.aside>
  );
}
