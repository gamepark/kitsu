import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { getSpecialCardType, isSpecialCard, KitsuCard, KitsuCardSpecialType } from '../material/KitsuCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PowerToken } from '../material/PowerToken'
import { RuleId } from './RuleId'

export class PickCardInDiscardRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  public onRuleStart(
    _move: RuleMove<number, RuleId>,
    _previousRule?: RuleStep,
    _context?: PlayMoveContext,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const numberOfCardsToPick = this.game.players.length === 6 ? 6 : 4
    const ruleMove = this.isParentCardKatana() ? this.startRule(RuleId.SelectKatanaTarget) : this.startPlayerTurn(this.getNextPlayerRuleId(), this.nextPlayer)
    const lastDiscardedCards = this.material(MaterialType.KitsuCard)
      .location(LocationType.KitsuCardDiscardSpotOnWisdomBoard)
      .sort((item) => - (item.location.x ?? 0))
      .limit(numberOfCardsToPick)
    return lastDiscardedCards.length === numberOfCardsToPick
      ? [lastDiscardedCards.moveItemsAtOnce({ type: LocationType.DiscardedCardsToPickSpot, player: this.player })]
      : [ruleMove]
  }

  public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
    return this.material(MaterialType.KitsuCard).location(LocationType.DiscardedCardsToPickSpot).moveItems({
      type: LocationType.PlayerHand,
      player: this.player,
    })
  }

  public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
    if (
      isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.PlayerHand &&
      move.location.player === this.player
    ) {
      const moves: MaterialMove<number, MaterialType, LocationType>[] = [
        this.material(MaterialType.KitsuCard).location(LocationType.DiscardedCardsToPickSpot).moveItemsAtOnce({
          type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
        }),
      ]
      moves.push(this.isParentCardKatana() ? this.startRule(RuleId.SelectKatanaTarget) : this.startPlayerTurn(this.getNextPlayerRuleId(), this.nextPlayer))
      return moves
    }
    return []
  }

  private getNextPlayerRuleId(): RuleId {
    const numberOfPlayers = this.game.players.length
    const numberOfCardsToPlay = numberOfPlayers === 6 ? 6 : 4
    return this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length === numberOfCardsToPlay
      ? RuleId.EndOfTrickKistunePawnMove
      : RuleId.PlayKitsuCard
  }

  private isParentCardKatana(): boolean {
    const parentCardIndex = this.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.PickDiscarded).getItem<PowerToken>()?.location.parent
    if (parentCardIndex === undefined) {
      throw Error('Invalid parent index')
    }
    const parentCard = this.material(MaterialType.KitsuCard).getItem<KitsuCard>(parentCardIndex)
    return isSpecialCard(parentCard.id) && getSpecialCardType(parentCard.id) === KitsuCardSpecialType.Katana
  }
}
