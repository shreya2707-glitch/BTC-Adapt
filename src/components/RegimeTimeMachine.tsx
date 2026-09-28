import { useMemo } from "react";
import { REGIME_COLORS, currency, pct, type BtcAdaptResults } from "@/lib/btc-adapt";

export function RegimeTimeMachine({
  data,
  index,
  onChange,
}: {
  data: BtcAdaptResults;
  index: number;
  onChange: (i: number) => void;
}) {
  const regimeBy = useMemo(() => new Map(data.regimes.map((r) => [r.date, r.regime])), [data]);
  const predBy = useMemo(() => new Map(data.predictions.map((p) => [p.date, p.predicted])), [data]);
  const last = data.prices.length - 1;
  const p = data.prices[index]!;
  const regime = regimeBy.get(p.date);
  const predicted = predBy.get(p.date);
  const diff = predicted != null ? predicted / p.close - 1 : null;
  const close = diff != null && Math.abs(diff) <= 0.01;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">Regime Time Machine</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to revisit any day — <span className="tabular-nums text-foreground">{p.date}</span>
          </p>
        </div>
        <button
          onClick={() => onChange(last)}
          disabled={index === last}
          className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/15 disabled:opacity-40"
        >
          Jump to today
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Regime</div>
          {regime ? (
            <span
              className="mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold"
              style={{ color: REGIME_COLORS[regime], backgroundColor: `${REGIME_COLORS[regime]}1f` }}
            >
              {regime}
            </span>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">—</div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Actual price</div>
          <div className="mt-2 text-xl font-semibold tabular-nums">{currency(p.close)}</div>
        </div>
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Predicted price</div>
          {predicted != null ? (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-semibold tabular-nums">{currency(predicted)}</span>
              <span className="text-sm font-medium tabular-nums" style={{ color: close ? REGIME_COLORS.Bull : "#f59e0b" }}>
                {pct(diff!)}
              </span>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">No prediction for this date</div>
          )}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={last}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Select date"
        className="time-slider mt-6 w-full"
      />
      <div className="mt-1 flex justify-between text-xs tabular-nums text-muted-foreground">
        <span>{data.prices[0]!.date}</span>
        <span>{data.prices[last]!.date}</span>
      </div>
    </section>
  );
}
