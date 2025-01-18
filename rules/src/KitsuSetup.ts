import { MaterialGameSetup } from '@gamepark/rules-api'
import { KitsuOptions } from './KitsuOptions'
import { KitsuRules } from './KitsuRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'
import { Memorize } from "./Memorize";
import { TeamColor } from "./TeamColor";
import { kitsunePawnIds } from "./material/KitsunePawn";

/**
 * This class creates a new Game based on the game options
 */
export class KitsuSetup extends MaterialGameSetup<number, MaterialType, LocationType, KitsuOptions> {
  Rules = KitsuRules

  setupMaterial(options: KitsuOptions) {
    this.MemorizeTeamsAndReorderPlayers(options);
    this.material(MaterialType.KitsunePawn).createItems(kitsunePawnIds.map(player => ({
      id: player,
      location: {
        id: 1,
        type: LocationType.KitsunePawnSpotOnWisdomBoard,
      },
    })));
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }

  private MemorizeTeamsAndReorderPlayers(options: KitsuOptions) {
    options.players.forEach(playerOption => {
      if ('id' in playerOption && typeof playerOption.id === 'number') {
        this.memorize(Memorize.Team, playerOption.team, playerOption.id)
      }
    });
    const firstPlayerTeam = options.players[0].team;
    const yakoPlayers = options.players.filter(playerOption => playerOption.team === TeamColor.Yako).map(playerOption => {
      if ('id' in playerOption && typeof playerOption.id === 'number') {
        return playerOption.id;
      }
      return NaN;
    });
    const zenkoPlayers = options.players.filter(playerOption => playerOption.team === TeamColor.Zenko).map(playerOption => {
      if ('id' in playerOption && typeof playerOption.id === 'number') {
        return playerOption.id;
      }
      return NaN;
    });
    this.game.players = Array(yakoPlayers.length).fill(1).flatMap((_, index) => {
      return firstPlayerTeam === TeamColor.Yako
          ? [yakoPlayers[index], zenkoPlayers[index]]
          : [zenkoPlayers[index], yakoPlayers[index]];
    });
  }

  /*private extractTeamPlayers(options: KitsuOptions, team: TeamColor) {
    return options.players.filter(playerOption => playerOption.team === team).map(playerOption => {
          if ('id' in playerOption && typeof playerOption.id === 'number') {
            return playerOption.id;
          }
          return NaN;
        });
  }*/
}