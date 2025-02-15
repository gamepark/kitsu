import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class EndOfTrickMoveLeaderTokenRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const currentLeaderPlayer = this.material(MaterialType.LeaderToken).getItem()!.location.player!;
        const numberOfPlayers = this.game.players.length;
        const nextLeaderPlayer = this.game.players[(this.game.players.indexOf(currentLeaderPlayer) + 1) % numberOfPlayers];

        let ruleMove: RuleMove<number, RuleId>;
        if (this.material(MaterialType.KitsuCard).location(LocationType.PlayerHand).length === 0
            && this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDiscardSpotOnWisdomBoard).length === 0) {
            ruleMove = this.startRule(RuleId.RoundSetupDealCards);
        } else {
            ruleMove = this.startRule(RuleId.EndOfTrickPickCards);
        }

        return [
            this.material(MaterialType.LeaderToken).moveItem({
                type: LocationType.LeaderTokenSpotOnClanCard,
                player: nextLeaderPlayer,
            }),
            ruleMove,
        ];
    }
}