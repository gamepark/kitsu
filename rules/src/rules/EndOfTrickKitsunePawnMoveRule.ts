import { Material, MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { getKitsuCardValue, getSpecialCardType, isSpecialCard, isYakoCard, isZenkoCard, KitsuCard, KitsuCardSpecialType } from '../material/KitsuCard'
import { KitsuCardRotation } from '../material/KitsuCardRotation'
import { KitsunePawn } from '../material/KitsunePawn'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PowerToken } from '../material/PowerToken'
import { PowerTokenPlus3Side } from '../material/PowerTokenPlus3Side'
import { VictoryCard } from '../material/VictoryCard'
import { Memorize } from '../Memorize'
import { TeamColor } from '../TeamColor'
import { RuleId } from './RuleId'

export class EndOfTrickKitsunePawnMoveRule extends PlayerTurnRule<number, MaterialType, LocationType> {
  public onRuleStart(
    _move: RuleMove<number, RuleId>,
    _previousRule?: RuleStep,
    _context?: PlayMoveContext,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const playedCards = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot)
    const playedTokens = this.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnKitsuCard)
    const { zenkoScore, yakoScore, winningTeam, protectedCard } = EndOfTrickKitsunePawnMoveRule.getWinningTeamAndScoreDifference(playedCards, playedTokens)
    const scoreDifference = Math.abs(zenkoScore - yakoScore)

    const discardCardsRuleMove = this.startRule(RuleId.EndOfTrickDiscardCards)
    if (
      winningTeam === undefined ||
      this.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.NoAdvance).location(LocationType.PowerTokenSpotOnKitsuCard).length === 1
    ) {
      return protectedCard !== undefined
        ? [this.material(MaterialType.KitsuCard).id<KitsuCard>(protectedCard.id).rotateItem(undefined), discardCardsRuleMove]
        : [discardCardsRuleMove]
    }
    const currentKitsuneSpotId = this.material(MaterialType.KitsunePawn)
      .id<KitsunePawn>(winningTeam === TeamColor.Zenko ? KitsunePawn.Zenko : KitsunePawn.Yako)
      .getItem<KitsunePawn>()?.location.id as number
    const finalKitsuneSpotId = Math.min(currentKitsuneSpotId + scoreDifference, 13)
    const moves = this.getRevealProtectedCardAndKitsunePawnMoves(winningTeam, currentKitsuneSpotId, finalKitsuneSpotId, protectedCard)
    if (finalKitsuneSpotId - currentKitsuneSpotId >= 4) {
      moves.push(this.getRuleMoveToPickAvailableToken(winningTeam, finalKitsuneSpotId))
    } else {
      moves.push(discardCardsRuleMove)
    }
    return moves
  }

  private getRevealProtectedCardAndKitsunePawnMoves(
    winningTeam: TeamColor,
    currentKitsuneSpotId: number,
    finalKitsuneSpotId: number,
    protectedCard: MaterialItem<number, LocationType, KitsuCard> | undefined,
  ): MaterialMove<number, MaterialType, LocationType>[] {
    const kitsuneSpotMaterial = this.material(MaterialType.KitsunePawn).id(winningTeam)
    return [
      ...(protectedCard !== undefined ? [this.material(MaterialType.KitsuCard).id<KitsuCard>(protectedCard.id).rotateItem(undefined)] : []),
      ...Array(finalKitsuneSpotId - currentKitsuneSpotId)
        .fill(1)
        .map((_, index) =>
          kitsuneSpotMaterial.moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: currentKitsuneSpotId + 1 + index,
          }),
        ),
    ]
  }

  public static getWinningTeamAndScoreDifference(
    playedCards: Material<number, MaterialType, LocationType>,
    playedTokens: Material<number, MaterialType, LocationType>,
    alreadyRevealed = false,
  ): {
    zenkoScore: number
    yakoScore: number
    winningTeam: TeamColor | undefined
    protectedCard: MaterialItem<number, LocationType, KitsuCard> | undefined
  } {
    const numberOfColourExchangeEffects =
      playedCards.id<KitsuCard>((id) => isSpecialCard(id) && getSpecialCardType(id) === KitsuCardSpecialType.WhiteKitsune).length +
      playedTokens.id<PowerToken>(PowerToken.ColourExchange).length
    const invertColors = numberOfColourExchangeEffects % 2 === 1
    const protectionToken = playedTokens.id<PowerToken>(PowerToken.Protection).getItem<PowerToken>()
    const protectedCard = protectionToken !== undefined ? playedCards.index(protectionToken.location.parent).getItem<KitsuCard>() : undefined
    const plus3Token = playedTokens.id<PowerToken>(PowerToken.Plus3).getItem<PowerToken>()
    const isPlus3Yako =
      plus3Token !== undefined &&
      (invertColors ? plus3Token.location.rotation === PowerTokenPlus3Side.Zenko : plus3Token.location.rotation !== PowerTokenPlus3Side.Zenko)
    const isPlus3Zenko =
      plus3Token !== undefined &&
      (invertColors ? plus3Token.location.rotation !== PowerTokenPlus3Side.Zenko : plus3Token.location.rotation === PowerTokenPlus3Side.Zenko)
    const yakoScore =
      EndOfTrickKitsunePawnMoveRule.getScore(playedCards, invertColors ? TeamColor.Zenko : TeamColor.Yako, alreadyRevealed ? undefined : protectedCard) +
      (isPlus3Yako ? 3 : 0)
    const zenkoScore =
      EndOfTrickKitsunePawnMoveRule.getScore(playedCards, invertColors ? TeamColor.Yako : TeamColor.Zenko, alreadyRevealed ? undefined : protectedCard) +
      (isPlus3Zenko ? 3 : 0)
    const winningTeam = Math.abs(yakoScore - zenkoScore) === 0 ? undefined : yakoScore > zenkoScore ? TeamColor.Yako : TeamColor.Zenko
    return { zenkoScore, yakoScore, winningTeam, protectedCard }
  }

  public static getScore(
    playedCards: Material<number, MaterialType, LocationType>,
    team: TeamColor,
    protectedCard?: MaterialItem<number, LocationType, KitsuCard>,
  ) {
    const filteringFunction = team === TeamColor.Zenko ? isZenkoCard : isYakoCard
    return playedCards
      .id<KitsuCard>((id) => filteringFunction(id))
      .getItems<KitsuCard>((item) => item.location.rotation !== KitsuCardRotation.FaceDown)
      .reduce(
        (score, card) => score + getKitsuCardValue(card.id),
        !!protectedCard && filteringFunction(protectedCard.id) && !isSpecialCard(protectedCard.id) ? getKitsuCardValue(protectedCard.id) : 0,
      )
  }

  private getRuleMoveToPickAvailableToken(winningTeam: TeamColor, finalWinningKistunePawnSpot: number): MaterialMove<number, MaterialType, LocationType> {
    const currentLeader = this.material(MaterialType.LeaderToken).getItem()?.location.player
    const isCurrentLeaderLoosingTeam = this.remind<TeamColor>(Memorize.Team, currentLeader) !== winningTeam
    if (
      this.material(MaterialType.VictoryCard)
        .location(LocationType.VictoryCardsSpot)
        .id<VictoryCard>(winningTeam === TeamColor.Yako ? VictoryCard.Yako : VictoryCard.Zenko).length === 1 &&
      finalWinningKistunePawnSpot === 13
    ) {
      return this.startRule(RuleId.EndOfTrickDiscardCards)
    }
    if (isCurrentLeaderLoosingTeam) {
      return this.startRule(RuleId.EndOfTrickPickAvailablePowerToken)
    } else if (currentLeader !== undefined) {
      const loosingTeamNextLeader = this.game.players[(this.game.players.indexOf(currentLeader) + 1) % this.game.players.length]
      return this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickPickAvailablePowerToken, loosingTeamNextLeader)
    } else {
      throw Error('undefined current leader')
    }
  }
}
