/** @jsxImportSource @emotion/react */
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { EndOfTrickPickCardsRule } from '@gamepark/kitsu/rules/EndOfTrickPickCardsRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'

export const EndOfTrickPickCardsCardDealtLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new EndOfTrickPickCardsRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const receivingPlayer = move.location.player
  const receivingPlayerName = usePlayerName(receivingPlayer)
  const cardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  if (me === receivingPlayer) {
    return (
      <Trans
        defaults="log.endOfTrick.draw2Cards.cardDrawn.self"
        components={{
          card: (
            <Picture
              src={
                cardId !== undefined
                  ? kitsuCardDescription.images[cardId]
                  : move.reveal?.id !== undefined
                    ? kitsuCardDescription.images[move.reveal.id as KitsuCard]
                    : kitsuCardDescription.backImage
              }
              css={kitsuCardLogPictureCss}
            />
          ),
        }}
      />
    )
  }
  return (
    <Trans
      defaults="log.endOfTrick.draw2Cards.cardDrawn.other"
      values={{ player: receivingPlayerName }}
      components={{ card: <Picture src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} /> }}
    />
  )
}
