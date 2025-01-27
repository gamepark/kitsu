import { MaterialGameSetup } from '@gamepark/rules-api'
import { KitsuOptions } from './KitsuOptions'
import { KitsuRules } from './KitsuRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'
import { Memorize } from "./Memorize";
import { TeamColor } from "./TeamColor";
import { kitsunePawnIds } from "./material/KitsunePawn";
import { kitsuCardIds, last24PlayersKitsuCardId } from "./material/KitsuCard";
import { powerToken } from "./material/PowerToken";

/**
 * This class creates a new Game based on the game options
 */
export class KitsuSetup extends MaterialGameSetup<number, MaterialType, LocationType, KitsuOptions> {
  Rules = KitsuRules

  setupMaterial(options: KitsuOptions) {
    this.MemorizeTeamsAndReorderPlayers(options);
    this.CreateKitsunePawns();
    this.CreateKitsuCards();
    this.CreatePowerTokens();
  }

  start() {
    this.startPlayerTurn(RuleId.RoundSetup, this.players[0])
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
    // How can we get the length of the kitsuCardsIds enum ?
    const lastCardToTake = this.players.length === 6 ? kitsuCardIds.length : last24PlayersKitsuCardId;

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
        id:0,
        type: LocationType.KitsunePawnSpotOnWisdomBoard,
      },
    })));
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