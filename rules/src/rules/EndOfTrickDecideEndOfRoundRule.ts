import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class EndOfTrickDecideEndOfRoundRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
    const nextRule = this.material(MaterialType.KitsunePawn).locationId(13).length === 1 ? RuleId.RoundEnd : RuleId.EndOfTrickMoveLeaderToken
    return [this.startRule(nextRule)]
  }
}
