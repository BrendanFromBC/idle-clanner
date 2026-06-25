import type { ReactNode } from 'react'

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-600 bg-slate-800 p-4 text-center text-sm text-gray-400">
      {children}
    </div>
  )
}
