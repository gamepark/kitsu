import { getEnumValues, MaterialItem } from '@gamepark/rules-api'
import { LocationType } from './LocationType'

export enum SetupCard {
  For2Players = 1,
  For4Players,
  For6Players,
}

export const setupCardIds = getEnumValues(SetupCard)

/* eslint "@typescript-eslint/no-unsafe-argument": "off" */
export const isSetupCardMaterial = (item: Partial<MaterialItem<number, LocationType>>): item is MaterialItem<number, LocationType, SetupCard> => {
  return item.location?.type === LocationType.SetupCardSpot && setupCardIds.includes(item.id)
}
