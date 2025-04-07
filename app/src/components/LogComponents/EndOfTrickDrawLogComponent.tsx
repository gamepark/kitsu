/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { EndOfTrickKitsunePawnMoveRule } from '@gamepark/kitsu/rules/EndOfTrickKitsunePawnMoveRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MoveComponentProps } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const EndOfTrickDrawLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ context }) => {
  const rule = new KitsuRules(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const playedCards = rule.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot)
  const score = EndOfTrickKitsunePawnMoveRule.getScore(playedCards, TeamColor.Zenko)
  return <Trans defaults="log.endOfTrick.draw" values={{ teamsScore: score }} />
}
