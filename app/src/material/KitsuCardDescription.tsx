import { css, Interpolation, Theme } from '@emotion/react';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard';
import { KitsuCardRotation } from '@gamepark/kitsu/material/KitsuCardRotation';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { CardDescription, ItemContext, ItemMenuButton } from '@gamepark/react-game';
import { isMoveItemType, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api';
import React from 'react';
import { Trans } from 'react-i18next';
import KitsuCardBack from '../images/Cards/KitsuCardBack.jpg';
import KitsuCardBlackKistsuneFront from '../images/Cards/KitsuCardBlackKitsuneFront.jpg';
import KitsuCardKatanaFront from '../images/Cards/KitsuCardKatanaFront.jpg';
import KitsuCardWhiteKistsuneFront from '../images/Cards/KitsuCardWhiteKitsuneFront.jpg';
import KitsuCardYako1Front from '../images/Cards/KitsuCardYako1Front.jpg';
import KitsuCardYako2Front from '../images/Cards/KitsuCardYako2Front.jpg';
import KitsuCardYako3Front from '../images/Cards/KitsuCardYako3Front.jpg';
import KitsuCardYako4Front from '../images/Cards/KitsuCardYako4Front.jpg';
import KitsuCardYako5Front from '../images/Cards/KitsuCardYako5Front.jpg';
import KitsuCardYako6Front from '../images/Cards/KitsuCardYako6Front.jpg';
import KitsuCardZenko1Front from '../images/Cards/KitsuCardZenko1Front.jpg';
import KitsuCardZenko2Front from '../images/Cards/KitsuCardZenko2Front.jpg';
import KitsuCardZenko3Front from '../images/Cards/KitsuCardZenko3Front.jpg';
import KitsuCardZenko4Front from '../images/Cards/KitsuCardZenko4Front.jpg';
import KitsuCardZenko5Front from '../images/Cards/KitsuCardZenko5Front.jpg';
import KitsuCardZenko6Front from '../images/Cards/KitsuCardZenko6Front.jpg';

class KitsuCardDescription extends CardDescription<number, MaterialType, LocationType, KitsuCard> {
    width = 6.30;
    height = 8.80;
    backImage = KitsuCardBack;
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
    };

    public canDrag(move: MaterialMove<number, MaterialType, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        if (context.rules.game.rule?.id !== RuleId.SelectKatanaTarget) {
            return super.canDrag(move, context);
        }
        return false;
    }

    public isMenuAlwaysVisible(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        if (context.rules.game.rule?.id !== RuleId.SelectKatanaTarget) {
            return super.isMenuAlwaysVisible(item, context);
        }
        return true;
    }

    public getItemExtraCss(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): Interpolation<Theme> {
        if (context.player !== item.location.player || (context.rules.game.rule?.id && ![RuleId.PlayKitsuCard, RuleId.SelectKatanaTarget].includes(context.rules.game.rule?.id))) {
            return super.getItemExtraCss(item, context);
        }
        return item.location.rotation === KitsuCardRotation.FaceDown
            ? css`
                    opacity: 0.5;`
            : css``;
    }

    public getItemMenu(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove<number, MaterialType, LocationType>[]): React.ReactNode {
        if (context.player === undefined) {
            return;
        }
        if (context.rules.game.rule?.id !== RuleId.SelectKatanaTarget) {
            return;
        }
        if (item.location.type !== LocationType.PlayedKitsuCardSpot) {
            return;
        }
        const currentItemIndex = context.rules.material(MaterialType.KitsuCard).id<KitsuCard>(item.id).getIndex();
        const moveItemIndexesForOtherPlayers = legalMoves.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))
            .map(move => (move as MoveItem<number, MaterialType, LocationType>).itemIndex);
        if (!moveItemIndexesForOtherPlayers.includes(currentItemIndex)) {
            return;
        }
        const movesToThisLocation = legalMoves.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.PlayedKitsuCardSpot && move.itemIndex === currentItemIndex);
        return <>
            {movesToThisLocation.map((move, index) => (
                <ItemMenuButton key={`selectKatanaTarget-${context.player}-${index}`} move={move}
                                label={<Trans defaults="buttons.card.flip"/>}
                                labelPosition={(item.location.x ?? 0) === 0 ? 'right' : 'left'}>
                    <span className="fa-flip-vertical">
                        <FontAwesomeIcon icon={faArrowRotateRight} rotation={90} size="lg"/>
                    </span>
                </ItemMenuButton>)
            )}
            {this.getHelpButton(item, context, {
                labelPosition: (item.location.x ?? 0) === 0 ? 'right' : 'left',
                label: <Trans defaults="buttons.card.help"/>,
                radius: 0.5,
                angle: 0
            })}
        </>;
    }
}

export const kitsuCardDescription = new KitsuCardDescription();