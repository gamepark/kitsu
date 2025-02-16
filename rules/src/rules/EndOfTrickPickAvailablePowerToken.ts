import {
    isMoveItemType,
    ItemMove,
    MaterialMove,
    PlayerTurnRule,
    PlayMoveContext,
    RuleMove,
    RuleStep
} from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class EndOfTrickPickAvailablePowerToken extends PlayerTurnRule<number, MaterialType, LocationType> {

    private get teamMembers() {
        const currentPlayerIndex = this.game.players.indexOf(this.player);
        return this.game.players.filter(player => Math.abs(this.game.players.indexOf(player) - currentPlayerIndex) % 2 === 0);
    }

    public onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const teamMembers = this.teamMembers;
        if (this.material(MaterialType.PowerToken)
            .location(LocationType.PowerTokenSpotOnClanCard)
            .player(player => teamMembers.includes(player!))
            .length !== 0) {
            const currentLeader = this.material(MaterialType.LeaderToken).getItem()!.location.player!;
            return [this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickDiscardCards, currentLeader)];
        }
        return [];
    }

    public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        return this.teamMembers
            .flatMap(player => this.material(MaterialType.PowerToken)
                .location(LocationType.PowerTokenSpotOnWisdomBoard)
                .moveItems({
                    type: LocationType.PowerTokenSpotOnClanCard,
                    player: player,
                })
            );
    }

    public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) && this.teamMembers.includes(move.location.player!)) {
            const currentLeader = this.material(MaterialType.LeaderToken).getItem()!.location.player!;
            return [this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickDiscardCards, currentLeader)];
        }
        return [];
    }
}