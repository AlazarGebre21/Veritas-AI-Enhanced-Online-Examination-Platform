import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/index.js";

/**
 * Bar chart card with per-bar colors.
 * @param {{ data: Array<{ name: string, value: number, fill?: string }>, title: string, layout?: 'vertical'|'horizontal', height?: number, barKey?: string, categoryKey?: string, color?: string, subtitle?: string }} props
 */
export default function BarChartCard({
  data = [],
  title,
  subtitle,
  layout = "horizontal",
  height = 240,
  barKey = "value",
  categoryKey = "name",
  color = "#0075de",
}) {
  if (!data.length) {
    return (
      <Card className="bg-transparent shadow-sm border border-warm-gray-300">
        <CardContent className="p-5">
          <h3 className="text-[14px] font-medium text-notion-black mb-3">{title}</h3>
          <div className="flex items-center justify-center text-warm-gray-300 text-[13px]" style={{ height }}>
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const isVertical = layout === "vertical";

  return (
    <Card className="bg-transparent border border-warm-gray-300 shadow-sm hover:border-notion-blue/50 transition-colors duration-200">
      <CardContent className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[14px] font-medium text-notion-black">{title}</h3>
          {subtitle && (
            <span className="text-[12px] text-warm-gray-500">{subtitle}</span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
            margin={
              isVertical
                ? { top: 4, right: 16, bottom: 0, left: 0 }
                : { top: 4, right: 8, bottom: 0, left: -20 }
            }
          >
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" horizontal={!isVertical} vertical={isVertical} />
            {isVertical ? (
              <>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#a39e98" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey={categoryKey}
                  tick={{ fontSize: 11, fill: "#a39e98" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={categoryKey}
                  tick={{ fontSize: 11, fill: "#a39e98" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a39e98" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.85)",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#fff",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar
              dataKey={barKey}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill || color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
