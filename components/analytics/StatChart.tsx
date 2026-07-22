"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactNumber } from "@/lib/utils/format";

export interface ChartDatum {
  capturedAt: string;
  value: number | null;
  movingAvg?: number | null;
}

export function StatChart({
  data,
  color,
  label,
  showMovingAvg = false,
}: {
  data: ChartDatum[];
  color: string;
  label: string;
  showMovingAvg?: boolean;
}) {
  if (data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-white/40">
        Not enough data yet — check back after a few ingestion runs.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="capturedAt"
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
          stroke="rgba(255,255,255,0.3)"
          fontSize={12}
          minTickGap={30}
        />
        <YAxis
          stroke="rgba(255,255,255,0.3)"
          fontSize={12}
          tickFormatter={(v) => formatCompactNumber(v)}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(v) => new Date(v as string).toLocaleString()}
          formatter={(value) => formatCompactNumber(Number(value))}
        />
        {showMovingAvg && <Legend wrapperStyle={{ fontSize: 12 }} />}
        <Line
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
        {showMovingAvg && (
          <Line
            type="monotone"
            dataKey="movingAvg"
            name="7-point moving avg"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
