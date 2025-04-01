import { MaterialGameSetup } from '@gamepark/rules-api'
import { shuffle } from 'lodash'
import { KitsuOptions } from './KitsuOptions'
import { KitsuRules } from './KitsuRules'
import { kitsuCardIds, last24PlayersKitsuCardEnumValueIndex } from './material/KitsuCard'
import { kitsunePawnIds } from './material/KitsunePawn'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { powerToken } from './material/PowerToken'
import { Memorize } from './Memorize'
import { RuleId } from './rules/RuleId'
import { TeamColor } from './TeamColor'

/**
 * This class creates a new Game based on the game options
 */
export class KitsuSetup extends MaterialGameSetup<number, MaterialType, LocationType, KitsuOptions> {
  Rules = KitsuRules

  setupMaterial(options: KitsuOptions) {
    this.MemorizeTeamsAndReorderPlayers(options)
    this.CreateKitsunePawns()
    this.CreateKitsuCards()
    this.CreatePowerTokens()
    this.CreateLeaderToken()
  }

  start() {
    this.startPlayerTurn(RuleId.RoundSetupMoveKitsunePawns, this.players[0])
  }

  private CreateLeaderToken() {
    this.material(MaterialType.LeaderToken).createItem({
      location: {
        type: LocationType.LeaderTokenSpotOnClanCard,
        player: this.players[0],
      },
    })
  }

  private CreatePowerTokens() {
    this.material(MaterialType.PowerToken).createItems(
      powerToken.map((token) => ({
        id: token,
        location: {
          id: token,
          type: LocationType.PowerTokenSpotOnWisdomBoard,
        },
      })),
    )
  }

  private CreateKitsuCards() {
    const lastCardToTake = this.players.length === 6 ? kitsuCardIds.length : last24PlayersKitsuCardEnumValueIndex

    this.material(MaterialType.KitsuCard).createItems(
      kitsuCardIds.slice(0, lastCardToTake).map((card) => ({
        id: card,
        location: {
          type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
        },
      })),
    )
  }

  private CreateKitsunePawns(): void {
    this.material(MaterialType.KitsunePawn).createItems(
      kitsunePawnIds.map((player) => ({
        id: player,
        location: {
          id: 0,
          type: LocationType.KitsunePawnSpotOnWisdomBoard,
        },
      })),
    )
  }

  private MemorizeTeamsAndReorderPlayers(options: KitsuOptions) {
    const playerOptionsWithTeams = options.players.some((playerOption) => playerOption.team !== TeamColor.Yako && playerOption.team !== TeamColor.Zenko)
      ? this.addMissingTeamsToPlayerOptions(options.players)
      : (options.players as { id?: number; team: TeamColor }[])
    const playerOptionsWithIds = playerOptionsWithTeams.map((playerOption, index) => {
      const playerId = 'id' in playerOption && typeof playerOption.id === 'number' ? playerOption.id : index + 1
      this.memorize<TeamColor>(Memorize.Team, playerOption.team, playerId)
      return { ...playerOption, id: playerId }
    })
    const firstPlayerTeam = options.players[0].team
    const yakoPlayers = this.getTeamMemberIds(playerOptionsWithIds, TeamColor.Yako)
    const zenkoPlayers = this.getTeamMemberIds(playerOptionsWithIds, TeamColor.Zenko)
    this.game.players = Array(yakoPlayers.length)
      .fill(1)
      .flatMap((_, index) => {
        return firstPlayerTeam === TeamColor.Yako ? [yakoPlayers[index], zenkoPlayers[index]] : [zenkoPlayers[index], yakoPlayers[index]]
      })
  }

  private getTeamMemberIds(playerOptionsWithIds: { id: number; team: TeamColor }[], team: TeamColor): number[] {
    return playerOptionsWithIds.filter((playerOption) => playerOption.team === team).map((playerOption) => playerOption.id)
  }

  private getRandomMissingTeamsForPlayers(numberOfPlayers: number, numberOfZenkoPlayers: number, numberOfYakoPlayers: number): TeamColor[] {
    const numberOfPlayersPerTeam = numberOfPlayers / 2
    return shuffle<TeamColor>(
      Array(numberOfPlayersPerTeam - numberOfZenkoPlayers)
        .fill(TeamColor.Zenko)
        .concat(Array(numberOfPlayersPerTeam - numberOfYakoPlayers).fill(TeamColor.Yako)),
    )
  }

  private addMissingTeamsToPlayerOptions(playerOptions: { id?: number; team?: TeamColor }[]): {
    id?: number
    team: TeamColor
  }[] {
    const { [TeamColor.Zenko]: numberOfZenkoPlayers, [TeamColor.Yako]: numberOfYakoPlayers } = playerOptions.reduce(
      (previousCount, currentOption) => {
        if (currentOption.team === TeamColor.Yako || currentOption.team === TeamColor.Zenko) {
          previousCount[currentOption.team] += 1
        }
        return previousCount
      },
      { [TeamColor.Zenko]: 0, [TeamColor.Yako]: 0 },
    )
    const missingPlayerTeams = this.getRandomMissingTeamsForPlayers(playerOptions.length, numberOfZenkoPlayers, numberOfYakoPlayers)
    return playerOptions.map((playerOption) => {
      if (playerOption.team === TeamColor.Yako || playerOption.team === TeamColor.Zenko) {
        return playerOption as { id?: number; team: TeamColor }
      }
      return { ...playerOption, team: missingPlayerTeams.splice(0, 1)[0] }
    })
  }
}
