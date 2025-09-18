# Arb & Edge Tool (Frontend-only)

Single-page app to compare sportsbook odds vs prediction-market probabilities to find arbitrage and value edges. Built with Next.js App Router, TypeScript, Tailwind, shadcn/ui, Zod. All math runs in the browser.

## Tech
- Next.js 15 (App Router) + TypeScript
- TailwindCSS v4 + shadcn/ui
- Zod (validation)
- Playwright (smoke test)
- pnpm

## Scripts
- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - start production server
- `pnpm test:e2e` - run Playwright tests

## Math Summary
- Decimal → p: p = 1/O
- American → p: A>0: 100/(A+100), A<0: -A/(-A+100)
- Fractional a/b → decimal: 1 + a/b
- p → decimal: 1/p
- Overround: R = Σ p_i. Fair probs: fp_i = p_i / R. Fair odds: 1/fp_i
- Effective decimal mapping: apply fees/slippage: O' = O × (1 - fee) × (1 - slippage)
- Arbitrage: if Σ(1/O_i) < 1 → arb. Stake split s_i = S*(1/O_i)/Σ(1/O_j). Guaranteed profit = min_i(s_i*O_i - S)
- Value edge: edge = p_pm - p_book. Kelly: b=O-1, f=(b*p-(1-p))/b, clamp to [0,1]. ½-Kelly = f/2.

## Notes
- No backend. State persists in localStorage (settings and last session).
- CSV export of results.

## Dev
1. `pnpm i`
2. `pnpm dev`
3. Visit http://localhost:3000

## Test
1. `pnpm dev` (in one terminal)
2. `pnpm test:e2e` (in another terminal)
