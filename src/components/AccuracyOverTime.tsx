import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART, TOOLTIP_STYLE, currency, shortDate, type BtcAdaptResults } from "@/lib/btc-adapt";

type Row = NonNullable<BtcAdaptResults["rolling_accuracy"]>[number];

export function AccuracyOverTime({ data }: { data: BtcAdaptResults }) {
  const rows = data.rolling_accuracy ?? [];
  if (!rows.length) return null;
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">Accuracy Over Time</h2>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="period_end" tickFormatter={shortDate} stroke={CHART.axis} tickLine={false} fontSize={12} minTickGap={24} />
            <YAxis domain={[0, 100]} stroke={CHART.axis} tickLine={false} axisLine={false} fontSize={12} width={48} tickFormatter={(v: number) => `${v}%`} />
            <ReferenceLine
              y={50}
              stroke={CHART.axis}
              strokeDasharray="6 4"
              label={{ value: "Coin flip", position: "insideTopRight", fill: CHART.axis, fontSize: 11 }}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(_l: unknown, p: readonly { payload?: unknown }[]) => {
                const r = p?.[0]?.payload as Row | undefined;
                return r ? `${shortDate(r.period_start)} → ${shortDate(r.period_end)}` : "";
              }}
              formatter={(v: number, _n: string, item: { payload?: unknown }) => {
                const r = item.payload as Row;
                return [`${v.toFixed(1)}% · MAE ${currency(r.mae)}`, "Directional accuracy"];
              }}
            />
            <Line isAnimationActive={false} type="monotone" dataKey="directional_accuracy" stroke={CHART.amber} strokeWidth={2} dot={{ r: 3, fill: CHART.amber }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Shows whether performance is stable or driven by one lucky stretch.</p>
    </section>
  );
}
