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

export const KitsuCardSentToTeamMemberLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const playerSendingCard = move.location.player
  const playerReceivingCard = rule.game.players[(rule.game.players.indexOf(move.location.player ?? 0) + 2) % rule.game.players.length]
  const playerSendingCardName = usePlayerName(playerSendingCard)
  const playerReceivingCardName = usePlayerName(playerReceivingCard)
  const cardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  if (me === playerReceivingCard) {
    return (
      <Trans
        defaults="log.receiveCard.self"
        values={{ player: playerSendingCardName }}
        components={{ card: <Picture src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} /> }}
      />
    )
  }
  if (me === playerSendingCard && cardId !== undefined) {
    return (
      <Trans
        defaults="log.sendCard.self"
        values={{ receivingPlayer: playerReceivingCardName }}
        components={{ card: <Picture src={kitsuCardDescription.images[cardId]} css={kitsuCardLogPictureCss} /> }}
      />
    )
  }
  return (
    <Trans
      defaults="log.sendCard.other"
      values={{ player: playerSendingCardName, receivingPlayer: playerReceivingCardName }}
      components={{ card: <Picture src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} /> }}
    />
  )
}
