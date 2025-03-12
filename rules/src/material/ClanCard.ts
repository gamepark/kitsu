import { getEnumValues, MaterialItem } from '@gamepark/rules-api'
import { LocationType } from './LocationType'

export enum ClanCard {
  Zenko2Players = 1,
  Zenko4Players,
  Zenko6Players,
  Yako2Players,
  Yako4Players,
  Yako6Players,
}

export const clanCardIds = getEnumValues(ClanCard)

/* eslint "@typescript-eslint/no-unsafe-argument": "off" */
export const isClanCardMaterial = (item: Partial<MaterialItem<number, LocationType>>): item is MaterialItem<number, LocationType, ClanCard> => {
  return item.location?.type === LocationType.ClanCardSpot && clanCardIds.includes(item.id)
}
