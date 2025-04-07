/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { RoundSetupDealCardsRule } from '@gamepark/kitsu/rules/RoundSetupDealCardsRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const RoundSetupDealCardLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ context }) => {
  const me = usePlayerId<number>()
  const rule = new RoundSetupDealCardsRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const actingPlayer = rule.player
  const actingPlayerName = usePlayerName(actingPlayer)
  const numberOfCardsDealt = rule.game.players.length === 6 ? 5 : 6
  if (me === actingPlayer) {
    return <Trans defaults="log.roundSetup.dealCards.self" values={{ numberOfCards: numberOfCardsDealt }} />
  }
  return <Trans defaults="log.roundSetup.dealCards.other" values={{ numberOfCards: numberOfCardsDealt, player: actingPlayerName }} />
}
