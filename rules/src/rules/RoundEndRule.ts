import {
    CustomMove,
    isCustomMoveType,
    MaterialMove,
    PlayerTurnRule,
    PlayMoveContext,
    RuleMove,
    RuleStep
} from '@gamepark/rules-api';
import { CustomMoveType } from '../material/CustomMoveType';
import { KitsunePawn } from '../material/KitsunePawn';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { VictoryCard } from '../material/VictoryCard';
import { Memorize } from '../Memorize';
import { TeamColor } from '../TeamColor';
import { RuleId } from './RuleId';

export class RoundEndRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    public onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const victoriousPawn = this.material(MaterialType.KitsunePawn).location(LocationType.KitsunePawnSpotOnWisdomBoard).locationId(13).getItem();

        if (victoriousPawn !== undefined) {
            const victoryCard = this.material(MaterialType.VictoryCard).location(LocationType.VictoryCardsSpot).id(victoriousPawn.id === KitsunePawn.Yako ? VictoryCard.Yako : VictoryCard.Zenko);

            if (victoryCard.length === 1 && victoryCard.getItem()!.id === victoriousPawn.id) {
                return [this.endGame()];
            }

            return [
                this.material(MaterialType.KitsuCard).moveItemsAtOnce({type: LocationType.KitsuCardDeckSpotOnWisdomBoard}),
                this.material(MaterialType.VictoryCard).createItem({
                    id: victoriousPawn.id,
                    location: {
                        type: LocationType.VictoryCardsSpot
                    },
                }),
                this.customMove<CustomMoveType>(CustomMoveType.PickRandomPlayer),
            ];
        }
        return [];
    }

    public onCustomMove(move: CustomMove, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move)) {
            const victoriousTeam = this.material(MaterialType.KitsunePawn).location(LocationType.KitsunePawnSpotOnWisdomBoard).locationId(13).getItem()!.id === KitsunePawn.Zenko ? TeamColor.Zenko : TeamColor.Yako;
            const victoriousPlayers = this.game.players.filter(player => this.remind<TeamColor>(Memorize.Team, player) === victoriousTeam);
            const nextLeader = victoriousPlayers[move.data];
            return [
                this.material(MaterialType.LeaderToken).moveItem({
                    type: LocationType.LeaderTokenSpotOnClanCard,
                    player: nextLeader
                }),
                this.startPlayerTurn(RuleId.RoundSetupMoveKitsunePawns, nextLeader),
            ];
        }
        return [];
    }
}