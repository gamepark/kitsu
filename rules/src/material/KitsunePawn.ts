import { getEnumValues } from '@gamepark/rules-api'

export enum KitsunePawn {
  Yako = 1,
  Zenko,
}

export const kitsunePawnIds = getEnumValues(KitsunePawn)
