# Idle Clanner — CLAUDE.md

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
Two sources, used for different things:

- **Generated from the live API** — `GET /api/Configuration/game-data` returns
  the game's own definitions (a ~2.4MB MongoDB-export-style JSON blob: items,
  monsters, tasks, upgrades, etc.). This is authoritative, not a guess, and
  far more complete than hand-transcribing the wiki. `items.ts`, `monsters.ts`,
  and `activities.ts` are generated this way — see `scripts/generate-*.mjs`.
  Rerun the relevant script after a game update.
- **Curated** — `gear.ts` mixes both: item *selection* (which items count as
  "BiS") is hand-picked from the wiki, since that's a judgment call the API
  can't make, but once an item is selected its stats/level requirement are
  pulled from the same authoritative API data, not guessed. Drop *rates* in
  `monsters.ts` are derived (loot weight ÷ table total weight) rather than
  API-stated — treat as an approximation; see the file header for caveats.

```
src/data/
  items.ts        GENERATED — id ↔ name, base value, tradeable flag (scripts/generate-items.mjs)
  gear.ts         CURATED — 25 BiS items, selection hand-picked from wiki, stats from API (scripts/generate-gear.mjs)
  activities.ts   GENERATED — all 232 non-combat tasks across 13 skills (scripts/generate-activities.mjs)
  monsters.ts     GENERATED — all 79 combat encounters, derived drop rates (scripts/generate-monsters.mjs)
  icons.ts        GENERATED — item/monster id -> wiki-hosted icon URL (scripts/generate-icons.mjs)
  upgrades.ts     not yet built
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
// Verified against the live API (GET /api/Player/profile/{name}), 2026-06-22.
// The raw response (src/api/types.ts → RawPlayerProfile) does NOT match this
// shape directly — it returns skillExperiences (XP only, no level) and
// equipment as item IDs. src/types/player.ts → toPlayerProfile() derives the
// shape below from the raw response.

type SkillName =
  | 'mining' | 'woodcutting' | 'fishing' | 'foraging' | 'farming'
  | 'smithing' | 'crafting' | 'cooking' | 'brewing' | 'carpentry'
  | 'agility' | 'enchanting' | 'plundering'
  | 'attack' | 'strength' | 'defence' | 'health' | 'magic' | 'archery'
  | 'rigour' | 'exterminating' | 'invocation'

interface SkillData {
  level: number   // derived client-side via xpToLevel(xp) — the API has no level field
  xp: number
}

interface PlayerProfile {
  username: string
  skills: Record<string, SkillData>   // keyed by the raw skill name the API returns
  equipment: Record<string, number>   // slot name → item id (no entry if slot is empty)
  guildName: string | null            // API field is `guildName`, not `clanName`
  totalLevel: number                  // derived client-side: sum of all skill levels
  bossKills: Record<string, number>   // from raw `pvmStats`
}

// ─── Static game data types ─────────────────────────────────────────────────
// GearSlot is our own curated taxonomy for src/data/gear.ts — it does NOT
// match the raw API's equipment slot keys (head, body, legs, boots, gloves,
// cape, belt, leftHand, rightHand, amulet, bracelet, earrings, jewellery,
// ammunition, pet). Phase 4 will need a slot-name mapping between the two
// when matching equipped item IDs against the gear database.

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
// Implemented in src/store/teamStore.ts. `itemId` (not `gearItemId`) — this
// references any item in data/items.ts by its real numeric id, not just the
// 116 curated in gear.ts, since a player might wishlist non-equipment items too.

interface WishlistItem {
  id: string
  itemId: number
  forSlot: 'main' | 'alt1' | 'alt2'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  acquired: boolean
}
```

---

## Feature phases

Build in this order. Each phase is releasable on its own.

### Phase 1 — Foundation ✅
**Goal**: Working team dashboard. Something real on screen fast.

- [x] Project scaffold with Vite + React + TypeScript template
- [x] Tailwind, Zustand, TanStack Query, React Router installed
- [x] Team setup flow: enter up to 3 usernames, assign roles
- [x] Zustand `teamStore` with `persist` middleware writing to localStorage
- [x] `src/api/idleClansApi.ts` — typed fetch wrappers for all API endpoints
- [x] `usePlayerProfile(username)` hook via TanStack Query (5min stale time)
- [x] Team dashboard: 3-column layout, one card per account
  - Each card: username, role badge, skill grid (level per skill). Equipped
    gear slots deferred to Phase 4 — the API only gives item IDs, so showing
    them meaningfully needs `src/data/items.ts` (Phase 3) resolved first.

### Phase 2 — Market browser ✅
**Goal**: Live item price lookup, used by every later feature.

- [x] Fetch + cache all market prices (2min stale, background refresh)
- [x] `useMarketPrices()` hook available throughout the app
- [x] Market page: search bar with instant filter, results list
- [x] Item price card: current buy/sell spread, 1d/7d/30d averages, 24hr volume
      (averages/volume are fetched on-demand per item via
      `/prices/latest/comprehensive/{itemId}` when a card is expanded — fetching
      that for all 637 tradeable items up front isn't practical)

### Phase 3 — Game data layer ✅ (initial pass)
**Goal**: Build the static knowledge base everything else depends on. Start small
and accurate — 30 correct items beats 200 with wrong data.

- [x] `src/data/items.ts` — generated id↔name catalog for all 999 items (see
      `scripts/generate-items.mjs`).
- [x] `src/data/gear.ts` — 116 curated items (see `scripts/generate-gear.mjs`):
      12 combat slots (melee/slash training BiS, endgame tier only) + the
      **full 8-tier ladder** (Normal..Otherworldly) for all 13 skilling
      tools, 104 items total. Tool tier naming is a clean `{tier}_{baseName}`
      pattern in the item data, verified for all 13 tools before relying on
      it. Item *selection* (which base tool/combat item per slot) is
      hand-picked from the wiki's "Best in slot gear" page; stats/level
      requirements are pulled from the live API.
      **Scope gaps, left as TODOs in the file**: combat slots still have no
      tier ladder (BiS only), melee-only (no magic/archery sets), no
      boss-specific BiS uniques.
- [x] `src/data/activities.ts` — generated, all 232 non-combat tasks across
      13 skills (see `scripts/generate-activities.mjs`), with inputs,
      outputs, XP, and actions/hr derived from `BaseTime`.
- [x] `src/data/monsters.ts` — generated, all 79 combat encounters (see
      `scripts/generate-monsters.mjs`), with derived drop rates (weight ÷
      total table weight — an approximation, not an API-stated value).
- [x] Helper: `getUpgradePath(slot, currentItemId, skill?) → GearItem[]` in
      `src/utils/gearHelpers.ts`. Currently just returns the BiS item (since
      `gear.ts` has no intermediate tiers yet — see TODO above).
- [x] Helper: `getAcquisitionCost(item, marketPrices) → number | null` in
      `src/utils/gearHelpers.ts`.

### Phase 4 — Gear guide ✅ (initial pass)
**Goal**: Role-aware gear recommendations with upgrade paths per account.

- [x] `src/utils/equipmentSlots.ts` — verified mapping from raw API equipment
      slot keys to our `GearSlot` taxonomy (cross-referenced against a real
      equipped loadout's `equipmentSlot` codes in `items.ts`, not guessed).
      Note: `tool` and `weapon` both map to `rightHand` — there's no separate
      tool slot in the API, tools occupy the mainhand slot.
- [x] Compare each account's equipped gear against `gear.ts` via
      `GearUpgradeCard` (`src/components/gear/`)
- [x] Role-aware: main → combat BiS path (`GEAR.filter(category==='combat')`).
      Alts → tool recommendations for skills they've actually trained,
      ranked by level descending — **scope note**: `AccountSlot` has no
      per-alt "assigned skill" field, so this infers relevance from the
      player's own skill levels rather than a single fixed skill. Revisit if
      a real "what should alt2 specifically work on" feature is wanted.
- [x] Upgrade card: current → endgame BiS, live market price shown. Not a
      multi-tier path yet (`gear.ts` only has the endgame tier — see its
      Phase 3 TODOs)
- [x] "How to get it" panel: buy from market at [live price], or "not
      currently buyable" if there's no active sell listing (`lowestSellPrice`
      can be `0` with `lowestPriceVolume: 0`, which means no listing, not a
      free item — caught and fixed during testing)
- [x] Gear page (`/gear`) shows all 3 accounts in tabs, each with their own
      recommendations

**Known UX gap (not yet fixed)**: when an alt has a combat weapon (not a
tool) equipped in `rightHand`, every one of the 13 tool comparison cards
repeats that same "currently equipped" item, which reads as confusing/buggy
even though it's technically correct (there's only one mainhand slot). Two
follow-ups wanted later:
1. `gear.ts` currently only curates the mainhand tool per skill — it should
   also cover the skilling *armor* set (helmet/body/legs/gloves, e.g.
   Miner's Helmet/Jacket/Pants/Gloves for mining), which use the normal
   armor slots, not `rightHand`, so they wouldn't have this collision.
2. Open design question: how to display combat gear and skilling gear
   together on one account's gear page in a way that doesn't fight the
   single-mainhand-slot ambiguity. Needs more thought before building.

### Phase 5 — Gold/hr optimizer ✅ (initial pass)
**Goal**: Tell the team what to do for maximum gold output.

- [x] Single account: rank all activities by net gold/hr at their skill levels
      using live market prices (`src/utils/goldPerHour.ts`). Buying an input
      costs `lowestSellPrice` (cheapest ask); selling an output earns
      `highestBuyPrice` (best bid) — same convention as `getAcquisitionCost`
      in Phase 4. An activity is omitted entirely (not shown as 0 or
      negative) if we don't have real price data for every item involved —
      better to omit than imply a wrong number.
- [x] "Level X to unlock Y" — `getNextUnlock()` finds the nearest locked
      activity (by level) for a skill that would beat the player's current
      best *unlocked* gold/hr for that same skill. Compares within-skill, not
      globally — e.g. unlocking Farming at level 10 can outrank Farming's
      current ~0 gold/hr without needing to beat the account's best activity
      overall.
- [x] Team view: a simple "best activity per account" summary
      (`TeamSummary` in `OptimizerPage.tsx`) — **scope note**: this is NOT
      the resource-supply-chain graph (gatherer → processor → seller)
      described in the original plan. That requires matching one account's
      output items to another's input items across the team and is
      meaningfully more complex; deferred until there's a concrete need for it.
- [x] **Ironman mode toggle** (`useSettingsStore`, persisted) — ironman
      accounts can't use the player market at all, so this is a completely
      separate valuation, not a price swap:
      - Outputs are valued at the local/NPC shop price (`items.ts`
        `baseValue`, only when `shopSellable` — ~25 items the shop won't buy).
      - Inputs can't be bought either, so they must be self-gathered by
        *some* account on the team. `findGatherSource()` only looks for a
        **direct, single-step** gather activity (zero inputs of its own) —
        it does not chase multi-step chains (e.g. ore → bar). If no eligible
        team member/activity exists, the input is treated as unobtainable.
      - Two numbers are shown per activity: `fullPipelineGoldPerHour` (real
        sustainable rate — includes time spent gathering inputs) and
        `materialsFreeGoldPerHour` (assumes a stockpile, ignores gather time).
        Ranking sorts by the full-pipeline number; `materialsFreeGoldPerHour`
        is secondary/contextual.
      - `src/utils/goldPerHour.ts`: `getIronmanGoldPerHour`,
        `rankIronmanActivitiesForSkills`, `getIronmanNextUnlock` — parallel
        to the non-ironman functions rather than a shared abstraction, since
        the two pricing models don't overlap enough to unify cleanly.
      - **Known simplification**: this models strict solo-ironman
        self-sufficiency. **Group Ironman** accounts can trade freely within
        their own group (just not the wider market), so `findGatherSource()`
        is likely too strict for them — a groupmate outside the app's
        tracked main/alt1/alt2 team could supply a material the calculator
        treats as unobtainable. Deliberately left as-is (user's call,
        2026-06-23) — revisit if it matters in practice.

### Phase 6 — Loot odds + planner ✅ (initial pass)
**Goal**: Drop table browser and cross-account goal tracking.

- [x] Monster loot table browser (`/loot`, "By monster" tab): select monster
      → see all drops sorted by derived rate, using `data/monsters.ts`. The
      picker is grouped by in-game area (`<optgroup>`) instead of one flat
      alphabetical list — `monsters.ts` carries `areaId`/`areaSortOrder`
      straight from the API's `Tasks.Combat` group structure (`CustomId`/
      `SortOrder` per group — not inferred, the game already organizes
      monsters this way: Woods, Cave, Wilderness, Haunted Graveyard,
      Uncharted Grounds, Lair of Beasts, The Valley of Gods, Exterminating,
      plus two more not originally mentioned but present in the data —
      Invocation and Misc). Display labels in `src/utils/monsterAreas.ts`.
- [x] "Best monster to farm for [item]" — reverse lookup tab on the same
      page, searches `data/items.ts` then finds every monster whose loot
      table includes it.
- [x] Wishlist: `teamStore.wishlist` (not gear-curated-only — references any
      item by numeric `itemId` from `data/items.ts`, since a player might
      want to track non-gear items too). Tagged to `forSlot`
      (main/alt1/alt2), `priority` (low/medium/high).
- [x] Wishlist panel shows live market price (`WishlistItemRow` — same
      "no active listing" handling as Phase 4/5: a `0`/no-volume price reads
      as "no active market listing", not free). Acquisition method is
      generic ("buy from market" or "not tradeable") — there's no full
      acquisition-method database for all 999 items, only the 116 curated in
      `gear.ts`. TODO if richer per-item acquisition info (drop source,
      quest, etc.) for arbitrary wishlist items is wanted later.
- [x] Acquired toggle (`toggleWishlistAcquired`) — checkbox, strikes through
      + fades the row, doesn't remove it (so progress is visible at a glance).
- [x] **DPS/kills-per-hour calculator — melee only** (`src/utils/combatCalc.ts`).
      First attempt stopped here: the wiki's Combat page flags its own
      hit-chance formula as "no longer accurate," and the real in-game
      calculator needs a **premium membership** token — no authoritative
      source, and fabricating a formula would violate "game data is
      curated, not guessed." Resolved properly on 2026-06-23: the user has
      premium and supplied 10 real Damage-Calcs-panel readings (2 weapons ×
      5 monsters, varied weakness match/mismatch) plus 10 max-hit readings.
      Findings, each checked against the data rather than assumed:
      - **Max hit and both 20% weakness bonuses (defence -20%, max hit
        +20%) are exactly correct as the wiki documents them** — confirmed
        to the exact integer against all 10 readings, no fitting needed.
        (Verified the weakness-on-defence effect is real, not just a damage
        effect, by refitting with it removed — fit got dramatically worse,
        concentrated on exactly the matched-weakness points.)
      - **Only the hit-chance ACC-vs-DEF curve itself was wrong.** Replaced
        with one fitted to the 10 readings: `hit% = 1 / (1 + 1.08 ×
        (DEF/ACC)^2.52)`, same augmented-stat inputs as the wiki
        (`(stat+64)×(level+8)/10`). Mean error ~1.6 percentage points, max
        ~3.25, across all 10 points. The exponent/coefficient are curve-fit
        values, not confirmed internal game constants — good estimate, not
        exact.
      - Kills/hr = the above combined with a standard expected-damage model
        (`avgDamagePerHit = maxHit/2`, attack interval, monster health,
        2.55s respawn) — this combination itself hasn't been checked
        against an observed kill rate, only its two inputs have.
      - **Scope: melee only** (weapon style codes 1-4). Archery/magic use
        the same wiki formula structure but have zero test data — don't
        extend without separately validating, same as melee was.
      - `getCombatLoadout()` sums accuracy/strength from **whatever's
        actually equipped** (`items.ts` now carries `strengthBonus`/
        `accuracyBonus`/`defenceBonus`/`attackInterval`/`style` for all 999
        items, not just the 116 curated in `gear.ts`) — reflects the
        player's real gear, not a hypothetical BiS loadout.
      - `monsters.ts` gained `defenceLevel` (was missing — needed alongside
        `defenceBonus` for the augmented-defence formula).
      - Loot page has an account selector (main/alt1/alt2) so the
        hit-chance/max-hit/kills-per-hr numbers use that account's real
        Attack/Strength levels and equipped gear; falls back to "no melee
        weapon equipped" (raw stats only) if the selected account's
        `rightHand` item isn't a melee weapon.
      - **Known simplification, not yet accounted for**: Group Ironman
        trading (same caveat as the Optimizer's ironman mode), and the
        wiki's documented dodge-chance/Agility mechanic (not folded into
        the kill-time model).
      - `attackStyleWeakness` (monsters) and `style` (weapons) **are
        decoded** (`src/utils/combatStyle.ts`, `getWeaknessLabel()`) —
        verified by cross-referencing each boss's wiki-recommended weapon
        type against its known code (Hades(1) spear/longsword → Stab,
        Medusa(2) scimitar → Slash, Devil(3) heavy hammer/club → Pound,
        Griffin(4) battleaxe → Crush, Zeus(5) bow → Archery, Chimera(6)
        staff → Magic) — and confirmed weapons use the *identical* encoding
        (Outstanding Scimitar/Spear/Staff/Bow/Heavy Hammer all matched).
        Code 0 (6/79 monsters) is the field's unset default ("None"); code
        7 only appears on Kronos, who the wiki lists under all three style
        headings — inferred as "no single weakness," less certain than 1-6.
        `weaponClass` remains undecoded.

### Phase 7 — Polish ✅
- [x] Mobile-responsive layout — `#root`'s leftover scaffold `text-align:
      center` removed (see Notes/gotchas — it was also the cause of an
      unrelated skewed-title bug on the Profit Calculator); nav and all tab
      rows (Gear, Loot, Profit Calculator) made horizontally scrollable
      instead of wrapping/squeezing; page padding `p-6` → `p-4 sm:p-6`;
      AccountCard's skill grid `grid-cols-2 sm:grid-cols-3` instead of a
      hardcoded 3.
- [x] Shareable team URL — `src/utils/teamShareLink.ts`
      (`buildShareSearchParams`/`parseShareSearchParams`) encodes configured
      slots as `?main=Username:role&alt1=...`, skipping unconfigured slots
      and malformed individual entries rather than failing the whole link.
      `ShareTeamButton` (Dashboard) copies the link; an import banner
      (Dashboard) shows which usernames a shared link would set with
      explicit Load/Ignore buttons — it never silently overwrites the local
      team. The URL is only read once on mount (a lazy `useState`
      initializer, not a `searchParams`-watching effect) so dismissing the
      banner and clearing the query string doesn't immediately re-trigger it.
- [x] Loading skeletons — `src/components/ui/Skeleton.tsx`
      (`Skeleton`/`CardRowSkeleton`/`CardRowSkeletonList`), used on Market,
      Gear, Profit Calculator, and the expanded PriceCard detail/chart.
      AccountCard's previously one-off skeleton now reuses the same
      primitive.
- [x] Error states — `src/components/ui/ErrorMessage.tsx`, a consistent red
      bordered box replacing ad hoc red `<p>` text everywhere.
- [x] Empty states — `src/components/ui/EmptyState.tsx`. Several now link
      back to the Dashboard to actually fix the empty state ("No account set
      for this slot. Add one on the Dashboard") rather than just describing
      it. Two genuine blank-space bugs were caught and fixed in the process:
      Market search and the Loot reverse-item-lookup rendered literally
      nothing for a zero-result search instead of an empty-state message.
- [x] **Scope addition beyond the original checklist, found during this
      pass**: tabs/dropdowns on Gear, Profit Calculator, and Loot previously
      listed all 3 slots (`main`/`alt1`/`alt2`) even when a slot had no
      username set, showing a raw "ALT2" placeholder tab that did nothing
      useful. All three now filter to `configuredSlots`/
      `accountsWithUsernames` only, falling back to the first configured
      slot if the active selection becomes unconfigured, and showing an
      `EmptyState` (with a Dashboard link) instead of an empty tab row if
      zero accounts are set up. `WishlistPanel`'s "for account" add-form
      dropdown got the same treatment.

---

## File structure

```
idle-clanner/
  src/
    api/
      idleClansApi.ts      # typed fetch functions for all API endpoints
      types.ts             # API response shape types
    components/
      ui/                  # Icon (ItemIcon/MonsterIcon), Skeleton (+ CardRowSkeleton/List), ErrorMessage, EmptyState
      team/                # TeamSetup, AccountCard, RoleBadge, ShareTeamButton
      gear/                # GearUpgradeCard (current → BiS + market price), GearOwnershipChecklist (self-report, on Dashboard)
      market/              # MarketSearch, PriceCard, PriceHistoryChart
      optimizer/           # ActivityRanking, IronmanActivityRanking (ranked list + level-up-to-unlock callouts)
      loot/                # MonsterDropTable, ItemDropSources (reverse lookup)
      wishlist/            # WishlistPanel (add form + grouping), WishlistItemRow
    data/
      items.ts             # GENERATED — see scripts/generate-items.mjs, do not hand-edit
      gear.ts              # CURATED — see scripts/generate-gear.mjs (selection hand-picked, stats generated)
      activities.ts        # GENERATED — see scripts/generate-activities.mjs, do not hand-edit
      monsters.ts          # GENERATED — see scripts/generate-monsters.mjs, do not hand-edit
      icons.ts             # GENERATED — see scripts/generate-icons.mjs, do not hand-edit
      upgrades.ts          # not yet built
    hooks/
      usePlayerProfile.ts      # TanStack Query wrapper
      useMarketPrices.ts       # TanStack Query wrapper
      useMarketPriceDetail.ts  # TanStack Query wrapper, per-item averages/volume
      useMarketPriceHistory.ts # TanStack Query wrapper, rolling ~24h price/volume points
      useTeam.ts                # Zustand store selectors (incl. useTeamActions, useWishlistActions)
      useDebouncedCallback.ts   # generic debounce helper (used by TeamSetup's username input)
    pages/
      DashboardPage.tsx    # team setup, account cards, share-link import banner, self-reported gear
      MarketPage.tsx
      GearPage.tsx
      OptimizerPage.tsx    # route is /profit-calculator, nav label "Profit Calculator" — file/component name kept as-is
      LootPage.tsx
      PlannerPage.tsx
    store/
      teamStore.ts         # Zustand with localStorage persist middleware
      settingsStore.ts     # Zustand persist — app-wide prefs (e.g. ironmanMode)
      ownedItemsStore.ts   # Zustand persist — manual "I own this" self-report per account/item
    types/
      player.ts            # domain PlayerProfile + toPlayerProfile() transform from raw API shape
      market.ts            # domain MarketPrice + toMarketPrices() transform, joins prices with data/items.ts
    utils/
      xpToLevel.ts         # XP ↔ level lookup table (levels 1–120)
      formatGold.ts        # "1,234,567" → "1.2M"
      gearHelpers.ts       # getUpgradePath, getAcquisitionCost
      equipmentSlots.ts    # verified raw API slot key ↔ GearSlot taxonomy mapping
      goldPerHour.ts       # getActivityGoldPerHour/rankActivitiesForSkills/getNextUnlock + ironman-mode variants
      combatStyle.ts       # getWeaknessLabel() — decoded attackStyleWeakness codes
      monsterAreas.ts      # getAreaLabel() — display labels for monsters.ts's areaId
      combatCalc.ts        # getCombatLoadout/getHitChance/getMaxHit/getKillEstimate — melee only, see Phase 6
      priceComparison.ts   # comparePriceToAverage() — current vs 7d avg, ±10%/±50% judgment-call thresholds
      teamShareLink.ts      # buildShareSearchParams/parseShareSearchParams — Phase 7 shareable team URL
    App.tsx
    main.tsx
  scripts/
    generate-items.mjs       # regenerates src/data/items.ts from GET /api/Configuration/game-data
    generate-monsters.mjs    # regenerates src/data/monsters.ts (Tasks.Combat)
    generate-activities.mjs  # regenerates src/data/activities.ts (Tasks.<skill>)
    generate-gear.mjs        # regenerates src/data/gear.ts from a hand-curated item-id list + live stats
    generate-icons.mjs       # regenerates src/data/icons.ts by resolving names against the idleclans.wiki MediaWiki API
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

**Game data is curated, not guessed** — `src/data/` files are either generated
from the live `/api/Configuration/game-data` endpoint (authoritative — see
`items.ts`) or hand-built from wiki research for things the API doesn't cover
(drop rates, acquisition notes). Either is fine; what's not fine is inventing
a value. Accuracy matters more than completeness — leave a `// TODO` comment
rather than guessing a drop rate.

**No backend** — everything is client-side. If a feature seems to require a
server (e.g. storing wishlists), use localStorage first. Only add a backend if
absolutely necessary.

**Explain the reasoning** — when recommending gear or activities, show *why*:
the stat delta, the gold/hr difference, the level gate being unlocked. Players
want to understand, not just be told what to do.

---

## Bootstrap commands

```bash
npm create vite@latest idle-clanner -- --template react-ts
cd idle-clanner
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

- **Item/monster icons have no official source.** `Configuration/game-data`
  is pure stat data — no icon field anywhere, confirmed by inspecting a raw
  item object. The only available source is the community wiki
  (idleclans.wiki, MediaWiki-based). Its `action=query&prop=imageinfo` API
  resolves a `File:<Name>.png` title to the real, hash-prefixed image URL
  (e.g. `/w/images/5/59/Spruce_log.png`) — the hash directory can't be
  guessed/constructed, so this requires a real per-name lookup, not a
  formula. Filename convention: sentence-case of the raw snake_case name,
  underscores → spaces (`outstanding_scimitar` → `Outstanding scimitar.png`)
  — verified NOT the same as our Title-Case `displayName`, which fails to
  resolve. `scripts/generate-icons.mjs` re-fetches game-data for item/monster
  names, batches lookups 50-at-a-time against the wiki API, and writes
  resolved URLs to `src/data/icons.ts` (914/999 items, 80/80 monsters
  resolved as of 2026-06-23 — coverage isn't 100% for items, some have no
  matching wiki file). Icons are **hotlinked** from the wiki at runtime (the
  generated file stores wiki URLs, not local copies) — a deliberate choice
  over self-hosting, made 2026-06-23. `src/components/ui/Icon.tsx`
  (`ItemIcon`, `MonsterIcon`) renders nothing if an id has no resolved URL,
  rather than a broken-image icon.
- The API has no auth requirement for public data, but rate limits exist. Lean
  on TanStack Query caching — don't refetch unnecessarily.
- For serious projects, the game developer offers higher rate limit API keys.
  Contact via the Idle Clans Discord.
- XP → level conversion is non-linear. The lookup table is in
  `src/utils/xpToLevel.ts`, sourced from https://idleclans.wiki/w/XP_Table
  (levels 1–120). The API only returns XP per skill, never level — always
  derive it client-side.
- Skills Agility, Farming, and Enchanting are capped at level 30 for free
  accounts. Account for this in gear recommendations and optimizer logic.
- Market prices update continuously. Use 2-minute stale time for price queries.
  Note: `/api/PlayerMarket/items/prices/latest` is keyed by numeric `itemId`,
  not item name — the static gear database will need an `itemId` field to
  cross-reference live prices, not just a name match.
- The `equipment` field in the player profile returns item **IDs** (numbers),
  not names — `-1` means the slot is empty. There is no item-name database
  from the API; resolving IDs to names/icons depends on the static game data
  built in Phase 3.
- When building the supply chain optimizer, model the resource flow as a
  directed graph: gatherer outputs → processor inputs → sellable outputs.
  This generalizes better than hardcoding specific chains.
- **The API only exposes equipped gear, never inventory.** `PlayerProfile`'s
  `equipment` field is the complete picture (confirmed against the Swagger
  schema — `additionalProperties: false`, no inventory/bank field exists
  anywhere in the API). A player can own a BiS item and simply not have it
  equipped, and there's no way to detect that from the API. Don't try to
  work around this via browser extensions or network interception — Idle
  Clans is a native Steam/Android/iOS app, not a web client, so there's no
  page to inject into; the closest equivalents (local MITM proxy, process
  memory reading) are higher-friction, higher-risk, and likely against ToS.
  The chosen solution is manual self-report: `src/store/ownedItemsStore.ts`
  persists ownership to localStorage, per account slot. Combat items (single
  BiS entry each) are a checkbox; skilling tools (full 8-tier ladder) are a
  **dropdown per skill** so the player can record which tier they actually
  own, not just owned-BiS-or-not — `setOwnedInGroup()` treats a skill's 8
  tiers as mutually exclusive (selecting one clears the others). The
  checklist UI lives on the Dashboard (`GearOwnershipChecklist`,
  self-contained — only needs an `AccountSlotKey` prop, no coupling to page
  layout, so it's easy to relocate once the Figma redesign lands) and
  `GearUpgradeCard` on the Gear page just *reads* ownership of the BiS item
  specifically (read-only there) to avoid suggesting a buy for something
  already owned. It's intentionally separate from `teamStore`'s
  `WishlistItem.acquired` (Phase 6) — this tracks BiS gear ownership
  specifically, not arbitrary wishlist goals.
- **Not every "the API can't see this" case needs self-report** — check
  first. `PlayerProfile.upgrades` already returns the player's personal
  local-market upgrades with real named keys (toolbelt tier, offline
  progress, etc.) — fetched but currently unused in our domain model. Clan
  upgrades are also derivable (not self-report): `Clan/recruitment/{clanName}`
  returns `serializedUpgrades` (e.g. `"[31]"`), decodable against the
  game-data dump's top-level `ClanUpgrades` definitions (numeric type code +
  a readable loc-key description) — just not built yet. Active potion buffs
  and consumable stock, by contrast, are genuinely invisible anywhere in the
  API — true self-report candidates if/when those get built.
