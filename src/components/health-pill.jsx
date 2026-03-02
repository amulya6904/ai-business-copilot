import { Activity, CheckCircle2, ServerCrash, TriangleAlert } from "lucide-react";

import { Badge } from "./ui/badge";

export function HealthPill({ health, loading }) {
  if (loading) {
    return <Badge tone="neutral">Health: checking</Badge>;
  }

  if (!health) {
    return (
      <Badge tone="warning">
        <TriangleAlert className="h-3.5 w-3.5" />
        Health: unknown
      </Badge>
    );
  }

  const tone = health.status === "ok" ? "success" : "warning";
  const Icon = health.status === "ok" ? CheckCircle2 : ServerCrash;

  return (
    <Badge tone={tone}>
      <Icon className="h-3.5 w-3.5" />
      Health: {health.status === "ok" ? "OK" : "Degraded"}
      <Activity className="ml-1 h-3.5 w-3.5" />
    </Badge>
  );
}
