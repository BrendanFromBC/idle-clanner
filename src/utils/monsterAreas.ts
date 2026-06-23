// Display labels for monsters.ts's `areaId` (the API's own CustomId per
// Tasks.Combat group — these are the game's real area names, not inferred).
const AREA_LABELS: Record<string, string> = {
  woods: 'Woods',
  cave: 'Cave',
  wilderness: 'Wilderness',
  haunted_graveyard: 'Haunted Graveyard',
  uncharted_grounds: 'Uncharted Grounds',
  lair_of_beasts: 'Lair of Beasts',
  valley_of_gods: 'The Valley of Gods',
  exterminating: 'Exterminating',
  invocation: 'Invocation',
  misc: 'Misc',
}

export function getAreaLabel(areaId: string): string {
  return AREA_LABELS[areaId] ?? areaId
}
