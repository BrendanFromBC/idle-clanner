import type { ReactNode } from 'react'

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-400">
      {children}
    </p>
  )
}
