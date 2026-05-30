import { Card, CardContent, Skeleton } from "@/components/ui/index.js";

/**
 * Stat card with an icon and optional trend indicator.
 * @param {{ icon: React.ElementType, label: string, value: string|number, color?: string, trend?: string, isLoading?: boolean }} props
 */
export default function MiniStatCard({
  icon: Icon,
  label,
  value,
  color = "#0075de",
  trend,
  isLoading,
}) {
  return (
    <Card className="bg-transparent border border-warm-gray-300 shadow-sm hover:border-notion-blue/50 transition-colors duration-200">
      <CardContent className="flex items-center p-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-warm-gray-500 truncate">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-6 w-12 mt-0.5" />
          ) : (
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-xl font-normal text-notion-black">{value ?? "—"}</h4>
              {trend && (
                <span className="text-[12px] font-medium text-success">{trend}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
