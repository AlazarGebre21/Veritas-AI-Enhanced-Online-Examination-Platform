import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/index.js";

/**
 * Donut chart with a center label.
 * @param {{ data: Array<{ name: string, value: number, fill: string }>, title: string, centerLabel?: string, centerValue?: string|number, height?: number }} props
 */
export default function DonutChart({
  data = [],
  title,
  centerLabel,
  centerValue,
  height = 240,
  className = "bg-transparent border border-warm-gray-300 shadow-sm hover:border-notion-blue/50 transition-colors duration-200",
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length || total === 0) {
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

  return (
    <Card className={className}>
      <CardContent className="p-5">
        <h3 className="text-[14px] font-medium text-notion-black mb-1">{title}</h3>
        <div className="relative" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                animationDuration={800}
                animationBegin={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
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
                formatter={(value, name) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          {(centerLabel || centerValue !== undefined) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {centerValue !== undefined && (
                <span className="text-2xl font-medium text-notion-black">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="text-[13px] text-warm-gray-500 mt-0.5">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[12px] text-warm-gray-500">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: d.fill }}
              />
              <span>{d.name}</span>
              <span className="font-medium text-notion-black">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
