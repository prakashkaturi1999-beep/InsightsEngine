"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";

type Props = {
  data: number[];
  color: string;
};

export function Sparkline({ data, color }: Props) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 6, bottom: 6, left: 0, right: 0 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

