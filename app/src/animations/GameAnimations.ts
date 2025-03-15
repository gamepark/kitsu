import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations()

gameAnimations
  .when()
  .rule<RuleId>(RuleId.RoundSetupDealCards)
  .move((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand)
  .duration(0.5)
