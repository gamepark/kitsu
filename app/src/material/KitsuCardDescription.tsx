/** @jsxImportSource @emotion/react */
import { faArrowRotateRight, faHandPointer, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard'
import { KitsuCardRotation } from '@gamepark/kitsu/material/KitsuCardRotation'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { CardDescription, ItemContext, ItemMenuButton, MaterialContext } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { KitsuCardHelp } from '../components/Help/KitsuCardHelp'
import KitsuCardBack from '../images/Cards/KitsuCardBack.jpg'
import KitsuCardBlackKistsuneFront from '../images/Cards/KitsuCardBlackKitsuneFront.jpg'
import KitsuCardKatanaFront from '../images/Cards/KitsuCardKatanaFront.jpg'
import KitsuCardWhiteKistsuneFront from '../images/Cards/KitsuCardWhiteKitsuneFront.jpg'
import KitsuCardYako1Front from '../images/Cards/KitsuCardYako1Front.jpg'
import KitsuCardYako2Front from '../images/Cards/KitsuCardYako2Front.jpg'
import KitsuCardYako3Front from '../images/Cards/KitsuCardYako3Front.jpg'
import KitsuCardYako4Front from '../images/Cards/KitsuCardYako4Front.jpg'
import KitsuCardYako5Front from '../images/Cards/KitsuCardYako5Front.jpg'
import KitsuCardYako6Front from '../images/Cards/KitsuCardYako6Front.jpg'
import KitsuCardZenko1Front from '../images/Cards/KitsuCardZenko1Front.jpg'
import KitsuCardZenko2Front from '../images/Cards/KitsuCardZenko2Front.jpg'
import KitsuCardZenko3Front from '../images/Cards/KitsuCardZenko3Front.jpg'
import KitsuCardZenko4Front from '../images/Cards/KitsuCardZenko4Front.jpg'
import KitsuCardZenko5Front from '../images/Cards/KitsuCardZenko5Front.jpg'
import KitsuCardZenko6Front from '../images/Cards/KitsuCardZenko6Front.jpg'

class KitsuCardDescription extends CardDescription<number, MaterialType, LocationType, KitsuCard> {
  height = 8.8
  width = 6.3
  images = {
    [KitsuCard.Yako1_1]: KitsuCardYako1Front,
    [KitsuCard.Yako1_2]: KitsuCardYako1Front,
    [KitsuCard.Yako1_3]: KitsuCardYako1Front,
    [KitsuCard.Yako1_4]: KitsuCardYako1Front,
    [KitsuCard.Yako2_1]: KitsuCardYako2Front,
    [KitsuCard.Yako2_2]: KitsuCardYako2Front,
    [KitsuCard.Yako2_3]: KitsuCardYako2Front,
    [KitsuCard.Yako3_1]: KitsuCardYako3Front,
    [KitsuCard.Yako3_2]: KitsuCardYako3Front,
    [KitsuCard.Yako4]: KitsuCardYako4Front,
    [KitsuCard.Yako5]: KitsuCardYako5Front,
    [KitsuCard.Yako6]: KitsuCardYako6Front,
    [KitsuCard.Zenko1_1]: KitsuCardZenko1Front,
    [KitsuCard.Zenko1_2]: KitsuCardZenko1Front,
    [KitsuCard.Zenko1_3]: KitsuCardZenko1Front,
    [KitsuCard.Zenko1_4]: KitsuCardZenko1Front,
    [KitsuCard.Zenko2_1]: KitsuCardZenko2Front,
    [KitsuCard.Zenko2_2]: KitsuCardZenko2Front,
    [KitsuCard.Zenko2_3]: KitsuCardZenko2Front,
    [KitsuCard.Zenko3_1]: KitsuCardZenko3Front,
    [KitsuCard.Zenko3_2]: KitsuCardZenko3Front,
    [KitsuCard.Zenko4]: KitsuCardZenko4Front,
    [KitsuCard.Zenko5]: KitsuCardZenko5Front,
    [KitsuCard.Zenko6]: KitsuCardZenko6Front,
    [KitsuCard.WhiteKitsune_1]: KitsuCardWhiteKistsuneFront,
    [KitsuCard.WhiteKitsune_2]: KitsuCardWhiteKistsuneFront,
    [KitsuCard.BlackKitsune_1]: KitsuCardBlackKistsuneFront,
    [KitsuCard.BlackKitsune_2]: KitsuCardBlackKistsuneFront,
    [KitsuCard.Katana_1]: KitsuCardKatanaFront,
    [KitsuCard.Katana_2]: KitsuCardKatanaFront,
  }
  backImage = KitsuCardBack
  help = KitsuCardHelp

  public canDrag(move: MaterialMove<number, MaterialType, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
    if (context.rules.game.rule?.id !== RuleId.SelectKatanaTarget) {
      return super.canDrag(move, context)
    }
    return false
  }

  public isMenuAlwaysVisible(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
    if (context.rules.game.rule?.id !== RuleId.SelectKatanaTarget) {
      return super.isMenuAlwaysVisible(item, context)
    }
    return item.location.rotation !== KitsuCardRotation.FaceDown
  }

  public getItemMenu(
    item: MaterialItem<number, LocationType, KitsuCard>,
    context: ItemContext<number, MaterialType, LocationType>,
    legalMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): React.ReactNode {
    if (context.player === undefined) {
      return
    }
    if (context.rules.game.rule?.id === RuleId.SelectKatanaTarget && item.location.type === LocationType.PlayedKitsuCardSpot) {
      return this.getSelectKatanaTargetItemMenu(item, context, legalMoves)
    }
    if (
      context.rules.game.rule?.id === RuleId.PlayKitsuCard &&
      context.rules.game.rule.player === context.player &&
      item.location.type === LocationType.PlayerHand &&
      item.location.player === context.player
    ) {
      return this.getPlayerHandItemMenu(item, context, legalMoves)
    }
    if (
      context.rules.game.rule?.id === RuleId.PickDiscardCards &&
      context.rules.game.rule.player === context.player &&
      item.location.type === LocationType.DiscardedCardsToPickSpot &&
      item.location.player === context.player
    ) {
      return this.getPickDiscardedCardItemMenu(item, context, legalMoves)
    }
    if (
      context.rules.game.rule?.id === RuleId.SendCardToTeamMember &&
      context.rules.game.rule.players?.includes(context.player) &&
      item.location.type === LocationType.PlayerHand &&
      item.location.player === context.player
    ) {
      return this.getPlayerHandSendCardItemMenu(item, context, legalMoves)
    }
    return
  }

  public isFlippedOnTable(item: Partial<MaterialItem<number, LocationType>>, context: MaterialContext<number, MaterialType, LocationType>): boolean {
    if (context.player !== undefined && context.rules.game.rule?.id === RuleId.PlayKitsuCard && item.location?.rotation === KitsuCardRotation.FaceDown) {
      return true
    }
    return super.isFlippedOnTable(item, context)
  }

  private getPlayerHandItemMenu(
    item: MaterialItem<number, LocationType, KitsuCard>,
    context: ItemContext<number, MaterialType, LocationType>,
    legalMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): React.ReactNode {
    const currentItemIndex = context.rules.material(MaterialType.KitsuCard).id<KitsuCard>(item.id).getIndex()
    const movesForThisCard = legalMoves
      .filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
      .filter((move) => move.itemIndex === currentItemIndex && move.location.rotation !== KitsuCardRotation.FaceDown)
    const powerTokenMovesWithThisCard = legalMoves
      .filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
      .filter((move) => move.location.parent === currentItemIndex)
    if (movesForThisCard.length > 0 || powerTokenMovesWithThisCard.length > 0) {
      return (
        <>
          {movesForThisCard.map((move, index) => (
            <ItemMenuButton move={move} label={<Trans defaults="button.card.play" />} key={`playKistuCard-${context.player}-${index}`} labelPosition="left">
              <FontAwesomeIcon icon={faHandPointer} size="lg" />
            </ItemMenuButton>
          ))}
          {powerTokenMovesWithThisCard.map((tokenMove, tokenIndex) => {
            const isPlus3PowerToken = context.rules.material(MaterialType.PowerToken).getItem<PowerToken>(tokenMove.itemIndex).id === PowerToken.Plus3
            const translationKey = isPlus3PowerToken
              ? tokenMove.location.rotation === PowerTokenPlus3Side.Zenko
                ? 'button.card.playWithPlus3TokenZenko'
                : 'button.card.playWithPlus3TokenYako'
              : 'button.card.playWithToken'
            return (
              <ItemMenuButton
                key={`playKistuCardWithToken-${context.player}-${tokenIndex}`}
                moves={[tokenMove]}
                radius={0.5 - 2 * tokenIndex}
                angle={0}
                label={<Trans defaults={translationKey} />}
                labelPosition="left"
              >
                <FontAwesomeIcon icon={faSquarePlus} size="lg" />
              </ItemMenuButton>
            )
          })}
          {this.getHelpButton(item, context, {
            angle: 0,
            radius: powerTokenMovesWithThisCard.length > 0 ? -2 * powerTokenMovesWithThisCard.length : 0.5,
            labelPosition: 'left',
          })}
        </>
      )
    }
    return
  }

  private getSelectKatanaTargetItemMenu(
    item: MaterialItem<number, LocationType, KitsuCard>,
    context: ItemContext<number, MaterialType, LocationType>,
    legalMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): React.ReactNode {
    const currentItemIndex = context.rules.material(MaterialType.KitsuCard).id<KitsuCard>(item.id).getIndex()
    const moveItemIndexesForOtherPlayers = legalMoves
      .filter((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))
      .map((move) => (move as MoveItem<number, MaterialType, LocationType>).itemIndex)
    if (!moveItemIndexesForOtherPlayers.includes(currentItemIndex)) {
      return
    }
    const movesToThisLocation = legalMoves.filter(
      (move) =>
        isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
        move.location.type === LocationType.PlayedKitsuCardSpot &&
        move.itemIndex === currentItemIndex,
    )
    if (movesToThisLocation.length > 0) {
      const labelPosition = context.rules.players.length === 2 ? ((item.location.x ?? 0) === 0 ? 'left' : 'right') : 'right'
      return (
        <>
          {movesToThisLocation.map((move, index) => (
            <ItemMenuButton
              key={`selectKatanaTarget-${context.player}-${index}`}
              move={move}
              label={<Trans defaults="button.card.flip" />}
              labelPosition={labelPosition}
            >
              <span className="fa-flip-vertical">
                <FontAwesomeIcon icon={faArrowRotateRight} rotation={90} size="lg" />
              </span>
            </ItemMenuButton>
          ))}
          {this.getHelpButton(item, context, {
            labelPosition: labelPosition,
            radius: 0.5,
            angle: 0,
          })}
        </>
      )
    }
    return
  }

  private getPickDiscardedCardItemMenu(
    item: MaterialItem<number, LocationType, KitsuCard>,
    context: ItemContext<number, MaterialType, LocationType>,
    legalMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): React.ReactNode {
    const currentItemIndex = context.rules.material(MaterialType.KitsuCard).id<KitsuCard>(item.id).getIndex()
    const movesForThisCard = legalMoves
      .filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
      .filter((move) => move.itemIndex === currentItemIndex)

    return (
      <>
        {movesForThisCard.map((move, index) => (
          <ItemMenuButton key={`addDiscardedCardToPlayerHand-${context.player}-${index}`} move={move} label={<Trans defaults="button.card.addToHand" />}>
            <FontAwesomeIcon icon={faHandPointer} size="lg" />
          </ItemMenuButton>
        ))}
        {this.getHelpButton(item, context, {
          labelPosition: 'right',
          radius: 0.5,
          angle: 0,
        })}
      </>
    )
  }

  private getPlayerHandSendCardItemMenu(
    item: MaterialItem<number, LocationType, KitsuCard>,
    context: ItemContext<number, MaterialType, LocationType>,
    legalMoves: MaterialMove<number, MaterialType, LocationType>[],
  ): React.ReactNode {
    const currentItemIndex = context.rules.material(MaterialType.KitsuCard).id<KitsuCard>(item.id).getIndex()
    const movesForThisCard = legalMoves
      .filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
      .filter((move) => move.itemIndex === currentItemIndex)
    return (
      <>
        {movesForThisCard.map((move, index) => (
          <ItemMenuButton
            key={`sendCardToTeamMember-${context.player}-${index}`}
            move={move}
            label={<Trans defaults="button.card.sendToTeamMember" />}
            labelPosition="left"
          >
            <FontAwesomeIcon icon={faHandPointer} size="lg" />
          </ItemMenuButton>
        ))}
        {this.getHelpButton(item, context, {
          labelPosition: 'left',
          radius: 0.5,
          angle: 0,
        })}
      </>
    )
  }
}

export const kitsuCardDescription = new KitsuCardDescription()
