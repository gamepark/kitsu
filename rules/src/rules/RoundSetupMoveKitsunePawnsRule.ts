import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class RoundSetupMoveKitsunePawnsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const moves: MaterialMove<number, MaterialType, LocationType>[] = [
            this.material(MaterialType.KitsunePawn).moveItemsAtOnce({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: 0
        })];
        moves.push(...this.getPowerTokenMoves());
        moves.push(this.startRule<RuleId>(RuleId.RoundSetupDealCards))
        return moves;
    }

    private getPowerTokenMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        const discardedPowerTokens = this.material(MaterialType.PowerToken).location(LocationType.DiscardedPowerTokenAreaOnWisdomBoard);
        if (discardedPowerTokens.length > 0)
        {
            return [
                discardedPowerTokens.moveItemsAtOnce({
                    type: LocationType.PowerTokenSpotOnWisdomBoard
                })
            ];
        }
        return [];
    }
}