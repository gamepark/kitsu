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

export const KatanaTargetLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const me = usePlayerId<number>()
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const actingPlayer = context.action.playerId
  const targetPlayer = move.location.player
  const actingPlayerName = usePlayerName(actingPlayer)
  const targetPlayerName = usePlayerName(targetPlayer)
  const targetCardId = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.id
  if (targetCardId === undefined) {
    throw new Error('Katana target id cannot be undefined')
  }
  if (me === actingPlayer) {
    return (
      <Trans
        defaults="log.selectKatanaTarget.selectTarget.self"
        values={{ targetPlayer: targetPlayerName }}
        components={{ card: <Picture src={kitsuCardDescription.images[targetCardId]} css={kitsuCardLogPictureCss} /> }}
      />
    )
  }
  if (me === targetPlayer)
    return (
      <Trans
        defaults="log.selectKatanaTarget.selectTarget.other.own"
        values={{ player: actingPlayerName }}
        components={{ card: <Picture src={kitsuCardDescription.images[targetCardId]} css={kitsuCardLogPictureCss} /> }}
      />
    )
  return (
    <Trans
      defaults="log.selectKatanaTarget.selectTarget.other"
      values={{ player: actingPlayerName, targetPlayer: targetPlayerName }}
      components={{ card: <Picture src={kitsuCardDescription.images[targetCardId]} css={kitsuCardLogPictureCss} /> }}
    />
  )
}
