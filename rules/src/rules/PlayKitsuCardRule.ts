import {
  isMoveItemType,
  isSelectItemType,
  ItemMove,
  Location,
  Material,
  MaterialItem,
  MaterialMove,
  MoveItem,
  PlayerTurnRule,
  PlayMoveContext,
} from '@gamepark/rules-api'
import {
  canBePlayedWithProtectionToken,
  getKitsuCardType,
  getSpecialCardType,
  isKitsuCardMaterial,
  isSpecialCard,
  KitsuCard,
  KitsuCardSpecialType,
  KitsuCardType,
} from '../material/KitsuCard'
import { KitsuCardRotation } from '../material/KitsuCardRotation'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PowerToken } from '../material/PowerToken'
import { PowerTokenPlus3Side } from '../material/PowerTokenPlus3Side'
import { Memorize } from '../Memorize'
import { TeamColor } from '../TeamColor'
import { RuleId } from './RuleId'

export class PlayKitsuCardRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
    const previousPlayer = this.game.players[(this.game.players.indexOf(this.player) - 1 + this.game.players.length) % this.game.players.length]
    const previousPlayerTeam = this.remind<TeamColor>(Memorize.Team, previousPlayer)
    const isPreviousCardBlackKitsune = this.isPlayerPreviousCardABlackKitsune(previousPlayer)
    const protectionPowerToken = this.material(MaterialType.PowerToken)
      .location(
        (location) =>
          (location.type === LocationType.PowerTokenSpotOnClanCard && location.player === this.player) ||
          (location.type === LocationType.PowerTokenSpotOnKitsuCard &&
            this.material(MaterialType.KitsuCard).index(location.parent).player(this.player).length !== 0),
      )
      .id<PowerToken>(PowerToken.Protection)
    const isProtectionTokenSelected = protectionPowerToken.selected(true).getItem<PowerToken>() !== undefined
    const allPlayableCards = this.material(MaterialType.KitsuCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .filter((kitsuCard) => isKitsuCardMaterial(kitsuCard) && (!isProtectionTokenSelected || canBePlayedWithProtectionToken(kitsuCard.id)))
    const cardDestinationLocation = this.getCardsDestination(isProtectionTokenSelected)
    const allMoves: MaterialMove<number, MaterialType, LocationType>[] = allPlayableCards.moveItems(cardDestinationLocation)
    allMoves.push(...this.getPowerTokenMoves(allPlayableCards, protectionPowerToken.getItem<PowerToken>()))
    if (isPreviousCardBlackKitsune && this.areOpposingTeamCardsInHand(allPlayableCards, previousPlayerTeam)) {
      return this.filterMovesBecauseOfBlackKitsune(previousPlayerTeam, allPlayableCards, allMoves)
    }
    return allMoves
  }

  public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) && move.location.type === LocationType.PowerTokenSpotOnKitsuCard) {
      const powerToken = this.material(MaterialType.PowerToken).getItem<PowerToken>(move.itemIndex)
      const isProtectionPowerToken = powerToken.id === PowerToken.Protection
      const parentCard = this.material(MaterialType.KitsuCard).index(move.location.parent)
      const cardMove = isProtectionPowerToken
        ? parentCard.moveItem({
            type: LocationType.PlayedKitsuCardSpot,
            rotation: KitsuCardRotation.FaceDown,
            player: this.player,
          })
        : parentCard.moveItem({
            type: LocationType.PlayedKitsuCardSpot,
            player: this.player,
          })
      return [cardMove]
    }
    if (
      isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.PlayedKitsuCardSpot &&
      move.location.player === this.player
    ) {
      return this.getCardMoveConsequences(move)
    }
    return []
  }

  private getCardMoveConsequences(move: MoveItem<number, MaterialType, LocationType>): MaterialMove<number, MaterialType, LocationType>[] {
    const cardPlayed = this.material(MaterialType.KitsuCard).getItem<KitsuCard>(move.itemIndex)
    const pickInDiscardPowerToken = this.material(MaterialType.PowerToken)
      .id<PowerToken>(PowerToken.PickDiscarded)
      .location(LocationType.PowerTokenSpotOnKitsuCard)
      .parent(move.itemIndex)
    if (pickInDiscardPowerToken.length > 0) {
      return [this.startRule<RuleId>(RuleId.PickDiscardCards)]
    }
    if (isSpecialCard(cardPlayed.id) && getSpecialCardType(cardPlayed.id) === KitsuCardSpecialType.Katana) {
      return [this.startRule(RuleId.SelectKatanaTarget)]
    }
    const numberOfCardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length
    const numberOfCardsToPlay = this.game.players.length === 6 ? 6 : 4
    return numberOfCardsPlayed < numberOfCardsToPlay
      ? [this.startPlayerTurn<number, RuleId>(RuleId.PlayKitsuCard, this.nextPlayer)]
      : [this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer)]
  }

  private areOpposingTeamCardsInHand(cards: Material<number, MaterialType, LocationType>, opposingTeam: TeamColor): boolean {
    const opposingTeamCardType = opposingTeam === TeamColor.Yako ? KitsuCardType.Yako : KitsuCardType.Zenko
    return cards.getItems((card) => isKitsuCardMaterial(card) && getKitsuCardType(card.id) === opposingTeamCardType).length !== 0
  }

  private getCardsDestination(isProtectionTokenSelected: boolean): Location<number, LocationType, KitsuCard, KitsuCardRotation> {
    const cardDestinationLocation: Location<number, LocationType, KitsuCard, KitsuCardRotation> = {
      type: LocationType.PlayedKitsuCardSpot,
      player: this.player,
    }
    if (isProtectionTokenSelected) {
      cardDestinationLocation.rotation = KitsuCardRotation.FaceDown
    }
    return cardDestinationLocation
  }

  private filterMovesBecauseOfBlackKitsune(
    previousPlayerTeam: TeamColor,
    allCards: Material<number, MaterialType, LocationType>,
    allMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const previousPlayerTeamCardType = previousPlayerTeam === TeamColor.Yako ? KitsuCardType.Yako : KitsuCardType.Zenko
    const consideredCardIndexes = allCards.id((cardId: KitsuCard) => getKitsuCardType(cardId) === previousPlayerTeamCardType).getIndexes()
    return allMoves.filter(
      (move) =>
        (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && consideredCardIndexes.includes(move.itemIndex)) ||
        (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) &&
          typeof move.location.parent === 'number' &&
          consideredCardIndexes.includes(move.location.parent)) ||
        isSelectItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move),
    )
  }

  private getPowerTokenMoves(
    allCards: Material<number, MaterialType, LocationType>,
    protectionPowerToken?: MaterialItem<number, LocationType, PowerToken>,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const allCardIndexes = allCards.getIndexes()
    const powerToken = this.material(MaterialType.PowerToken).location(
      (location) =>
        (location.type === LocationType.PowerTokenSpotOnClanCard && location.player === this.player) ||
        (location.type === LocationType.PowerTokenSpotOnKitsuCard && typeof location.parent === 'number' && allCardIndexes.includes(location.parent)),
    )
    if (powerToken.length === 1) {
      const isProtectionPowerToken = protectionPowerToken !== undefined
      const isPlus3PowerToken =
        this.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.Plus3).location(LocationType.PowerTokenSpotOnClanCard).player(this.player).length === 1
      const cardIndexes = allCards
        .filter((kitsuCard) => isKitsuCardMaterial(kitsuCard) && (!isProtectionPowerToken || canBePlayedWithProtectionToken(kitsuCard.id)))
        .getIndexes()
      return cardIndexes.flatMap((cardIndex) => this.mapIndexToTokenAndCardMoveIfNecessary(cardIndex, powerToken, isPlus3PowerToken))
    }
    return []
  }

  private mapIndexToTokenAndCardMoveIfNecessary(
    cardIndex: number,
    powerToken: Material<number, MaterialType, LocationType>,
    isPlus3PowerToken: boolean,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const moves = [
      powerToken.moveItem({
        type: LocationType.PowerTokenSpotOnKitsuCard,
        parent: cardIndex,
      }),
    ]
    if (isPlus3PowerToken) {
      moves.splice(0)
      moves.push(
        powerToken.moveItem({
          type: LocationType.PowerTokenSpotOnKitsuCard,
          parent: cardIndex,
          rotation: PowerTokenPlus3Side.Zenko,
        }),
        powerToken.moveItem({
          type: LocationType.PowerTokenSpotOnKitsuCard,
          parent: cardIndex,
          rotation: PowerTokenPlus3Side.Yako,
        }),
      )
    }
    return moves
  }

  private isPlayerPreviousCardABlackKitsune(previousPlayer: number): boolean {
    const cardPlayedByPreviousPlayer = this.material(MaterialType.KitsuCard)
      .location(LocationType.PlayedKitsuCardSpot)
      .player(previousPlayer)
      .maxBy((card) => card.location.x ?? 0)
      .getItem<KitsuCard>()
    return (
      cardPlayedByPreviousPlayer !== undefined &&
      isSpecialCard(cardPlayedByPreviousPlayer.id) &&
      getSpecialCardType(cardPlayedByPreviousPlayer.id) === KitsuCardSpecialType.BlackKitsune
    )
  }
}
