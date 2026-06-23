// Decodes the raw `attackStyleWeakness` code from data/monsters.ts.
//
// Verified (not guessed) by cross-referencing each boss's wiki-recommended
// weapon type against its known code, from
// https://idleclans.wiki/w/Best_in_slot_gear (Combat Bossing section):
//   Hades(1)=spear/longsword=Stab, Medusa(2)=scimitar=Slash,
//   Devil(3)=heavy hammer/club=Pound, Griffin(4)=battleaxe=Crush,
//   Zeus(5)=bow=Archery, Chimera(6)=staff=Magic.
// Code 0 (6/79 monsters) is the field's unset default — no exploitable
// weakness. Code 7 only appears on Kronos, who the wiki lists under all
// three style headings (Melee/Magic/Archery) — inferred as "no single
// weakness", not independently confirmed like 1-6.
const WEAKNESS_LABELS: Record<number, string> = {
  0: 'None',
  1: 'Stab',
  2: 'Slash',
  3: 'Pound',
  4: 'Crush',
  5: 'Archery',
  6: 'Magic',
  7: 'None (varies)',
}

export function getWeaknessLabel(code: number): string {
  return WEAKNESS_LABELS[code] ?? `Unknown (${code})`
}
