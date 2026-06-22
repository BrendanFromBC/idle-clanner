# Idle Clans Companion — CLAUDE.md

## What we're building

A MetaForge-style companion web app for the idle RPG Idle Clans. Think of it as
a planning assistant + gear guide + gold optimizer — all personalized to your
specific accounts and skill levels.

**Core design premise**: most players run 3 accounts simultaneously — one main
and two alts focused on gathering/crafting to generate resources and gold. Every
feature is designed around a *team* of accounts, not a single player. This is
the primary differentiator from every existing Idle Clans tool.

Built as a pure client-side web app (no backend needed) using:
- The Idle Clans public API for live player and market data
- A static game database we maintain in TypeScript files
- localStorage for user team config and wishlist

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 (with `@tailwindcss/vite` plugin) |
| Server state | TanStack Query v5 (API caching) |
| Client state | Zustand v4 (team config, persisted to localStorage) |
| Routing | React Router v6 |
| Deploy | Vercel or Netlify (static) |

---

## Data sources

### 1. Idle Clans Public API (live)
Base URL: `https://query.idleclans.com`

Key endpoints used in this app:
```
GET /api/Player/profile/{username}
  → skill levels, XP, equipped gear, boss kills, clan info

GET /api/PlayerMarket/items/prices/latest
  → live market prices for all tradeable items

GET /api/PlayerMarket/items/prices/history/{itemName}
  → price history (1d / 7d / 30d averages)

GET /api/Clan/recruitment/{clanName}
  → clan info + member list

GET /api/Leaderboard/top/{leaderboardName}/{name}
  → skill and total-level leaderboards
```

No authentication required for these endpoints. Cache aggressively with TanStack
Query — player profiles at 5min stale, market prices at 2min stale.

### 2. Static game database (`src/data/`)
Maintained manually from the Idle Clans wiki. This is the core knowledge layer.
Start with the most impactful data and expand:

```
src/data/
  gear.ts         items with stats, level requirements, acquisition methods
  activities.ts   skilling tasks with inputs, outputs, XP and actions/hr formulas
  monsters.ts     monster drop tables with drop rates
  upgrades.ts     local market upgrades that affect skill speed
```

### 3. localStorage (Zustand persist)
- Active team (up to 3 usernames + roles)
- Wishlist items (gear goals tagged per account)
- App preferences (theme, layout, etc.)

---

## Core data model

```typescript
// ─── Team (root concept) ────────────────────────────────────────────────────

type AccountRole = 'main' | 'gatherer' | 'crafter' | 'support' | 'unassigned'

interface AccountSlot {
  username: string | null
  role: AccountRole
  nickname?: string            // e.g. "Miner", "Chef"
}

interface Team {
  id: string
  name: string
  accounts: {
    main: AccountSlot
    alt1: AccountSlot
    alt2: AccountSlot
  }
  wishlist: WishlistItem[]
}

// ─── Player profile (from API) ──────────────────────────────────────────────

type SkillName =
  | 'mining' | 'woodcutting' | 'fishing' | 'foraging' | 'farming'
  | 'smithing' | 'crafting' | 'cooking' | 'brewing' | 'carpentry'
  | 'agility' | 'enchanting' | 'plundering'
  | 'attack' | 'strength' | 'defence' | 'health' | 'magic' | 'archery'

interface SkillData {
  level: number
  xp: number
}

interface PlayerProfile {
  username: string
  skills: Record<SkillName, SkillData>
  equipment: Partial<Record<GearSlot, string>>   // slot → item name
  clanName?: string
  totalLevel: number
  bossKills: Record<string, number>
}

// ─── Static game data types ─────────────────────────────────────────────────

type GearSlot =
  | 'weapon' | 'offhand' | 'helmet' | 'body' | 'legs'
  | 'boots' | 'gloves' | 'cape' | 'belt' | 'ring'
  | 'amulet' | 'tool' | 'pet'

type AcquisitionType =
  | 'market' | 'boss_drop' | 'monster_drop'
  | 'clan_event' | 'store' | 'craft' | 'quest'

interface AcquisitionMethod {
  type: AcquisitionType
  source?: string        // monster/boss name, store name, etc.
  dropRate?: number      // 0–1  (e.g. 0.01 = 1%)
  notes?: string
}

interface GearItem {
  id: string
  name: string
  slot: GearSlot
  category: 'combat' | 'skilling' | 'tool'
  skill?: SkillName              // for skilling gear and tools
  stats: Record<string, number>  // statName → value
  levelRequired: number
  acquisitionMethods: AcquisitionMethod[]
  marketName?: string            // exact name used in the market API
  tier: number                   // 1–5, used for upgrade path ordering
}

interface Activity {
  id: string
  name: string
  skill: SkillName
  levelRequired: number
  inputItems: { itemId: string; quantity: number }[]
  outputItems: { itemId: string; quantity: number }[]
  baseActionsPerHour: number     // at base level, no boosts
  xpPerAction: number
  notes?: string
}

interface MonsterDropEntry {
  itemId: string
  dropRate: number               // 0–1
  quantity?: { min: number; max: number }
}

interface Monster {
  id: string
  name: string
  location: string
  combatLevel: number
  weakness?: 'melee' | 'magic' | 'archery'
  drops: MonsterDropEntry[]
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

interface WishlistItem {
  id: string
  gearItemId: string
  forSlot: 'main' | 'alt1' | 'alt2'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  acquired: boolean
}
```

---

## Feature phases

Build in this order. Each phase is releasable on its own.

### Phase 1 — Foundation
**Goal**: Working team dashboard. Something real on screen fast.

- [ ] Project scaffold with Vite + React + TypeScript template
- [ ] Tailwind, Zustand, TanStack Query, React Router installed
- [ ] Team setup flow: enter up to 3 usernames, assign roles
- [ ] Zustand `teamStore` with `persist` middleware writing to localStorage
- [ ] `src/api/idleClansApi.ts` — typed fetch wrappers for all API endpoints
- [ ] `usePlayerProfile(username)` hook via TanStack Query (5min stale time)
- [ ] Team dashboard: 3-column layout, one card per account
  - Each card: username, role badge, skill grid (level per skill), equipped gear slots

### Phase 2 — Market browser
**Goal**: Live item price lookup, used by every later feature.

- [ ] Fetch + cache all market prices (2min stale, background refresh)
- [ ] `useMarketPrices()` hook available throughout the app
- [ ] Market page: search bar with instant filter, results list
- [ ] Item price card: current buy/sell spread, 1d/7d/30d averages, 24hr volume

### Phase 3 — Game data layer
**Goal**: Build the static knowledge base everything else depends on. Start small
and accurate — 30 correct items beats 200 with wrong data.

- [ ] `src/data/gear.ts` — top 30 items (BiS combat gear + BiS skilling tools
      per skill, with all acquisition methods)
- [ ] `src/data/activities.ts` — main gold-making activities per gathering
      and processing skill
- [ ] `src/data/monsters.ts` — main combat monsters with drop tables
- [ ] Helper: `getUpgradePath(slot, currentItemId) → GearItem[]`
- [ ] Helper: `getAcquisitionCost(item, marketPrices) → number | null`

### Phase 4 — Gear guide
**Goal**: Role-aware gear recommendations with upgrade paths per account.

- [ ] Compare each account's equipped gear against the tier ladder in `gear.ts`
- [ ] Role-aware: main → combat BiS path; alts → skilling tool paths for their
      assigned skills
- [ ] Upgrade card: current → next tier → endgame, with live market price shown
- [ ] "How to get it" panel: drop source + rate, or buy from market at [price]
- [ ] Gear page shows all 3 accounts in tabs, each with their own recommendations

### Phase 5 — Gold/hr optimizer
**Goal**: Tell the team what to do for maximum gold output.

- [ ] Single account: rank all activities by net gold/hr at their skill levels
      using live market prices for output values and input costs
- [ ] "Level X to unlock Y" — highlight the next unlock that meaningfully
      improves gold/hr (the marginal value of leveling each skill)
- [ ] Team view: suggest optimal division of labor across all 3 accounts.
      Show the resource supply chain: Alt 1 gathers → Alt 2 processes → Main sells

### Phase 6 — Loot odds + planner
**Goal**: Drop table browser and cross-account goal tracking.

- [ ] Monster loot table browser: select monster → see all drops with rates
- [ ] "Best monster to farm for [item]" — reverse lookup
- [ ] Wishlist: add gear goals, tag to account (main/alt1/alt2), set priority
- [ ] Wishlist panel shows live market price for each item + acquisition method
- [ ] Acquired toggle marks item complete

### Phase 7 — Polish
- [ ] Mobile-responsive layout
- [ ] Shareable team URL (encode team config in query params)
- [ ] Loading skeletons for all async content
- [ ] Error states for API failures and unknown usernames
- [ ] Empty states with onboarding prompts

---

## File structure

```
idle-clans-companion/
  src/
    api/
      idleClansApi.ts      # typed fetch functions for all API endpoints
      types.ts             # API response shape types
    components/
      ui/                  # Button, Card, Badge, Spinner, Tooltip, etc.
      team/                # TeamSetup, AccountCard, RoleBadge, SkillGrid
      gear/                # GearSlotIcon, GearCard, UpgradePath, AcquisitionInfo
      market/              # MarketSearch, PriceCard, PriceHistory
      optimizer/           # ActivityRanking, TeamOptimizer, SupplyChainView
      loot/                # MonsterDropTable, LootOddsCard
      wishlist/            # WishlistPanel, WishlistItem
    data/
      gear.ts
      activities.ts
      monsters.ts
      upgrades.ts
    hooks/
      usePlayerProfile.ts  # TanStack Query wrapper
      useMarketPrices.ts   # TanStack Query wrapper
      useTeam.ts           # Zustand store selectors
    pages/
      DashboardPage.tsx
      GearPage.tsx
      OptimizerPage.tsx
      LootPage.tsx
      PlannerPage.tsx
    store/
      teamStore.ts         # Zustand with localStorage persist middleware
    utils/
      xpToLevel.ts         # XP ↔ level lookup table (levels 1–120)
      formatGold.ts        # "1,234,567" → "1.2M"
      gearHelpers.ts       # getUpgradePath, getAcquisitionCost
    App.tsx
    main.tsx
  CLAUDE.md
  package.json
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
```

---

## Key design principles

**Team-first data model** — `Team` is the root of all state. Always initialize
with `{ main, alt1, alt2 }` even if only one account is set. Never design a
feature that only works for a single account and bolt on multi-account later.

**Role-aware recommendations** — the same gear slot means different things for
a main vs an alt. A combat BiS path for the main, a woodcutting tool path for
an alt set to "gatherer". Always check `AccountSlot.role` before recommending.

**Live prices everywhere** — any time an item name appears in the UI, its
current market price should be visible (or one click away). Pull from the
cached market prices in TanStack Query, never fetch ad-hoc.

**Game data is curated, not generated** — the `src/data/` files are hand-built
from wiki research. Accuracy matters more than completeness. Leave a `// TODO`
comment rather than guessing a drop rate.

**No backend** — everything is client-side. If a feature seems to require a
server (e.g. storing wishlists), use localStorage first. Only add a backend if
absolutely necessary.

**Explain the reasoning** — when recommending gear or activities, show *why*:
the stat delta, the gold/hr difference, the level gate being unlocked. Players
want to understand, not just be told what to do.

---

## Bootstrap commands

```bash
npm create vite@latest idle-clans-companion -- --template react-ts
cd idle-clans-companion
npm install
npm install @tanstack/react-query zustand react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
npm run dev
```

**vite.config.ts** — add Tailwind plugin:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**src/main.tsx** — wrap with providers:
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },  // 5 min default
  },
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
)
```

---

## Notes and gotchas

- The API has no auth requirement for public data, but rate limits exist. Lean
  on TanStack Query caching — don't refetch unnecessarily.
- For serious projects, the game developer offers higher rate limit API keys.
  Contact via the Idle Clans Discord.
- XP → level conversion is non-linear. Use a lookup table (max level is 120).
  Find the table on the Idle Clans wiki or in the IdlePlus mod source.
- Skills Agility, Farming, and Enchanting are capped at level 30 for free
  accounts. Account for this in gear recommendations and optimizer logic.
- Market prices update continuously. Use 2-minute stale time for price queries.
- The `equipment` field in the player profile returns item names as strings,
  not IDs. Match against `GearItem.name` (case-insensitive) when cross-
  referencing with the local game database.
- When building the supply chain optimizer, model the resource flow as a
  directed graph: gatherer outputs → processor inputs → sellable outputs.
  This generalizes better than hardcoding specific chains.
