// Curated BiS gear list. Item SELECTION is hand-picked from the wiki's
// "Best in slot gear" page (https://idleclans.wiki/w/Best_in_slot_gear,
// fetched 2026-06-22) — see scripts/generate-gear.mjs for the curated list
// and sourcing notes. Stats and level requirements are pulled from the live
// API (authoritative), not guessed.
//
// Scope: one BiS item per combat slot (melee/slash training, no tier ladder
// yet — TODO). Skilling tools DO have the full 8-tier ladder per skill
// (Normal..Otherworldly, tier 1-8), so getUpgradePath()/the ownership
// dropdown can work across the whole tool progression, not just BiS.
// TODO: boss-specific BiS (e.g. Astaroths Scimitar, Grimwark's Shield) and
// magic/archery training sets aren't covered — melee was chosen as the
// default/most common style.

export interface GearItem {
  id: number
  name: string
  displayName: string
  slot: string
  category: 'combat' | 'tool'
  skill: string | null
  stats: Record<string, number>
  levelRequired: number
  tier: number
  acquisitionMethods: { type: string }[]
  tradeable: boolean
  attackInterval: number
  style: number // raw API code, undecoded
  weaponClass: number // raw API code, undecoded
  extraBoostAgainstWeakEnemiesPercentage: number
  twoHanded: boolean
}

export const GEAR: GearItem[] = [
  {
    "id": 791,
    "name": "otherworldly_scimitar",
    "displayName": "Otherworldly Scimitar",
    "slot": "weapon",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 82,
      "AccuracyBonus": 87
    },
    "levelRequired": 100,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 2750,
    "style": 2,
    "weaponClass": 1,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 922,
    "name": "otherworldly_shield",
    "displayName": "Otherworldly Shield",
    "slot": "offhand",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 3,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": -2,
      "MagicAccuracyBonus": -5,
      "DefenceBonus": 92,
      "ArcheryDefenceBonus": 95,
      "MagicDefenceBonus": 2
    },
    "levelRequired": 105,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 925,
    "name": "otherworldly_helmet",
    "displayName": "Otherworldly Helmet",
    "slot": "helmet",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 3,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": -2,
      "MagicAccuracyBonus": -4,
      "DefenceBonus": 45,
      "ArcheryDefenceBonus": 42,
      "MagicDefenceBonus": 2
    },
    "levelRequired": 105,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 923,
    "name": "otherworldly_platebody",
    "displayName": "Otherworldly Platebody",
    "slot": "body",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 3,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": -12,
      "MagicAccuracyBonus": -25,
      "DefenceBonus": 130,
      "ArcheryDefenceBonus": 128,
      "MagicDefenceBonus": 2
    },
    "levelRequired": 105,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 924,
    "name": "otherworldly_platelegs",
    "displayName": "Otherworldly Platelegs",
    "slot": "legs",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 3,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": -12,
      "MagicAccuracyBonus": -22,
      "DefenceBonus": 98,
      "ArcheryDefenceBonus": 95,
      "MagicDefenceBonus": 2
    },
    "levelRequired": 105,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 701,
    "name": "otherworldly_boots",
    "displayName": "Otherworldly Boots",
    "slot": "boots",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": 2,
      "ArcheryStrengthBonus": 1,
      "MagicAccuracyBonus": 2,
      "MagicStrengthBonus": 1,
      "DefenceBonus": 28,
      "ArcheryDefenceBonus": 18,
      "MagicDefenceBonus": 8
    },
    "levelRequired": 90,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 700,
    "name": "otherworldly_gloves",
    "displayName": "Otherworldly Gloves",
    "slot": "gloves",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 15,
      "ArcheryAccuracyBonus": 14,
      "ArcheryStrengthBonus": 12,
      "MagicAccuracyBonus": 12,
      "MagicStrengthBonus": 11,
      "DefenceBonus": 16,
      "ArcheryDefenceBonus": 15,
      "MagicDefenceBonus": 12
    },
    "levelRequired": 90,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 527,
    "name": "strength_cape_tier_4",
    "displayName": "Strength Cape Tier 4",
    "slot": "cape",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 5,
      "AccuracyBonus": 8,
      "ArcheryAccuracyBonus": 6,
      "ArcheryStrengthBonus": 6,
      "MagicAccuracyBonus": 6,
      "MagicStrengthBonus": 6,
      "DefenceBonus": 15,
      "ArcheryDefenceBonus": 15,
      "MagicDefenceBonus": 15
    },
    "levelRequired": 120,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": false,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 988,
    "name": "silheniks_lunar_belt",
    "displayName": "Silheniks Lunar Belt",
    "slot": "belt",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 7,
      "AccuracyBonus": 9,
      "ArcheryAccuracyBonus": 15,
      "ArcheryStrengthBonus": 1,
      "MagicAccuracyBonus": 15,
      "MagicStrengthBonus": 12,
      "DefenceBonus": 10,
      "ArcheryDefenceBonus": 7,
      "MagicDefenceBonus": 7
    },
    "levelRequired": 0,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 426,
    "name": "diamond_amulet_enchanted",
    "displayName": "Diamond Amulet Enchanted",
    "slot": "amulet",
    "category": "combat",
    "skill": null,
    "stats": {
      "MagicAccuracyBonus": 9,
      "DefenceBonus": 8,
      "MagicDefenceBonus": 10
    },
    "levelRequired": 0,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": false,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 425,
    "name": "diamond_ring_enchanted",
    "displayName": "Diamond Ring Enchanted",
    "slot": "ring",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3,
      "ArcheryAccuracyBonus": 3,
      "ArcheryStrengthBonus": 2,
      "MagicAccuracyBonus": 3,
      "MagicStrengthBonus": 2
    },
    "levelRequired": 0,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": false,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 788,
    "name": "pet_melee_tier_8",
    "displayName": "Pet Melee Tier 8",
    "slot": "pet",
    "category": "combat",
    "skill": null,
    "stats": {
      "StrengthBonus": 16,
      "AccuracyBonus": 25
    },
    "levelRequired": 0,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": false,
    "attackInterval": 0,
    "style": 0,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 290,
    "name": "normal_crafting_needle",
    "displayName": "Normal Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 297,
    "name": "refined_crafting_needle",
    "displayName": "Refined Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 304,
    "name": "great_crafting_needle",
    "displayName": "Great Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 311,
    "name": "elite_crafting_needle",
    "displayName": "Elite Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 318,
    "name": "superior_crafting_needle",
    "displayName": "Superior Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 325,
    "name": "outstanding_crafting_needle",
    "displayName": "Outstanding Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 332,
    "name": "godlike_crafting_needle",
    "displayName": "Godlike Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 808,
    "name": "otherworldly_crafting_needle",
    "displayName": "Otherworldly Crafting Needle",
    "slot": "tool",
    "category": "tool",
    "skill": "crafting",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 54,
    "name": "normal_hatchet",
    "displayName": "Normal Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 60,
    "name": "refined_hatchet",
    "displayName": "Refined Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 66,
    "name": "great_hatchet",
    "displayName": "Great Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 80,
    "name": "elite_hatchet",
    "displayName": "Elite Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 86,
    "name": "superior_hatchet",
    "displayName": "Superior Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 92,
    "name": "outstanding_hatchet",
    "displayName": "Outstanding Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 98,
    "name": "godlike_hatchet",
    "displayName": "Godlike Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 800,
    "name": "otherworldly_hatchet",
    "displayName": "Otherworldly Hatchet",
    "slot": "tool",
    "category": "tool",
    "skill": "woodcutting",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 288,
    "name": "normal_saw",
    "displayName": "Normal Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 295,
    "name": "refined_saw",
    "displayName": "Refined Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 302,
    "name": "great_saw",
    "displayName": "Great Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 309,
    "name": "elite_saw",
    "displayName": "Elite Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 316,
    "name": "superior_saw",
    "displayName": "Superior Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 323,
    "name": "outstanding_saw",
    "displayName": "Outstanding Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 330,
    "name": "godlike_saw",
    "displayName": "Godlike Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 806,
    "name": "otherworldly_saw",
    "displayName": "Otherworldly Saw",
    "slot": "tool",
    "category": "tool",
    "skill": "carpentry",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 284,
    "name": "normal_fishing_rod",
    "displayName": "Normal Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 291,
    "name": "refined_fishing_rod",
    "displayName": "Refined Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 298,
    "name": "great_fishing_rod",
    "displayName": "Great Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 305,
    "name": "elite_fishing_rod",
    "displayName": "Elite Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 312,
    "name": "superior_fishing_rod",
    "displayName": "Superior Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 319,
    "name": "outstanding_fishing_rod",
    "displayName": "Outstanding Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 326,
    "name": "godlike_fishing_rod",
    "displayName": "Godlike Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 802,
    "name": "otherworldly_fishing_rod",
    "displayName": "Otherworldly Fishing Rod",
    "slot": "tool",
    "category": "tool",
    "skill": "fishing",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 289,
    "name": "normal_cooking_pan",
    "displayName": "Normal Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 296,
    "name": "refined_cooking_pan",
    "displayName": "Refined Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 303,
    "name": "great_cooking_pan",
    "displayName": "Great Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 310,
    "name": "elite_cooking_pan",
    "displayName": "Elite Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 317,
    "name": "superior_cooking_pan",
    "displayName": "Superior Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 324,
    "name": "outstanding_cooking_pan",
    "displayName": "Outstanding Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 331,
    "name": "godlike_cooking_pan",
    "displayName": "Godlike Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 807,
    "name": "otherworldly_cooking_pan",
    "displayName": "Otherworldly Cooking Pan",
    "slot": "tool",
    "category": "tool",
    "skill": "cooking",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 53,
    "name": "normal_pickaxe",
    "displayName": "Normal Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 59,
    "name": "refined_pickaxe",
    "displayName": "Refined Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 65,
    "name": "great_pickaxe",
    "displayName": "Great Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 79,
    "name": "elite_pickaxe",
    "displayName": "Elite Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 85,
    "name": "superior_pickaxe",
    "displayName": "Superior Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 91,
    "name": "outstanding_pickaxe",
    "displayName": "Outstanding Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 97,
    "name": "godlike_pickaxe",
    "displayName": "Godlike Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 801,
    "name": "otherworldly_pickaxe",
    "displayName": "Otherworldly Pickaxe",
    "slot": "tool",
    "category": "tool",
    "skill": "mining",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 3,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 287,
    "name": "normal_hammer",
    "displayName": "Normal Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 294,
    "name": "refined_hammer",
    "displayName": "Refined Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 301,
    "name": "great_hammer",
    "displayName": "Great Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 308,
    "name": "elite_hammer",
    "displayName": "Elite Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 315,
    "name": "superior_hammer",
    "displayName": "Superior Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 322,
    "name": "outstanding_hammer",
    "displayName": "Outstanding Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 329,
    "name": "godlike_hammer",
    "displayName": "Godlike Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 805,
    "name": "otherworldly_hammer",
    "displayName": "Otherworldly Hammer",
    "slot": "tool",
    "category": "tool",
    "skill": "smithing",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 286,
    "name": "normal_secateurs",
    "displayName": "Normal Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 293,
    "name": "refined_secateurs",
    "displayName": "Refined Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 300,
    "name": "great_secateurs",
    "displayName": "Great Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 307,
    "name": "elite_secateurs",
    "displayName": "Elite Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 314,
    "name": "superior_secateurs",
    "displayName": "Superior Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 321,
    "name": "outstanding_secateurs",
    "displayName": "Outstanding Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 328,
    "name": "godlike_secateurs",
    "displayName": "Godlike Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 804,
    "name": "otherworldly_secateurs",
    "displayName": "Otherworldly Secateurs",
    "slot": "tool",
    "category": "tool",
    "skill": "foraging",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 285,
    "name": "normal_rake",
    "displayName": "Normal Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 292,
    "name": "refined_rake",
    "displayName": "Refined Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 299,
    "name": "great_rake",
    "displayName": "Great Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 306,
    "name": "elite_rake",
    "displayName": "Elite Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 313,
    "name": "superior_rake",
    "displayName": "Superior Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 320,
    "name": "outstanding_rake",
    "displayName": "Outstanding Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 327,
    "name": "godlike_rake",
    "displayName": "Godlike Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 803,
    "name": "otherworldly_rake",
    "displayName": "Otherworldly Rake",
    "slot": "tool",
    "category": "tool",
    "skill": "farming",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 552,
    "name": "normal_jumping_rope",
    "displayName": "Normal Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 553,
    "name": "refined_jumping_rope",
    "displayName": "Refined Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 554,
    "name": "great_jumping_rope",
    "displayName": "Great Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 555,
    "name": "elite_jumping_rope",
    "displayName": "Elite Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 556,
    "name": "superior_jumping_rope",
    "displayName": "Superior Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 557,
    "name": "outstanding_jumping_rope",
    "displayName": "Outstanding Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 558,
    "name": "godlike_jumping_rope",
    "displayName": "Godlike Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 811,
    "name": "otherworldly_jumping_rope",
    "displayName": "Otherworldly Jumping Rope",
    "slot": "tool",
    "category": "tool",
    "skill": "agility",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 2,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 533,
    "name": "normal_lockpicks",
    "displayName": "Normal Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 534,
    "name": "refined_lockpicks",
    "displayName": "Refined Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 535,
    "name": "great_lockpicks",
    "displayName": "Great Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 536,
    "name": "elite_lockpicks",
    "displayName": "Elite Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 537,
    "name": "superior_lockpicks",
    "displayName": "Superior Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 538,
    "name": "outstanding_lockpicks",
    "displayName": "Outstanding Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 539,
    "name": "godlike_lockpicks",
    "displayName": "Godlike Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 810,
    "name": "otherworldly_lockpicks",
    "displayName": "Otherworldly Lockpicks",
    "slot": "tool",
    "category": "tool",
    "skill": "plundering",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 540,
    "name": "normal_philosopher_stone",
    "displayName": "Normal Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 541,
    "name": "refined_philosopher_stone",
    "displayName": "Refined Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 542,
    "name": "great_philosopher_stone",
    "displayName": "Great Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 543,
    "name": "elite_philosopher_stone",
    "displayName": "Elite Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 544,
    "name": "superior_philosopher_stone",
    "displayName": "Superior Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 545,
    "name": "outstanding_philosopher_stone",
    "displayName": "Outstanding Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 546,
    "name": "godlike_philosopher_stone",
    "displayName": "Godlike Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 809,
    "name": "otherworldly_philosopher_stone",
    "displayName": "Otherworldly Philosopher Stone",
    "slot": "tool",
    "category": "tool",
    "skill": "brewing",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 1,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 948,
    "name": "normal_brush",
    "displayName": "Normal Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 2,
      "AccuracyBonus": 3
    },
    "levelRequired": 0,
    "tier": 1,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 949,
    "name": "refined_brush",
    "displayName": "Refined Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 4,
      "AccuracyBonus": 5
    },
    "levelRequired": 10,
    "tier": 2,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 950,
    "name": "great_brush",
    "displayName": "Great Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 6,
      "AccuracyBonus": 7
    },
    "levelRequired": 20,
    "tier": 3,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 951,
    "name": "elite_brush",
    "displayName": "Elite Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 9,
      "AccuracyBonus": 11
    },
    "levelRequired": 30,
    "tier": 4,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 952,
    "name": "superior_brush",
    "displayName": "Superior Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 14,
      "AccuracyBonus": 16
    },
    "levelRequired": 45,
    "tier": 5,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 953,
    "name": "outstanding_brush",
    "displayName": "Outstanding Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 18,
      "AccuracyBonus": 21
    },
    "levelRequired": 60,
    "tier": 6,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 954,
    "name": "godlike_brush",
    "displayName": "Godlike Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 26,
      "AccuracyBonus": 30
    },
    "levelRequired": 80,
    "tier": 7,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  },
  {
    "id": 955,
    "name": "otherworldly_brush",
    "displayName": "Otherworldly Brush",
    "slot": "tool",
    "category": "tool",
    "skill": "invocation",
    "stats": {
      "StrengthBonus": 29,
      "AccuracyBonus": 34
    },
    "levelRequired": 100,
    "tier": 8,
    "acquisitionMethods": [
      {
        "type": "market"
      }
    ],
    "tradeable": true,
    "attackInterval": 4000,
    "style": 4,
    "weaponClass": 0,
    "extraBoostAgainstWeakEnemiesPercentage": 0,
    "twoHanded": false
  }
]
