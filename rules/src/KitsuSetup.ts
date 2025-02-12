import { MaterialGameSetup } from '@gamepark/rules-api';
import { shuffle } from 'lodash';
import { KitsuOptions } from './KitsuOptions';
import { KitsuRules } from './KitsuRules';
import { kitsuCardIds, last24PlayersKitsuCardEnumValueIndex } from './material/KitsuCard';
import { kitsunePawnIds } from './material/KitsunePawn';
import { LocationType } from './material/LocationType';
import { MaterialType } from './material/MaterialType';
import { powerToken } from './material/PowerToken';
import { Memorize } from './Memorize';
import { RuleId } from './rules/RuleId';
import { TeamColor } from './TeamColor';

/**
 * This class creates a new Game based on the game options
 */
export class KitsuSetup extends MaterialGameSetup<number, MaterialType, LocationType, KitsuOptions> {
    Rules = KitsuRules;

    setupMaterial(options: KitsuOptions) {
        this.MemorizeTeamsAndReorderPlayers(options);
        this.CreateKitsunePawns();
        this.CreateKitsuCards();
        this.CreatePowerTokens();
        this.CreateLeaderToken();
    }

    start() {
        this.startPlayerTurn(RuleId.RoundSetupMoveKitsunePawns, this.players[0]);
    }

    private CreateLeaderToken() {
        this.material(MaterialType.LeaderToken).createItem({
            location: {
                type: LocationType.LeaderTokenSpotOnClanCard,
                player: this.players[0],
            },
        });
    }

    private CreatePowerTokens() {
        this.material(MaterialType.PowerToken).createItems(powerToken.map(token => ({
            id: token,
            location: {
                id: token,
                type: LocationType.PowerTokenSpotOnWisdomBoard,
            },
        })));
    }

    private CreateKitsuCards() {
        const lastCardToTake = this.players.length === 6 ? kitsuCardIds.length : last24PlayersKitsuCardEnumValueIndex;

        this.material(MaterialType.KitsuCard).createItems(kitsuCardIds.slice(0, lastCardToTake).map(card => ({
            id: card,
            location: {
                type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
            },
        })));
    }

    private CreateKitsunePawns(): void {
        this.material(MaterialType.KitsunePawn).createItems(kitsunePawnIds.map(player => ({
            id: player,
            location: {
                id: 0,
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
            },
        })));
    }

    private MemorizeTeamsAndReorderPlayers(options: KitsuOptions) {
        const playerOptionsWithTeams = options.players.every(playerOption => playerOption.team === undefined)
            ? this.addTeamToPlayerOptions(options.players)
            : options.players as { id?: number, team: TeamColor }[];
        const playerOptionsWithIds = playerOptionsWithTeams.map((playerOption, index) => {
            const playerId = 'id' in playerOption && typeof playerOption.id === 'number' ? playerOption.id : index + 1;
            this.memorize<TeamColor>(Memorize.Team, playerOption.team!, playerId);
            return {...playerOption, id: playerId};
        });
        const firstPlayerTeam = options.players[0].team;
        const yakoPlayers = this.getTeamMemberIds(playerOptionsWithIds, TeamColor.Yako);
        const zenkoPlayers = playerOptionsWithIds.filter(playerOption => playerOption.team === TeamColor.Zenko)
            .map(playerOption => playerOption.id);
        this.game.players = Array(yakoPlayers.length).fill(1).flatMap((_, index) => {
            return firstPlayerTeam === TeamColor.Yako
                ? [yakoPlayers[index], zenkoPlayers[index]]
                : [zenkoPlayers[index], yakoPlayers[index]];
        });
    }

    private getTeamMemberIds(playerOptionsWithIds: { id: number, team: TeamColor }[], team: TeamColor): number[] {

        return playerOptionsWithIds.filter(playerOption => playerOption.team === team)
            .map(playerOption => playerOption.id);
    }

    private getRandomTeamsForPlayers(numberOfPlayers: number): TeamColor[] {
        return shuffle(Array(numberOfPlayers).fill(0).map((_, index) => index % 2 === 0 ? TeamColor.Yako : TeamColor.Zenko));
    }

    private addTeamToPlayerOptions(playerOptions: { id?: number, team?: TeamColor }[]): {
        id?: number,
        team: TeamColor
    }[] {
        const playerTeam = this.getRandomTeamsForPlayers(playerOptions.length);
        return playerOptions.map((playerOption, index) => ({...playerOption, team: playerTeam[index]}));
    }
}