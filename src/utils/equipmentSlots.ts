// Maps our curated GearSlot taxonomy (src/data/gear.ts) to the raw API's
// equipment slot keys. Verified against a real equipped loadout (Kyrani,
// 2026-06-22) by cross-referencing each equipped itemId's numeric
// `equipmentSlot` code in items.ts — not guessed. See CLAUDE.md's
// "Static game data types" section for the full code table.
//
// Note: `tool` and `weapon` both map to `rightHand` — the API doesn't have a
// separate tool slot, tools occupy the same mainhand slot as weapons.
export const RAW_SLOT_BY_GEAR_SLOT: Record<string, string> = {
  weapon: 'rightHand',
  tool: 'rightHand',
  offhand: 'leftHand',
  helmet: 'head',
  body: 'body',
  legs: 'legs',
  boots: 'boots',
  gloves: 'gloves',
  cape: 'cape',
  belt: 'belt',
  ring: 'jewellery',
  amulet: 'amulet',
  pet: 'pet',
}

export function getEquippedItemId(equipment: Record<string, number>, gearSlot: string): number | null {
  const rawSlot = RAW_SLOT_BY_GEAR_SLOT[gearSlot]
  if (!rawSlot) return null
  return equipment[rawSlot] ?? null
}
