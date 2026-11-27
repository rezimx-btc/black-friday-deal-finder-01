# Black Friday Deal Finder 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/rezimx-btc/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/rezimx-btc/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A static site of **real Black Friday 2026 deals we checked ourselves** — 17 deals from Amazon, Best Buy, Walmart and Target, each with the product, the store, a link to it there, sale price, usual price, and the date we checked it. Searchable and filterable by category, store and minimum discount, with a plain verdict on every deal: **REAL DEAL** (50%+ off), **GOOD DEAL** (30%+ off, or 20%+ at an all-time low), or **MODEST** (a cut, but not a bargain).

Every price was verified against a live deal source on the check date shown on its card (24–27 Nov 2026). Prices move all day on Black Friday — the site says so on every card and in the footer, and always tells you to confirm the live price on the store page before buying.

## Run it

```sh
node main.ts
```

`main.ts` (Node 22, zero dependencies) reads `data/deals.json`, validates it, and regenerates the static site into `$MAKEFUN_OUTPUT_DIR` (default `/output`): `index.html`, `app.css`, `app.js`, `deals.js` and `build-log.txt`. The output is deterministic — two runs produce byte-identical trees.

To view the site locally, open `app/index.html` in a browser, or serve the folder:

```sh
python3 -m http.server -d app
```

No build step, no network requests at runtime, no external fonts or images — everything is local, and it works on desktop and phone widths.

## How the verdict works

- **REAL DEAL** — 50% or more off the usual price.
- **GOOD DEAL** — 30% or more off, or 20%+ off at an all-time low.
- **MODEST** — a real cut, but under those bars. Shown honestly instead of dressed up as a bargain.

## License

MIT — see [LICENSE](LICENSE).
