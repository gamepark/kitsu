import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { and, isRule, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations()

gameAnimations
  .configure(and(
    isRule(RuleId.RoundSetupDealCards),
    (move) => isMoveItemType(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand
  ))
  .duration(500)
