import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/index.js";

/**
 * Gradient area chart card.
 * @param {{ data: Array<{ [key]: string|number }>, title: string, dataKey: string, xKey: string, color?: string, height?: number, subtitle?: string }} props
 */
export default function AreaChartCard({
  data = [],
  title,
  subtitle,
  dataKey = "count",
  xKey = "month",
  color = "#0075de",
  height = 220,
  className = "bg-transparent border border-warm-gray-300 shadow-sm hover:border-notion-blue/50 transition-colors duration-200",
}) {
  if (!data.length) {
    return (
      <Card className={className}>
        <CardContent className="p-5">
          <h3 className="text-[14px] font-medium text-notion-black mb-3">{title}</h3>
          <div className="flex items-center justify-center text-warm-gray-300 text-[13px]" style={{ height }}>
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const gradientId = `area-gradient-${title.replace(/\s/g, "")}`;

  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[14px] font-medium text-notion-black">{title}</h3>
          {subtitle && (
            <span className="text-[12px] text-warm-gray-500">{subtitle}</span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xKey}
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
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
