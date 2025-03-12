import { getEnumValues, MaterialItem } from '@gamepark/rules-api'
import { LocationType } from './LocationType'

export enum VictoryCard {
  Yako = 1,
  Zenko,
}

export const victoryCardIds = getEnumValues(VictoryCard)

/* eslint "@typescript-eslint/no-unsafe-argument": "off" */
export const isVictoryCardMaterial = (item: Partial<MaterialItem<number, LocationType>>): item is MaterialItem<number, LocationType, VictoryCard> =>
  item.location?.type === LocationType.VictoryCardsSpot && victoryCardIds.includes(item.id)
