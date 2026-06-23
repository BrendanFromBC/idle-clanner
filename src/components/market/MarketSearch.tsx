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
      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
    />
  )
}
