/** @jsxImportSource @emotion/react */
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PickCardInDiscardRule } from '@gamepark/kitsu/rules/PickCardInDiscardRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItemsAtOnce } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'

export const PickDiscardCardCardsRevealed: FC<MoveComponentProps<MoveItemsAtOnce<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const me = usePlayerId<number>()
  const rule = new PickCardInDiscardRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const actingPlayer = rule.player
  const actingPlayerName = usePlayerName(actingPlayer)
  if (me === actingPlayer) {
    return (
      <Trans
        defaults="log.pickDiscardCard.reveal.self"
        components={{
          cards: (
            <>
              {move.indexes.map((itemIndex, index) => (
                <Picture
                  key={`pick-discard-card-${index}`}
                  src={move.reveal !== undefined ? kitsuCardDescription.images[move.reveal[itemIndex].id as KitsuCard] : kitsuCardDescription.backImage}
                  css={kitsuCardLogPictureCss}
                />
              ))}
            </>
          ),
        }}
      />
    )
  }
  return (
    <Trans
      defaults="log.pickDiscardCard.reveal.other"
      values={{ player: actingPlayerName }}
      components={{
        cards: (
          <>
            {move.indexes.map((_, index) => (
              <Picture key={`pick-discard-card-${index}`} src={kitsuCardDescription.backImage} css={kitsuCardLogPictureCss} />
            ))}
          </>
        ),
      }}
    />
  )
}
