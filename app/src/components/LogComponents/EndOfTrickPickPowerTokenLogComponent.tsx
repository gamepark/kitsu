/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { powerTokenLogPictureCss } from '../../KitsuTheme'
import { powerTokenDescription } from '../../material/PowerTokenDescription'

export const EndOfTrickPickPowerTokenLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move, context }) => {
  const me = usePlayerId<number>()
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const powerToken = rule.material(MaterialType.PowerToken).index(move.itemIndex).getItem<PowerToken>()
  const actingPlayer = context.action.playerId
  const targetPlayer = move.location.player
  const actingPlayerName = usePlayerName(actingPlayer)
  const targetPlayerName = usePlayerName(targetPlayer)
  if (powerToken?.id === undefined) {
    throw new Error('illegal game state')
  }
  const componentProp = { powerToken: <Picture src={powerTokenDescription.images[powerToken.id]} css={powerTokenLogPictureCss} /> }
  if (me === actingPlayer) {
    if (me === targetPlayer) {
      return <Trans defaults="log.endOfTrick.pickPowerToken.selfToSelf" components={componentProp} />
    }
    return <Trans defaults="log.endOfTrick.pickPowerToken.selfToOther" values={{ targetPlayer: targetPlayerName }} components={componentProp} />
  } else if (me === targetPlayer) {
    return <Trans defaults="log.endOfTrick.pickPowerToken.otherToSelf" values={{ player: actingPlayerName }} components={componentProp} />
  } else {
    if (actingPlayer === targetPlayer) {
      return <Trans defaults="log.endOfTrick.pickPowerToken.otherToThemselves" values={{ player: actingPlayerName }} components={componentProp} />
    }
    return (
      <Trans
        defaults="log.endOfTrick.pickPowerToken.otherToOther"
        values={{ player: actingPlayerName, targetPlayer: targetPlayerName }}
        components={componentProp}
      />
    )
  }
}
