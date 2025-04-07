/** @jsxImportSource @emotion/react */
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { EndOfTrickKitsunePawnMoveRule } from '@gamepark/kitsu/rules/EndOfTrickKitsunePawnMoveRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss, powerTokenLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'
import { powerTokenDescription } from '../../material/PowerTokenDescription'

export const EndOfTrickProtectedCardRevealLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new EndOfTrickKitsunePawnMoveRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const owningPlayer = move.location.player
  const owningPlayerName = usePlayerName(owningPlayer)
  const cardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  const componentsProp = {
    card: (
      <Picture
        src={
          move.reveal?.id !== undefined
            ? kitsuCardDescription.images[move.reveal.id as KitsuCard]
            : cardId !== undefined
              ? kitsuCardDescription.images[cardId]
              : kitsuCardDescription.backImage
        }
        css={kitsuCardLogPictureCss}
      />
    ),
    token: <Picture src={powerTokenDescription.images[PowerToken.Protection]} css={powerTokenLogPictureCss} />,
  }
  if (me === owningPlayer) {
    return <Trans default="log.endOfTrick.revealProtectedCard.self" components={componentsProp} />
  }
  return <Trans defaults="log.endOfTrick.revealProtectedCard.other" values={{ player: owningPlayerName }} components={componentsProp} />
}
