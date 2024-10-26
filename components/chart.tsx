"use client";

import React from "react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

type HistoricalRecord = {
  date: string;
  waterTemperature: number;
};

type HistoryChartProps = {
  historicalData: HistoricalRecord[];
};

const HistoryChart: React.FC<HistoryChartProps> = ({ historicalData }) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] min-w-[200px]"
    >
      <LineChart
        data={historicalData}
        height={200}
        width={400}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          dataKey="waterTemperature"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value.toFixed(0)}°F`}
          domain={["dataMin", "dataMax"]}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => `${Number(value).toFixed(1)}°F`}
            />
          }
        />

        <Line
          dataKey="waterTemperature"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default HistoryChart;
