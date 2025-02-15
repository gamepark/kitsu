import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class RoundSetupMoveKitsunePawnsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        return [
            this.material(MaterialType.KitsunePawn).moveItemsAtOnce({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 0
            }),
            this.startRule<RuleId>(RuleId.RoundSetupDealCards),
        ];
    }
}