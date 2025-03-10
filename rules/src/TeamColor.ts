import { getEnumValues } from '@gamepark/rules-api'

export enum TeamColor {
  Yako = 1,
  Zenko,
}

export const teamColors = getEnumValues(TeamColor)
