import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class EndOfTrickPickCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  public onRuleStart(
    _move: RuleMove<number, RuleId>,
    _previousRule?: RuleStep,
    _context?: PlayMoveContext,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const leaderPlayer = this.material(MaterialType.LeaderToken).getItem()?.location.player
    if (leaderPlayer === undefined) {
      throw new Error('Invalid leader player')
    }
    const ruleMove = this.startPlayerTurn(RuleId.PlayKitsuCard, leaderPlayer)
    if (this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).length !== 0) {
      const deck = this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).deck()
      const dealPlayerOrder = this.player === leaderPlayer ? [this.nextPlayer, this.player] : [this.player, this.nextPlayer]
      return [
        ...Array(2)
          .fill(1)
          .flatMap(() =>
            dealPlayerOrder.map((player) =>
              deck.dealOne({
                type: LocationType.PlayerHand,
                player: player,
              }),
            ),
          ),
        ruleMove,
      ]
    }

    return [ruleMove]
  }
}
