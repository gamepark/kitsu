import { isShuffleItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class RoundSetupDealCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  public onRuleStart(
    _move: RuleMove<number, RuleId>,
    _previousRule?: RuleStep,
    _context?: PlayMoveContext,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const deck = this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).deck()
    const numberOfPlayers = this.game.players.length
    return [
      deck.shuffle(),
      numberOfPlayers > 2 ? this.startSimultaneousRule<RuleId>(RuleId.SendCardToTeamMember) : this.startRule<RuleId>(RuleId.PlayKitsuCard),
    ]
  }

  public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
    if (isShuffleItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)) {
      const deck = this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).deck()
      const currentLeader = this.material(MaterialType.LeaderToken).getItem()?.location.player
      if (currentLeader === undefined) {
        throw Error('Invalid leader')
      }
      const leaderPlayerIndex = this.game.players.indexOf(currentLeader)
      const numberOfPlayers = this.game.players.length
      const dealPlayerOrder = this.game.players
        .slice((leaderPlayerIndex + 1) % numberOfPlayers)
        .concat(this.game.players.slice(0, (leaderPlayerIndex + 1) % numberOfPlayers))
      const numberOfCardsToDeal = this.game.players.length === 6 ? 5 : 6
      return Array(numberOfCardsToDeal)
        .fill(1)
        .flatMap(() =>
          dealPlayerOrder.map((player) =>
            deck.dealOne({
              type: LocationType.PlayerHand,
              player: player,
            }),
          ),
        )
    }
    return []
  }
}
