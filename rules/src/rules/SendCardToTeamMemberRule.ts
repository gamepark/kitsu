import { isMoveItemType, ItemMove, MaterialMove, PlayMoveContext, SimultaneousRule } from '@gamepark/rules-api'
import { KitsuCardRotation } from '../material/KitsuCardRotation'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { RuleId } from './RuleId'

export class SendCardToTeamMemberRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: number): MaterialMove<number, MaterialType, LocationType>[] {
    return this.material(MaterialType.KitsuCard)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.PlayedKitsuCardSpot, player: player, rotation: KitsuCardRotation.FaceDown })
  }

  afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
    if (
      isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.PlayedKitsuCardSpot &&
      move.location.player !== undefined
    ) {
      return [this.endPlayerTurn(move.location.player)]
    }
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove<number, LocationType, LocationType>[] {
    const leaderToken = this.material(MaterialType.LeaderToken).getItem()
    if (leaderToken?.location.player === undefined) {
      throw new Error('Missing leader token')
    }
    return [
      ...this.material(MaterialType.KitsuCard)
        .location(LocationType.PlayedKitsuCardSpot)
        .moveItems((item) => ({ type: LocationType.PlayerHand, player: this.getDestinationPlayer(item.location.player), rotation: undefined })),
      this.startPlayerTurn(RuleId.PlayKitsuCard, leaderToken.location.player),
    ]
  }

  private getDestinationPlayer(player: number | undefined) {
    if (player === undefined) {
      throw Error('Missing leader token')
    }
    const nextPlayerIndex = (this.game.players.indexOf(player) + 2) % this.game.players.length
    return this.game.players[nextPlayerIndex]
  }
}
