import { Routes, Route, NavLink } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { MarketPage } from './pages/MarketPage'
import { GearPage } from './pages/GearPage'
import { OptimizerPage } from './pages/OptimizerPage'
import { LootPage } from './pages/LootPage'
import { PlannerPage } from './pages/PlannerPage'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`

function App() {
  return (
    <div>
      <nav className="flex gap-4 overflow-x-auto border-b border-gray-200 px-4 py-3 sm:px-6">
        <NavLink to="/" end className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/market" className={navLinkClass}>
          Market
        </NavLink>
        <NavLink to="/gear" className={navLinkClass}>
          Gear
        </NavLink>
        <NavLink to="/optimizer" className={navLinkClass}>
          Optimizer
        </NavLink>
        <NavLink to="/loot" className={navLinkClass}>
          Loot
        </NavLink>
        <NavLink to="/planner" className={navLinkClass}>
          Planner
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/gear" element={<GearPage />} />
        <Route path="/optimizer" element={<OptimizerPage />} />
        <Route path="/loot" element={<LootPage />} />
        <Route path="/planner" element={<PlannerPage />} />
      </Routes>
    </div>
  )
}

export default App
