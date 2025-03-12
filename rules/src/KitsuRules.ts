import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  isCustomMoveType,
  isMoveItemType,
  MaterialGame,
  MaterialMove,
  MaterialMoveRandomized,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit,
} from '@gamepark/rules-api'
import { CustomMoveType } from './material/CustomMoveType'
import { hideToTOthersWhenRotatedFaceDown } from './material/HideToTOthersWhenRotatedFaceDown'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PowerToken } from './material/PowerToken'
import { VictoryCard } from './material/VictoryCard'
import { Memorize } from './Memorize'
import { EndOfTrickDecideEndOfRoundRule } from './rules/EndOfTrickDecideEndOfRoundRule'
import { EndOfTrickDiscardCardsRule } from './rules/EndOfTrickDiscardCardsRule'
import { EndOfTrickKitsunePawnMoveRule } from './rules/EndOfTrickKitsunePawnMoveRule'
import { EndOfTrickMoveLeaderTokenRule } from './rules/EndOfTrickMoveLeaderTokenRule'
import { EndOfTrickPickAvailablePowerToken } from './rules/EndOfTrickPickAvailablePowerToken'
import { EndOfTrickPickCardsRule } from './rules/EndOfTrickPickCardsRule'
import { PickCardInDiscardRule } from './rules/PickCardInDiscardRule'
import { PlayKitsuCardRule } from './rules/PlayKitsuCardRule'
import { RoundEndRule } from './rules/RoundEndRule'
import { RoundSetupDealCardsRule } from './rules/RoundSetupDealCardsRule'
import { RoundSetupMoveKitsunePawnsRule } from './rules/RoundSetupMoveKitsunePawnsRule'
import { RuleId } from './rules/RuleId'
import { SelectKatanaTargetRule } from './rules/SelectKatanaTargetRule'
import { SendCardToTeamMemberRule } from './rules/SendCardToTeamMemberRule'
import { TeamColor } from './TeamColor'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class KitsuRules
  extends SecretMaterialRules<number, MaterialType, LocationType>
  implements
    TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>
{
  rules = {
    [RuleId.RoundSetupMoveKitsunePawns]: RoundSetupMoveKitsunePawnsRule,
    [RuleId.RoundSetupDealCards]: RoundSetupDealCardsRule,
    [RuleId.SendCardToTeamMember]: SendCardToTeamMemberRule,
    [RuleId.PlayKitsuCard]: PlayKitsuCardRule,
    [RuleId.SelectKatanaTarget]: SelectKatanaTargetRule,
    [RuleId.PickDiscardCards]: PickCardInDiscardRule,
    [RuleId.EndOfTrickKistunePawnMove]: EndOfTrickKitsunePawnMoveRule,
    [RuleId.EndOfTrickPickAvailablePowerToken]: EndOfTrickPickAvailablePowerToken,
    [RuleId.EndOfTrickDiscardCards]: EndOfTrickDiscardCardsRule,
    [RuleId.EndOfTrickDecideEndOfRound]: EndOfTrickDecideEndOfRoundRule,
    [RuleId.EndOfTrickMoveLeaderToken]: EndOfTrickMoveLeaderTokenRule,
    [RuleId.EndOfTrickPickCards]: EndOfTrickPickCardsRule,
    [RuleId.RoundEnd]: RoundEndRule,
  }

  locationsStrategies = {
    [MaterialType.KitsunePawn]: {
      [LocationType.KitsunePawnSpotOnWisdomBoard]: new PositiveSequenceStrategy(),
    },
    [MaterialType.KitsuCard]: {
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.KitsuCardDeckSpotOnWisdomBoard]: new PositiveSequenceStrategy(),
      [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: new PositiveSequenceStrategy(),
      [LocationType.PlayedKitsuCardSpot]: new PositiveSequenceStrategy(),
      [LocationType.DiscardedCardsToPickSpot]: new PositiveSequenceStrategy(),
    },
    [MaterialType.PowerToken]: {
      [LocationType.DiscardedPowerTokenAreaOnWisdomBoard]: new PositiveSequenceStrategy(),
    },
    [MaterialType.VictoryCard]: {
      [LocationType.VictoryCardsSpot]: new PositiveSequenceStrategy(),
    },
  }

  hidingStrategies = {
    [MaterialType.KitsuCard]: {
      [LocationType.KitsuCardDeckSpotOnWisdomBoard]: hideItemId,
      [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: hideItemId,
      [LocationType.PlayerHand]: hideItemIdToOthers,
      [LocationType.PlayedKitsuCardSpot]: hideToTOthersWhenRotatedFaceDown,
      [LocationType.DiscardedCardsToPickSpot]: hideItemIdToOthers,
    },
  }

  public randomize(
    move: MaterialMove<number, MaterialType, LocationType>,
    player?: number,
  ): MaterialMove<number, MaterialType, LocationType> & MaterialMoveRandomized<number, MaterialType, LocationType> {
    if (isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move)) {
      return { ...move, data: Math.floor(Math.random() * Math.floor(this.players.length / 2)) }
    }
    return super.randomize(move, player)
  }

  public giveTime(): number {
    return 60
  }

  public isUnpredictableMove(move: MaterialMove<number, MaterialType, LocationType>, player: number): boolean {
    return (
      super.isUnpredictableMove(move, player) ||
      isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move) ||
      this.isUnpredictableMoveBecauseOfProtectionToken(move)
    )
  }

  public getScore(playerId: number): number {
    const playerTeam = this.remind<TeamColor>(Memorize.Team, playerId)
    return this.material(MaterialType.VictoryCard)
      .location(LocationType.VictoryCardsSpot)
      .id<VictoryCard>(playerTeam === TeamColor.Yako ? VictoryCard.Yako : VictoryCard.Zenko).length
  }

  public getTieBreaker(_tieBreaker: number, _playerId: number): undefined {
    return undefined
  }

  private isUnpredictableMoveBecauseOfProtectionToken(move: MaterialMove<number, MaterialType, LocationType>): boolean {
    return (
      this.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.Protection).location(LocationType.PowerTokenSpotOnKitsuCard).length === 1 &&
      (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move) ||
        isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))
    )
  }
}
