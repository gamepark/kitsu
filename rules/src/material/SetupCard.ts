import { getEnumValues } from '@gamepark/rules-api'

export enum SetupCard {
  For2Players = 1,
  For4Players,
  For6Players,
}

export const setupCardIds = getEnumValues(SetupCard)
