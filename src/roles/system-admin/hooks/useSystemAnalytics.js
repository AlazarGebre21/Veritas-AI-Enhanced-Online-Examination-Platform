import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Notion-inspired palette for chart segments.
 */
const CHART_COLORS = {
  blue:    "#0075de",
  teal:    "#2a9d99",
  orange:  "#d9730d",
  pink:    "#c14c8a",
  purple:  "#6940a5",
  green:   "#1aae39",
  red:     "#eb5757",
  brown:   "#96582a",
  gray:    "#a39e98",
  yellow:  "#cb912f",
};

const ENTERPRISE_STATUS_COLORS = {
  PendingApproval: CHART_COLORS.yellow,
  Active:          CHART_COLORS.green,
  Suspended:       CHART_COLORS.red,
  Deleted:         CHART_COLORS.gray,
};

const SUBSCRIPTION_STATUS_COLORS = {
  Trial:     CHART_COLORS.blue,
  Active:    CHART_COLORS.green,
  PastDue:   CHART_COLORS.orange,
  Cancelled: CHART_COLORS.red,
  Expired:   CHART_COLORS.gray,
};

const COLOR_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.teal,
  CHART_COLORS.orange,
  CHART_COLORS.pink,
  CHART_COLORS.purple,
  CHART_COLORS.green,
];

function countBy(arr, keyFn) {
  const counts = {};
  for (const item of arr) {
    const key = keyFn(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function toChartData(counts, colorMap) {
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    fill: colorMap?.[name] || COLOR_PALETTE[i % COLOR_PALETTE.length],
  }));
}

function groupByMonth(items, dateField) {
  const months = {};
  for (const item of items) {
    const d = item[dateField];
    if (!d) continue;
    const key = d.slice(0, 7);
    months[key] = (months[key] || 0) + 1;
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [y, m] = month.split("-");
      const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return { month: `${names[parseInt(m, 10) - 1]} ${y.slice(2)}`, count };
    });
}

/**
 * Consolidated analytics hook for the System Admin dashboard.
 * Fetches all enterprises and derives status/subscription breakdowns.
 */
export function useSystemAnalytics() {
  const enterprisesQuery = useQuery({
    queryKey: ["analytics", "all-enterprises"],
    queryFn: () => enterpriseApi.list({ limit: 1000, sort: "created_at", sort_dir: "desc" }),
    staleTime: 2 * 60 * 1000,
  });

  const analytics = useMemo(() => {
    const enterprises = enterprisesQuery.data?.data ?? [];
    if (!enterprises.length) return null;

    const statusCounts = countBy(enterprises, (e) => e.status);
    const statusData = toChartData(statusCounts, ENTERPRISE_STATUS_COLORS);

    const subCounts = countBy(enterprises, (e) => e.subscriptionStatus);
    const subscriptionData = toChartData(subCounts, SUBSCRIPTION_STATUS_COLORS);

    const timeline = groupByMonth(enterprises, "createdAt");

    const activeCount = enterprises.filter((e) => e.status === "Active").length;
    const pendingCount = enterprises.filter((e) => e.status === "PendingApproval").length;

    return {
      total: enterprises.length,
      activeCount,
      pendingCount,
      statusData,
      subscriptionData,
      timeline,
    };
  }, [enterprisesQuery.data]);

  return {
    isLoading: enterprisesQuery.isLoading,
    isError: enterprisesQuery.isError,
    analytics,
    CHART_COLORS,
  };
}
