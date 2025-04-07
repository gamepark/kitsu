import { Theme } from '@emotion/react'
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { KitsuCardRotation } from '@gamepark/kitsu/material/KitsuCardRotation'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { Memorize } from '@gamepark/kitsu/Memorize'
import { EndOfTrickDiscardCardsRule } from '@gamepark/kitsu/rules/EndOfTrickDiscardCardsRule'
import { PickCardInDiscardRule } from '@gamepark/kitsu/rules/PickCardInDiscardRule'
import { PlayKitsuCardRule } from '@gamepark/kitsu/rules/PlayKitsuCardRule'
import { RoundSetupDealCardsRule } from '@gamepark/kitsu/rules/RoundSetupDealCardsRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import {
  isCreateItemType,
  isMoveItemType,
  isMoveItemTypeAtOnce,
  isShuffleItemType,
  isStartPlayerTurn,
  isStartRule,
  MaterialGame,
  MaterialMove,
  MoveItem,
} from '@gamepark/rules-api'
import { EndOfTrickDiscardPlayerHandLogComponent } from '../components/LogComponents/EndOfTrickDiscardPlayerHandLogComponent'
import { EndOfTrickDiscardTrickCardsLogComponent } from '../components/LogComponents/EndOfTrickDiscardTrickCardsLogComponent'
import { EndOfTrickDrawLogComponent } from '../components/LogComponents/EndOfTrickDrawLogComponent'
import { EndOfTrickMoveLeaderTokenLogComponent } from '../components/LogComponents/EndOfTrickMoveLeaderTokenLogComponent'
import { EndOfTrickNoPickToken } from '../components/LogComponents/EndOfTrickNoPickToken'
import { EndOfTrickPickCardsCardDealtLogComponent } from '../components/LogComponents/EndOfTrickPickCardsCardDealtLogComponent'
import { EndOfTrickPickCardsStartLogComponent } from '../components/LogComponents/EndOfTrickPickCardsStartLogComponent'
import { EndOfTrickPickPowerTokenLogComponent } from '../components/LogComponents/EndOfTrickPickPowerTokenLogComponent'
import { EndOfTrickProtectedCardRevealLogComponent } from '../components/LogComponents/EndOfTrickProtectedCardRevealLogComponent'
import { EndOfTrickWinningTeamLogComponent } from '../components/LogComponents/EndOfTrickWinningTeamLogComponent'
import { KatanaTargetLogComponent } from '../components/LogComponents/KatanaTargetLogComponent'
import { KitsuCardPlayedLogComponent } from '../components/LogComponents/KitsuCardPlayedLogComponent'
import { KitsuCardReceiveFromTeamMemberLogComponent } from '../components/LogComponents/KitsuCardReceiveFromTeamMemberLogComponent'
import { KitsuCardSentToTeamMemberLogComponent } from '../components/LogComponents/KitsuCardSentToTeamMemberLogComponent'
import { NoKatanaTargetLogComponent } from '../components/LogComponents/NoKatanaTargetLogComponent'
import { PickDiscardCardCardPickedLogComponent } from '../components/LogComponents/PickDiscardCardCardPickedLogComponent'
import { PickDiscardCardCardsRevealed } from '../components/LogComponents/PickDiscardCardCardsRevealedLogComponent'
import { PickDiscardCardNoCardLogComponent } from '../components/LogComponents/PickDiscardCardNoCardLogComponent'
import { RoundEndVictoryCardCreationLogComponent } from '../components/LogComponents/RoundEndVictoryCardCreationLogComponent'
import { RoundSetupDealCardLogComponent } from '../components/LogComponents/RoundSetupDealCardLogComponent'
import { RoundSetupResetKitsunePawnPositionLogComponent } from '../components/LogComponents/RoundSetupResetKitsunePawnPositionLogComponent'
import { ShufflingDeckLogComponent } from '../components/LogComponents/ShufflingDeckLogComponent'
import { KitsuTheme } from '../KitsuTheme'

export class KitsuHistory
  implements LogDescription<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>
{
  getMovePlayedLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription<MaterialMove<number, MaterialType, LocationType>> | undefined {
    const rule = new KitsuRules(context.game)
    const playerTeam = rule.remind<TeamColor>(Memorize.Team, context.action.playerId)
    if (context.game.rule?.id === RuleId.RoundSetupMoveKitsunePawns) {
      return this.getRoundSetupMoveKitsunePawnsMoveLogDescription(move)
    }
    if (context.game.rule?.id === RuleId.RoundSetupDealCards) {
      return this.getRoundSetupeDealCardsMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.SendCardToTeamMember && isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)) {
      return this.getSendCardToTeamMemberMoveLogDescription(move, context, playerTeam)
    }
    if (context.game.rule?.id === RuleId.PlayKitsuCard) {
      return this.getPlayKitsuCardMoveLogDescription(move, context, playerTeam)
    }
    if (context.game.rule?.id === RuleId.SelectKatanaTarget) {
      return this.getSelectKatanaTargetMoveLogDescription(move, context, playerTeam)
    }
    if (context.game.rule?.id === RuleId.PickDiscardCards) {
      return this.getPickDiscardCardsMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.EndOfTrickKistunePawnMove) {
      return this.getEndOfTrickKitsunePawnMoveMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.EndOfTrickPickAvailablePowerToken) {
      return this.getEndOfTrickPickAvailablePowerTokenMoveLogDescription(move, context, playerTeam)
    }
    if (context.game.rule?.id === RuleId.EndOfTrickDiscardCards) {
      return this.getEndOfTrickDiscardCardsMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.EndOfTrickPickCards) {
      return this.getEndOfTrickPickCardsMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.EndOfTrickMoveLeaderToken) {
      return this.getLeaderTokenMoveLogDescription(move, context)
    }
    if (context.game.rule?.id === RuleId.RoundEnd) {
      return this.getRoundEndMoveLogDescription(move)
    }
    return undefined
  }

  private getSendCardToTeamMemberMoveLogDescription(
    move: MoveItem<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
    playerTeam: TeamColor,
  ): MovePlayedLogDescription | undefined {
    const rule = new KitsuRules(context.game)
    if (move.location.type === LocationType.PlayedKitsuCardSpot) {
      return {
        Component: KitsuCardSentToTeamMemberLogComponent,
        player: context.action.playerId,
        css: logComponentCss(playerTeam),
      }
    } else if (move.location.type === LocationType.PlayerHand) {
      const team = rule.remind<TeamColor>(Memorize.Team, move.location.player)
      return {
        Component: KitsuCardReceiveFromTeamMemberLogComponent,
        player: move.location.player,
        css: logComponentCss(team),
      }
    }
    return undefined
  }

  private getPlayKitsuCardMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
    playerTeam: TeamColor,
  ): MovePlayedLogDescription | undefined {
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)) {
      if (move.location.type === LocationType.PlayedKitsuCardSpot) {
        return { Component: KitsuCardPlayedLogComponent, player: context.action.playerId, css: logComponentCss(playerTeam) }
      }
    }
    if (isStartRule<number, MaterialType, LocationType, RuleId>(move) && move.id === RuleId.SelectKatanaTarget) {
      const nextConsequence = context.consequenceIndex === undefined ? undefined : context.action.consequences[context.consequenceIndex + 1]
      if (
        nextConsequence !== undefined &&
        isStartPlayerTurn<number, MaterialType, LocationType, RuleId>(nextConsequence) &&
        (nextConsequence.id === RuleId.PlayKitsuCard || nextConsequence.id === RuleId.EndOfTrickKistunePawnMove)
      ) {
        return { Component: NoKatanaTargetLogComponent, player: context.action.playerId, css: logComponentCss() }
      }
    }
    if (isStartRule<number, MaterialType, LocationType, RuleId>(move) && move.id === RuleId.PickDiscardCards) {
      const nextConsequence = context.consequenceIndex === undefined ? undefined : context.action.consequences[context.consequenceIndex + 1]
      if (
        nextConsequence !== undefined &&
        isStartPlayerTurn<number, MaterialType, LocationType, RuleId>(nextConsequence) &&
        (nextConsequence.id === RuleId.PlayKitsuCard || nextConsequence.id === RuleId.EndOfTrickKistunePawnMove)
      ) {
        const rule = new PlayKitsuCardRule(context.game)
        return { Component: PickDiscardCardNoCardLogComponent, player: rule.player, css: logComponentCss(rule.remind<TeamColor>(Memorize.Team, rule.player)) }
      }
    }
    return undefined
  }

  private getSelectKatanaTargetMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType, RuleId>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
    playerTeam: TeamColor,
  ): MovePlayedLogDescription | undefined {
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.rotation === KitsuCardRotation.FaceDown) {
      return { Component: KatanaTargetLogComponent, player: context.action.playerId, css: logComponentCss(playerTeam) }
    }
    return undefined
  }

  private getEndOfTrickKitsunePawnMoveMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    if (
      (isStartRule<number, MaterialType, LocationType, RuleId>(move) || isStartPlayerTurn<number, MaterialType, LocationType, RuleId>(move)) &&
      !context.action.consequences.some((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move) && move.location.id !== 0)
    ) {
      return { Component: EndOfTrickDrawLogComponent, css: logComponentCss() }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.reveal?.id !== undefined) {
      return { Component: EndOfTrickProtectedCardRevealLogComponent, css: logComponentCss() }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move)) {
      const firstKitsuneConsequence = context.action.consequences.findIndex(
        (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move) && move.location.id !== 0,
      )
      if (context.action.consequences.indexOf(move) === firstKitsuneConsequence) {
        return { Component: EndOfTrickWinningTeamLogComponent, css: logComponentCss() }
      }
    }
    return undefined
  }

  private getEndOfTrickPickAvailablePowerTokenMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
    playerTeam: TeamColor,
  ): MovePlayedLogDescription | undefined {
    const pickAvailableTokenRuleMoveIndex = context.action.consequences.findIndex(
      (move) =>
        (isStartRule<number, MaterialType, LocationType, RuleId>(move) || isStartPlayerTurn<number, MaterialType, LocationType, RuleId>(move)) &&
        move.id === RuleId.EndOfTrickPickAvailablePowerToken,
    )
    if (
      pickAvailableTokenRuleMoveIndex !== -1 &&
      isStartPlayerTurn<number, MaterialType, LocationType, RuleId>(move) &&
      move.id === RuleId.EndOfTrickDiscardCards &&
      context.action.consequences.indexOf(move) === pickAvailableTokenRuleMoveIndex + 1
    ) {
      return { Component: EndOfTrickNoPickToken, css: logComponentCss() }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) && move.location.type === LocationType.PowerTokenSpotOnClanCard) {
      return { Component: EndOfTrickPickPowerTokenLogComponent, player: context.action.playerId, css: logComponentCss(playerTeam) }
    }
    return undefined
  }

  private getRoundSetupeDealCardsMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    if (isShuffleItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)) {
      return { Component: ShufflingDeckLogComponent, css: logComponentCss() }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand) {
      const firstDealMove = context.action.consequences.findIndex(
        (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand,
      )
      if (context.action.consequences.indexOf(move) === firstDealMove) {
        const rules = new RoundSetupDealCardsRule(context.game)
        return { Component: RoundSetupDealCardLogComponent, player: rules.player, css: logComponentCss(rules.remind<TeamColor>(Memorize.Team, rules.player)) }
      }
    }
    return undefined
  }

  private getLeaderTokenMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    if (
      isStartRule<number, MaterialType, LocationType, RuleId>(move) &&
      context.action.consequences.some(
        (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand,
      )
    ) {
      return { Component: EndOfTrickPickCardsStartLogComponent, css: logComponentCss() }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken)(move)) {
      return { Component: EndOfTrickMoveLeaderTokenLogComponent, css: logComponentCss() }
    }
    return undefined
  }

  private getRoundEndMoveLogDescription(move: MaterialMove<number, MaterialType, LocationType>): MovePlayedLogDescription | undefined {
    if (isCreateItemType<number, MaterialType, LocationType>(MaterialType.VictoryCard)(move)) {
      return { Component: RoundEndVictoryCardCreationLogComponent, css: logComponentCss() }
    }
    return undefined
  }

  private getEndOfTrickDiscardCardsMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    if (
      isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.KitsuCardDiscardSpotOnWisdomBoard
    ) {
      return { Component: EndOfTrickDiscardTrickCardsLogComponent, css: logComponentCss() }
    }
    if (
      isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.KitsuCardDiscardSpotOnWisdomBoard
    ) {
      const rule = new EndOfTrickDiscardCardsRule(context.game)
      const owningPlayer = rule.material(MaterialType.KitsuCard).index(move.itemIndex).getItem<KitsuCard>()?.location.player
      return {
        Component: EndOfTrickDiscardPlayerHandLogComponent,
        player: owningPlayer,
        css: logComponentCss(rule.remind<TeamColor>(Memorize.Team, owningPlayer)),
      }
    }
    return undefined
  }

  private getRoundSetupMoveKitsunePawnsMoveLogDescription(move: MaterialMove<number, MaterialType, LocationType>): MovePlayedLogDescription | undefined {
    if (isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move)) {
      return { Component: RoundSetupResetKitsunePawnPositionLogComponent, css: logComponentCss() }
    }
    if (isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.PowerToken)(move)) {
      return { Component: RoundSetupResetKitsunePawnPositionLogComponent, css: logComponentCss() }
    }
    return undefined
  }

  private getEndOfTrickPickCardsMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand) {
      const rule = new KitsuRules(context.game)
      return {
        Component: EndOfTrickPickCardsCardDealtLogComponent,
        player: move.location.player,
        css: logComponentCss(rule.remind<TeamColor>(Memorize.Team, move.location.player)),
      }
    }
    return undefined
  }

  private getPickDiscardCardsMoveLogDescription(
    move: MaterialMove<number, MaterialType, LocationType>,
    context: MoveComponentContext<MaterialMove<number, MaterialType, LocationType>, number, MaterialGame<number, MaterialType, LocationType, RuleId>>,
  ): MovePlayedLogDescription | undefined {
    const rule = new PickCardInDiscardRule(context.game)
    if (
      isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      move.location.type === LocationType.DiscardedCardsToPickSpot
    ) {
      const actingPlayer = rule.player
      return { Component: PickDiscardCardCardsRevealed, player: actingPlayer, css: logComponentCss(rule.remind<TeamColor>(Memorize.Team, actingPlayer)) }
    }
    if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayerHand) {
      return {
        Component: PickDiscardCardCardPickedLogComponent,
        player: move.location.player,
        css: logComponentCss(rule.remind<TeamColor>(Memorize.Team, move.location.player)),
      }
    }
    return undefined
  }
}

const logComponentCss = (team?: TeamColor) => (theme: Theme) => {
  const gameTheme = theme as typeof KitsuTheme
  const themeObject = team === undefined ? gameTheme.logBlack : team === TeamColor.Yako ? gameTheme.logYako : gameTheme.logZenko
  return {
    backgroundImage: `url(${themeObject.backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
  }
}
