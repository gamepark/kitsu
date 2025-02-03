import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { RuleId } from "./RuleId";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";

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