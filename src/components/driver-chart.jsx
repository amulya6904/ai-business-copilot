import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const colors = ["#1565d8", "#2890ff", "#0f9f6e", "#2bb5a8", "#6a95ff", "#f2a93b"];

export function DriverChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Driver Deltas</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Derived from the returned `key_drivers` payload.
        </p>
      </CardHeader>
      <CardContent className="h-[320px]">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 18, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf7" />
              <XAxis type="number" tick={{ fill: "#6b7b93", fontSize: 12 }} />
              <YAxis
                dataKey="label"
                type="category"
                tick={{ fill: "#334e68", fontSize: 12 }}
                width={160}
              />
              <Tooltip
                cursor={{ fill: "rgba(21,101,216,0.06)" }}
                formatter={(value) => [`${value}`, "Delta"]}
              />
              <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.label}-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-line bg-mist/70 px-6 text-center text-sm text-slate-500">
            No numeric driver deltas were found in the response. The card will
            populate automatically when the returned `key_drivers` include
            parseable deltas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
