/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PickCardInDiscardRule } from '@gamepark/kitsu/rules/PickCardInDiscardRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const PickDiscardCardNoCardLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ context }) => {
  const rule = new PickCardInDiscardRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const actingPlayer = rule.player
  const actingPlayerName = usePlayerName(actingPlayer)
  if (me === actingPlayer) {
    return <Trans defaults="log.pickDiscardCard.noCardAvailable.self" />
  }
  return <Trans defaults="log.pickDiscardCard.noCardAvailable.other" values={{ player: actingPlayerName }} />
}
