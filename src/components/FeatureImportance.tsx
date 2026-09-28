import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART, TOOLTIP_STYLE, type BtcAdaptResults } from "@/lib/btc-adapt";

const FEATURE_LABELS: Record<string, string> = {
  volatility_7: "7-Day Volatility",
  volatility_30: "30-Day Volatility",
  momentum_14: "14-Day Momentum",
  rsi_14: "RSI",
  trend_slope_30: "Trend Strength",
  macd: "MACD Signal",
  lag_return_1: "Yesterday's Return",
  lag_return_3: "3-Day Return",
  lag_return_7: "7-Day Return",
  lag_return_30: "30-Day Return",
  ma_7: "7-Day Moving Average",
  ma_30: "30-Day Moving Average",
};

function readableFeature(feature: string) {
  return FEATURE_LABELS[feature] ?? feature.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function FeatureImportance({ data }: { data: BtcAdaptResults }) {
  const rows = [...(data.feature_importance ?? [])]
    .sort((a, b) => b.importance_pct - a.importance_pct)
    .map((item) => ({ ...item, label: readableFeature(item.feature) }));

  if (rows.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">What's Driving This Prediction</h2>
      <p className="mt-1 text-xs text-muted-foreground">Relative contribution of the latest model inputs</p>
      <div className="mt-4 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 42, left: 16, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} horizontal={false} />
            <XAxis type="number" domain={[0, "dataMax + 3"]} hide />
            <YAxis type="category" dataKey="label" width={150} axisLine={false} tickLine={false} stroke={CHART.axis} fontSize={12} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(value: number) => [`${value.toFixed(1)}%`, "Importance"]} />
            <Bar dataKey="importance_pct" name="Importance" fill={CHART.amber} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              <LabelList dataKey="importance_pct" position="right" formatter={(value: number) => `${value.toFixed(1)}%`} fill={CHART.axis} fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}