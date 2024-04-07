"use client";
import { LineChart, LineChartProps } from "@tremor/react";

const Chart: React.FC<Pick<LineChartProps, "data">> = ({ data }) => {
  const minValue = Math.min(...data.map((d) => d["Water Temperature"]));
  return (
    <LineChart
      className="h-36 -mx-4"
      data={data}
      index="date"
      categories={["Water Temperature"]}
      valueFormatter={(value) => `${value.toFixed(1)} °F`}
      minValue={minValue - 5}
      showLegend={false}
    />
  );
};
export default Chart;
