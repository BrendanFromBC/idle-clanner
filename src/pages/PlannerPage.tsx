import { WishlistPanel } from '../components/wishlist/WishlistPanel'

export function PlannerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900">Planner</h2>
      <WishlistPanel />
    </div>
  )
}
