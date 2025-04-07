/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'

export const KitsuCardReceiveFromTeamMemberLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const playerReceivingCard = move.location.player
  const playerSendingCard = rule.game.players[(rule.game.players.indexOf(playerReceivingCard ?? 0) - 2 + rule.game.players.length) % rule.game.players.length]
  const playerReceivingCardName = usePlayerName(playerReceivingCard)
  const playerSendingCardName = usePlayerName(playerSendingCard)
  if (me === playerReceivingCard && move.reveal?.id !== undefined) {
    return (
      <Trans
        defaults="log.receiveCard.self"
        values={{ player: playerSendingCardName }}
        components={{ card: <Picture src={kitsuCardDescription.images[move.reveal.id as KitsuCard]} css={kitsuCardLogPictureCss} /> }}
      />
    )
  }
  return (
    <Trans
      defaults="log.receiveCard.other"
      values={{ sendingPlayer: playerSendingCardName, player: playerReceivingCardName }}
      components={{ card: <Picture src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} /> }}
    />
  )
}
