import { Routes, Route, NavLink } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { MarketPage } from './pages/MarketPage'
import { GearPage } from './pages/GearPage'
import { OptimizerPage } from './pages/OptimizerPage'
import { LootPage } from './pages/LootPage'
import { PlannerPage } from './pages/PlannerPage'

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconMarket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 6h18l-2 5H5L3 6z" />
      <path d="M5 11v8h14v-8" />
      <path d="M10 11v8" />
      <path d="M14 11v8" />
      <path d="M3 6l2-3h14l2 3" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      {/* Helmet dome */}
      <path d="M4 13V11C4 6.58 7.58 3 12 3s8 3.58 8 8v2" />
      {/* Visor / brim */}
      <path d="M2 13h20" />
      {/* Cheek guards */}
      <path d="M6 13v3a2 2 0 002 2h8a2 2 0 002-2v-3" />
      {/* Up arrow top-right */}
      <path d="M19 5V2m0 0l-2 2m2-2l2 2" strokeWidth="1.5" />
    </svg>
  )
}

function IconProfit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      {/* Dollar sign as paths */}
      <line x1="12" y1="6" x2="12" y2="18" />
      <path d="M15 9.5C15 8 13.66 7 12 7s-3 1-3 2.5S10.34 12 12 12s3 1 3 2.5S13.66 17 12 17s-3-1-3-2.5" />
    </svg>
  )
}

function IconLoot() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      {/* Bag */}
      <path d="M9 4h6l1 3H8L9 4z" />
      <path d="M8 7C5 7 4 9 4 12c0 5 2 8 8 8s8-3 8-8c0-3-1-5-4-5H8z" />
      {/* Dice face on bag - square with dot */}
      <rect x="9" y="11" width="6" height="6" rx="1" strokeWidth="1.5" />
      <circle cx="12" cy="14" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconPlanner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      {/* Notepad */}
      <rect x="4" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h5" />
      {/* Pen */}
      <path d="M17 15l3-3-2-2-3 3v2h2z" strokeWidth="1.5" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/', end: true, label: 'Dashboard', Icon: IconHome },
  { to: '/market', label: 'Market', Icon: IconMarket },
  { to: '/gear', label: 'Gear', Icon: IconGear },
  { to: '/profit-calculator', label: 'Profit Calculator', Icon: IconProfit },
  { to: '/loot', label: 'Loot', Icon: IconLoot },
  { to: '/planner', label: 'Planner', Icon: IconPlanner },
]

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap text-sm font-medium ${isActive ? 'text-amber-400' : 'text-gray-400'}`

function App() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile top nav */}
      <nav className="flex gap-4 overflow-x-auto border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-6 md:hidden">
        {NAV_ITEMS.map(({ to, end, label }) => (
          <NavLink key={to} to={to} end={end} className={mobileNavClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-16 md:shrink-0 md:flex-col md:items-center md:gap-1 md:border-r md:border-r-2 md:border-amber-300/15 md:bg-slate-900 md:py-4">
        {NAV_ITEMS.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? 'bg-slate-800 text-amber-400 ring-1 ring-amber-400/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-200'
              }`
            }
          >
            <Icon />
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </NavLink>
        ))}
      </aside>

      {/* Page content */}
      <main className="min-w-0 flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/gear" element={<GearPage />} />
          <Route path="/profit-calculator" element={<OptimizerPage />} />
          <Route path="/loot" element={<LootPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
