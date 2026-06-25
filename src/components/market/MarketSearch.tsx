export function MarketSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="text"
      placeholder="Search items…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-gray-100 placeholder-slate-500"
    />
  )
}
