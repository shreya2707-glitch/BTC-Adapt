# BTC-Adapt verification fixes

## Scope
- Add the regime-specific plain-language sentence beneath Tomorrow’s Prediction, keyed by `current_regime`.
- Add a horizontal “What’s Driving This Prediction” chart beneath Actual vs Predicted, reading `feature_importance` and converting feature keys into readable labels.
- Add a “Methodology & Limitations” card on Learn More with badges populated from `backtest_info` and a concise bulleted limitations list.
- Preserve all existing page structure and styling outside these additions.

## Data handling
- Extend the dashboard result type for `feature_importance` and `backtest_info`.
- Keep the additions compatible with pipeline-generated JSON and handle absent optional values without breaking the page.
- Verify all three tabs in the running dashboard and confirm the current build remains clean.
