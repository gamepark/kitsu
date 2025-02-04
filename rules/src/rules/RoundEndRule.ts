import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';
import { Memorize } from "../Memorize";

export class RoundEndRule extends PlayerTurnRule<number, MaterialType, LocationType>{
    public onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const victoriousPawn = this.material(MaterialType.KitsunePawn).location(LocationType.KitsunePawnSpotOnWisdomBoard).locationId(13).getItem();

        if (victoriousPawn !== undefined) {
            const victoryCard = this.material(MaterialType.VictoryCard).location(LocationType.VictoryCardsSpot);

            if (victoryCard.length === 1 && victoryCard.getItem()!.id === victoriousPawn.id) {
                return [this.endGame()];
            }

            const victoriousTeam = this.game.players.filter(player => this.remind(Memorize.Team, player) === victoriousPawn.id);
            const newLeaderIndex = Math.floor(Math.random() * victoriousTeam.length);
            return [
                this.material(MaterialType.VictoryCard).createItem({
                    id: victoriousPawn.id,
                    location: {
                        type: LocationType.VictoryCardsSpot
                    },
                }),
                this.material(MaterialType.LeaderToken).moveItem({
                    type: LocationType.LeaderTokenSpotOnClanCard,
                    player: victoriousTeam[newLeaderIndex],
                }),
                this.startPlayerTurn(RuleId.RoundSetupMoveKitsunePawns, victoriousTeam[newLeaderIndex])
            ];
        }
        return [];
    }
}