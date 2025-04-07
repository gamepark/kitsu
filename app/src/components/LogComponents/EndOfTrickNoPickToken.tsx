/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { Memorize } from '@gamepark/kitsu/Memorize'
import { EndOfTrickPickAvailablePowerToken } from '@gamepark/kitsu/rules/EndOfTrickPickAvailablePowerToken'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MoveComponentProps, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const EndOfTrickNoPickToken: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ context }) => {
  const { t } = useTranslation()
  const rule = new EndOfTrickPickAvailablePowerToken(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const me = usePlayerId<number>()
  const actingPlayer = rule.player
  const actingTeam = rule.remind<TeamColor>(Memorize.Team, actingPlayer)
  const actingPlayerName = usePlayerName(actingPlayer)
  const availableTokenNumber = rule.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnWisdomBoard).length
  if (availableTokenNumber === 0) {
    if (me === actingPlayer) {
      return <Trans defaults="log.endOfTrick.pickPowerToken.noneAvailable.self" />
    }
    return <Trans defaults="log.endOfTrick.pickPowerToken.noneAvailable.other" values={{ player: actingPlayerName }} />
  }
  if (me === actingPlayer) {
    return <Trans defaults="log.endOfTrick.pickPowerToken.teamAlreadyHasToken.self" />
  }
  return (
    <Trans
      defaults="log.endOfTrick.pickPowerToken.teamAlreadyHasToken.other"
      values={{ player: actingPlayerName, team: actingTeam === TeamColor.Yako ? t('clan.yako') : t('clan.zenko') }}
      components={{
        color: (
          <span
            style={{
              color: actingTeam === TeamColor.Yako ? 'orange' : 'blue',
              fontWeight: 'bold',
              backgroundColor: actingTeam === TeamColor.Yako ? 'none' : '#dddddd88',
              padding: actingTeam === TeamColor.Yako ? '0px' : '2px',
            }}
          />
        ),
      }}
    />
  )
}
