/** @jsxImportSource @emotion/react */
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { EndOfTrickDiscardCardsRule } from '@gamepark/kitsu/rules/EndOfTrickDiscardCardsRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const EndOfTrickDiscardPlayerHandLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const me = usePlayerId<number>()
  const moveItem = move as MoveItem<number, MaterialType, LocationType>
  const rule = new EndOfTrickDiscardCardsRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const originalOwner = rule.material(MaterialType.KitsuCard).index(moveItem.itemIndex).getItem<KitsuCard>()?.location.player
  const originalOwnerName = usePlayerName(originalOwner)
  if (me === originalOwner) {
    return <Trans defaults="log.endOfTrick.discardRemainingHandCard.self" />
  }
  return <Trans defaults="log.endOfTrick.discardRemainingHandCard.other" values={{ player: originalOwnerName }} />
}
