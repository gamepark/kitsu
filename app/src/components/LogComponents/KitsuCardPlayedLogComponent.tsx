/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { isUndefined } from 'lodash'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { kitsuCardLogPictureCss, powerTokenLogPictureCss } from '../../KitsuTheme'
import { kitsuCardDescription } from '../../material/KitsuCardDescription'
import { powerTokenDescription } from '../../material/PowerTokenDescription'

export const KitsuCardPlayedLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const player = context.action.playerId
  const playerName = usePlayerName(player)
  const cardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  const token = rule.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnKitsuCard).parent(move.itemIndex).getItem<PowerToken>()
  const tokenId = token?.id
  const isPlus3Back = tokenId === PowerToken.Plus3 && token?.location.rotation === PowerTokenPlus3Side.Zenko
  if (!isUndefined(tokenId)) {
    if (me === player && !isUndefined(cardId)) {
      return (
        <Trans
          defaults="log.playedCardWithToken.self"
          components={{
            card: <Picture src={kitsuCardDescription.images[cardId]} css={kitsuCardLogPictureCss} />,
            token: (
              <Picture src={isPlus3Back ? powerTokenDescription.backImages[tokenId] : powerTokenDescription.images[tokenId]} css={powerTokenLogPictureCss} />
            ),
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        />
      )
    }
    return (
      <Trans
        defaults="log.playedCardWithToken.other"
        values={{ player: playerName }}
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
          token: (
            <Picture src={isPlus3Back ? powerTokenDescription.backImages[tokenId] : powerTokenDescription.images[tokenId]} css={powerTokenLogPictureCss} />
          ),
        }}
        style={{ display: 'flex', alignItems: 'center' }}
      />
    )
  }
  if (me === player && !isUndefined(cardId)) {
    return <Trans defaults="log.playedCard.self" components={{ card: <Picture src={kitsuCardDescription.images[cardId]} css={kitsuCardLogPictureCss} /> }} />
  }
  return (
    <Trans
      defaults="log.playedCard.other"
      values={{ player: playerName }}
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
      style={{ display: 'flex', alignItems: 'center' }}
    />
  )
}
