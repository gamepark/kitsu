import { getEnumValues, MaterialItem } from '@gamepark/rules-api'
import { LocationType } from './LocationType'

export enum PowerToken {
  ColourExchange = 1,
  NoAdvance,
  PickDiscarded,
  Plus3,
  Protection,
}

export const powerToken = getEnumValues(PowerToken)

/* eslint "@typescript-eslint/no-unsafe-argument": "off" */
export const isPowerTokenMaterial = (item: Partial<MaterialItem<number, LocationType>>): item is MaterialItem<number, LocationType, PowerToken> =>
  [
    LocationType.PowerTokenSpotOnKitsuCard,
    LocationType.PowerTokenSpotOnClanCard,
    LocationType.PowerTokenSpotOnWisdomBoard,
    LocationType.DiscardedPowerTokenAreaOnWisdomBoard,
  ].includes(item.location?.type ?? LocationType.SetupCardSpot) && powerToken.includes(item.id)
