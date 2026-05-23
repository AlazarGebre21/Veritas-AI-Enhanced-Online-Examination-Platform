import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { examApi } from "@/lib/api/exams.api.js";
import { questionApi } from "@/lib/api/questions.api.js";
import { candidateApi } from "@/lib/api/candidates.api.js";
import { gradingApi } from "@/lib/api/grading.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Notion-inspired palette for chart segments.
 * Each color is chosen for visual contrast when side by side.
 */
const CHART_COLORS = {
  blue:       "#0075de",
  teal:       "#2a9d99",
  orange:     "#d9730d",
  pink:       "#c14c8a",
  purple:     "#6940a5",
  green:      "#1aae39",
  red:        "#eb5757",
  brown:      "#96582a",
  gray:       "#a39e98",
  yellow:     "#cb912f",
};

/** Ordered array for pie / donut chart slices */
const COLOR_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.teal,
  CHART_COLORS.orange,
  CHART_COLORS.pink,
  CHART_COLORS.purple,
  CHART_COLORS.green,
  CHART_COLORS.red,
  CHART_COLORS.brown,
  CHART_COLORS.yellow,
  CHART_COLORS.gray,
];

/** Specific status → color map for exam statuses */
const EXAM_STATUS_COLORS = {
  Draft:     CHART_COLORS.gray,
  Published: CHART_COLORS.blue,
  Active:    CHART_COLORS.green,
  Closed:    CHART_COLORS.orange,
  Archived:  CHART_COLORS.brown,
};

const DIFFICULTY_COLORS = {
  Easy:   CHART_COLORS.green,
  Medium: CHART_COLORS.orange,
  Hard:   CHART_COLORS.red,
};

const QUESTION_TYPE_COLORS = {
  MCQ:        CHART_COLORS.blue,
  TrueFalse:  CHART_COLORS.teal,
  ShortAnswer:CHART_COLORS.orange,
  Essay:      CHART_COLORS.purple,
};

// ─── Data Aggregation Helpers ───────────────────────────────────────────────

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

/**
 * Groups items by month (YYYY-MM) based on a date field.
 * Returns sorted array of { month, count }.
 */
function groupByMonth(items, dateField) {
  const months = {};
  for (const item of items) {
    const d = item[dateField];
    if (!d) continue;
    const key = d.slice(0, 7); // "2026-05"
    months[key] = (months[key] || 0) + 1;
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: formatMonthLabel(month),
      count,
    }));
}

function formatMonthLabel(ym) {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

/**
 * Builds a histogram from percentage values.
 * Buckets: 0-20, 20-40, 40-60, 60-80, 80-100
 */
function buildScoreDistribution(results, passingPercent = 50) {
  const buckets = [
    { range: "0–20%",   min: 0,  max: 20,  count: 0 },
    { range: "20–40%",  min: 20, max: 40,  count: 0 },
    { range: "40–60%",  min: 40, max: 60,  count: 0 },
    { range: "60–80%",  min: 60, max: 80,  count: 0 },
    { range: "80–100%", min: 80, max: 100, count: 0 },
  ];
  let passed = 0;
  let failed = 0;
  let totalPct = 0;

  for (const r of results) {
    const pct = r.percentage ?? 0;
    totalPct += pct;
    if (pct >= passingPercent) passed++;
    else failed++;
    for (const b of buckets) {
      if (pct >= b.min && pct < b.max) { b.count++; break; }
      if (b.max === 100 && pct === 100) { b.count++; break; }
    }
  }

  return {
    histogram: buckets.map((b, i) => ({
      range: b.range,
      count: b.count,
      fill: COLOR_PALETTE[i % COLOR_PALETTE.length],
    })),
    passFailData: [
      { name: "Passed", value: passed, fill: CHART_COLORS.green },
      { name: "Failed", value: failed, fill: CHART_COLORS.red },
    ],
    avgScore: results.length > 0 ? Math.round(totalPct / results.length) : 0,
    totalGraded: results.length,
    passed,
    failed,
  };
}

// ─── Analytics Query Keys ──────────────────────────────────────────────────

const analyticsKeys = {
  exams:      ["analytics", "exams"],
  questions:  ["analytics", "questions"],
  candidates: ["analytics", "candidates"],
  grading:    ["analytics", "grading"],
};

// ─── Main Hook ─────────────────────────────────────────────────────────────

/**
 * Consolidated analytics hook for the Enterprise Admin dashboard.
 * Fetches exams, questions, candidates, and grading results
 * and derives all chart-ready datasets.
 */
export function useAnalytics() {
  // Fetch large datasets for client-side aggregation
  const examsQuery = useQuery({
    queryKey: analyticsKeys.exams,
    queryFn: () => examApi.list({ limit: 1000, sort: "created_at", sort_dir: "desc" }),
    staleTime: 2 * 60 * 1000,
  });

  const questionsQuery = useQuery({
    queryKey: analyticsKeys.questions,
    queryFn: () => questionApi.list({ limit: 1000 }),
    staleTime: 2 * 60 * 1000,
  });

  const candidatesQuery = useQuery({
    queryKey: analyticsKeys.candidates,
    queryFn: () => candidateApi.list({ limit: 1000 }),
    staleTime: 2 * 60 * 1000,
  });

  const gradingQuery = useQuery({
    queryKey: analyticsKeys.grading,
    queryFn: () => gradingApi.listResults({ limit: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  // ── Derived Exam Analytics ──────────────────────────────────────────────

  const examAnalytics = useMemo(() => {
    const exams = examsQuery.data?.data ?? [];
    if (!exams.length) return null;

    const statusCounts = countBy(exams, (e) => e.status);
    const statusData = toChartData(statusCounts, EXAM_STATUS_COLORS);

    const timeline = groupByMonth(exams, "createdAt");

    const totalDuration = exams.reduce((s, e) => s + (e.durationMinutes || 0), 0);
    const avgDuration = Math.round(totalDuration / exams.length);
    const avgPassingScore = Math.round(
      exams.reduce((s, e) => s + (e.passingScorePercent || 0), 0) / exams.length
    );

    return {
      total: exams.length,
      statusData,
      timeline,
      avgDuration,
      avgPassingScore,
    };
  }, [examsQuery.data]);

  // ── Derived Question Analytics ──────────────────────────────────────────

  const questionAnalytics = useMemo(() => {
    const questions = questionsQuery.data?.data ?? [];
    if (!questions.length) return null;

    const typeCounts = countBy(questions, (q) => q.type);
    const typeData = toChartData(typeCounts, QUESTION_TYPE_COLORS);

    const diffCounts = countBy(questions, (q) => q.difficulty);
    const difficultyData = toChartData(diffCounts, DIFFICULTY_COLORS);

    const topicCounts = countBy(questions, (q) => q.topic);
    const topicData = toChartData(topicCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 topics

    return {
      total: questions.length,
      typeData,
      difficultyData,
      topicData,
    };
  }, [questionsQuery.data]);

  // ── Derived Candidate Analytics ─────────────────────────────────────────

  const candidateAnalytics = useMemo(() => {
    const candidates = candidatesQuery.data?.data ?? [];
    const total = candidatesQuery.data?.metadata?.total_elements ?? candidates.length;
    if (!candidates.length) return null;

    const timeline = groupByMonth(candidates, "createdAt");
    const activeCount = candidates.filter((c) => c.isActive).length;

    return {
      total,
      activeCount,
      inactiveCount: total - activeCount,
      timeline,
    };
  }, [candidatesQuery.data]);

  // ── Derived Grading Analytics ───────────────────────────────────────────

  const gradingAnalytics = useMemo(() => {
    const results = gradingQuery.data?.results ?? [];
    if (!results.length) return null;

    return buildScoreDistribution(results);
  }, [gradingQuery.data]);

  // ── Aggregate loading state ────────────────────────────────────────────

  const isLoading =
    examsQuery.isLoading ||
    questionsQuery.isLoading ||
    candidatesQuery.isLoading ||
    gradingQuery.isLoading;

  const isError =
    examsQuery.isError ||
    questionsQuery.isError ||
    candidatesQuery.isError ||
    gradingQuery.isError;

  return {
    isLoading,
    isError,
    examAnalytics,
    questionAnalytics,
    candidateAnalytics,
    gradingAnalytics,
    CHART_COLORS,
  };
}
