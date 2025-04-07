/** @jsxImportSource @emotion/react */
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PickCardInDiscardRule } from '@gamepark/kitsu/rules/PickCardInDiscardRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'

export const PickDiscardCardCardPickedLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new PickCardInDiscardRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const cardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  const actingPlayer = rule.player
  const actingPlayerName = usePlayerName(actingPlayer)
  if (me === actingPlayer && cardId !== undefined) {
    return (
      <Trans
        defaults="log.pickDiscardCard.pickCard.self"
        components={{ card: <Picture src={kitsuCardDescription.images[cardId]} css={kitsuCardLogPictureCss} /> }}
      />
    )
  }
  return (
    <Trans
      defaults="log.pickDiscardCard.pickCard.other"
      values={{ player: actingPlayerName }}
      components={{ card: <Picture src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} /> }}
    />
  )
}
