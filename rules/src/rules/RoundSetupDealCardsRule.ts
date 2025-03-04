import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class RoundSetupDealCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const deck = this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).deck();
        const leaderPlayerIndex = this.game.players.indexOf(this.material(MaterialType.LeaderToken).getItem()!.location.player!);
        const numberOfPlayers = this.game.players.length;
        const dealPlayerOrder = this.game.players.slice(leaderPlayerIndex + 1 % numberOfPlayers).concat(this.game.players.slice(0, leaderPlayerIndex + 1 % numberOfPlayers));
        return [
            deck.shuffle(),
            ...Array(6).fill(1).flatMap(() =>
                dealPlayerOrder.map(player => deck.dealOne({
                    type: LocationType.PlayerHand,
                    player: player,
                }))
            ),
            numberOfPlayers > 2
                ? this.startSimultaneousRule<RuleId>(RuleId.SendCardToTeamMember)
                : this.startRule<RuleId>(RuleId.PlayKitsuCard)
        ];
    }
}