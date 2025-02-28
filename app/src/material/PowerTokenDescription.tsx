/** @jsxImportSource @emotion/react */

import { faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PowerToken } from '@gamepark/kitsu/material/PowerToken';
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { ItemContext, ItemMenuButton, MaterialContext, TokenDescription } from '@gamepark/react-game';
import { isMoveItemType, isSelectItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api';
import React from 'react';
import { Trans } from 'react-i18next';
import { GivePowerTokenItemMenuButton } from '../components/ItemMenuButton/GivePowerTokenItemMenuButton';
import ColourExchangeToken from '../images/Tokens/PowerColourExchangeToken.png';
import NoAdvanceToken from '../images/Tokens/PowerNoAdvanceToken.png';
import PickDiscardedToken from '../images/Tokens/PowerPickDiscardedToken.png';
import Plus3YakoToken from '../images/Tokens/PowerPlus3YakoToken.png';
import Plus3ZenkoToken from '../images/Tokens/PowerPlus3ZenkoToken.png';
import ProtectionToken from '../images/Tokens/PowerProtectionToken.png';

class PowerTokenDescription extends TokenDescription<number, MaterialType, LocationType, Partial<Record<'front' | 'back', PowerToken>>> {
    height = 2.94;
    width = 3.00;
    images = {
        [PowerToken.ColourExchange]: ColourExchangeToken,
        [PowerToken.NoAdvance]: NoAdvanceToken,
        [PowerToken.PickDiscarded]: PickDiscardedToken,
        [PowerToken.Plus3]: Plus3YakoToken,
        [PowerToken.Protection]: ProtectionToken,
    };
    backImages = {
        [PowerToken.ColourExchange]: ColourExchangeToken,
        [PowerToken.NoAdvance]: NoAdvanceToken,
        [PowerToken.PickDiscarded]: PickDiscardedToken,
        [PowerToken.Plus3]: Plus3ZenkoToken,
        [PowerToken.Protection]: ProtectionToken,
    };

    public getItemMenu(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove<number, MaterialType, LocationType>[]): React.ReactNode {
        if (context.player !== undefined && context.player === context.rules.game.rule?.player) {
            if (context.rules.game.rule?.id === RuleId.EndOfTrickPickAvailablePowerToken
                && item.location.type === LocationType.PowerTokenSpotOnWisdomBoard)
            {
                return this.getItemMenuButtonsForEndOfTrickPickAvailablePowerTokenRule(item, context, legalMoves);
            }
            if (context.rules.game.rule?.id === RuleId.PlayKitsuCard
                && item.location.type === LocationType.PowerTokenSpotOnClanCard
                && item.location.player === context.player)
            {
                return this.getItemMenuButtonsForPlayKitsuCardRule(item, context, legalMoves);
            }
        }
        return ;
    }

    public isMenuAlwaysVisible(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        if (context.player === undefined
            || context.player !== context.rules.game.rule?.player
            || context.rules.game.rule?.id !== RuleId.PlayKitsuCard
            || item.location.type !== LocationType.PowerTokenSpotOnClanCard
            || item.location.player !== context.player) {
            return super.isMenuAlwaysVisible(item, context);
        }
        return true;
    }

    public isFlipped(item: Partial<MaterialItem<number, LocationType>>, _context: MaterialContext<number, MaterialType, LocationType>): boolean {
        return item.id === PowerToken.Plus3 && item.location?.rotation === PowerTokenPlus3Side.Zenko;
    }

    private getItemMenuButtonsForPlayKitsuCardRule(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove<number, MaterialType, LocationType>[]): React.ReactNode {
        const selectTokenMoves = legalMoves.filter(isSelectItemType<number, MaterialType, LocationType>(MaterialType.PowerToken));
        return (<>
            {selectTokenMoves && selectTokenMoves.map((move, index) => (
                <ItemMenuButton key={`powerToken-button-${index}`}
                                move={move} radius={3.5} angle={0}
                                label={item.selected === true
                                    ? <Trans defaults="button.powerToken.unselect"/>
                                    : <Trans defaults="button.powerToken.select"/>}>
                    <FontAwesomeIcon icon={faHandPointer} size="sm"/>
                </ItemMenuButton>))
            }
            {this.getHelpButton(item, context, {
                radius: 1,
                angle: 0,
            })
            }
        </>);
    }

    private getItemMenuButtonsForEndOfTrickPickAvailablePowerTokenRule(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove<number, MaterialType, LocationType>[]): React.ReactNode {
        const currentItemIndex = context.rules.material(MaterialType.PowerToken).id<PowerToken>(item.id).getIndex();
        const giveTokenMoves = legalMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
            .filter(move => move.itemIndex === currentItemIndex);
        return (<>
            {giveTokenMoves.map((move, index) => (
                <GivePowerTokenItemMenuButton move={move} y={3 * (index - 0.5)} x={2} playerId={move.location.player}
                                              key={`powerToken-button-give-${move.location.player}-${index}`}>
                    <FontAwesomeIcon icon={faHandPointer} size="sm"/>
                </GivePowerTokenItemMenuButton>
            ))}
            {this.getHelpButton(item, context, {
                y: 3 * (giveTokenMoves.length - 0.5),
                x: 2
            })}
        </>);
    }

}

export const powerTokenDescription = new PowerTokenDescription();