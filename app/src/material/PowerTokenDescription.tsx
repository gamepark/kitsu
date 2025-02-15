/** @jsxImportSource @emotion/react */

import { faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PowerToken } from '@gamepark/kitsu/material/PowerToken';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { ItemContext, ItemMenuButton, TokenDescription } from '@gamepark/react-game';
import { isSelectItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api';
import React from 'react';
import { Trans } from 'react-i18next';
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
        if (context.player === undefined || context.rules.game.rule?.id !== RuleId.PlayKitsuCard || item.location.type !== LocationType.PowerTokenSpotOnClanCard || item.location.player !== context.player) {
            return ;
        }
        return (<>
            {
                legalMoves.filter(isSelectItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)).map((move, index) => (
                    <ItemMenuButton key={`powerToken-button-${index}`}
                                    move={move} radius={3.5} angle={0}
                                    label={item.selected === true
                                        ? <Trans defaults='button.powerToken.unselect' />
                                        : <Trans defaults='button.powerToken.select' />}>
                        <FontAwesomeIcon icon={faHandPointer} size="sm"/>
                </ItemMenuButton>))
            }
            { this.getHelpButton(item, context, {
                radius: 1,
                angle: 0,
            })}
            </>)
    }

    public isMenuAlwaysVisible(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        if (context.player === undefined || context.rules.game.rule?.id !== RuleId.PlayKitsuCard || item.location.type !== LocationType.PowerTokenSpotOnClanCard || item.location.player !== context.player) {
            return super.isMenuAlwaysVisible(item, context);
        }
        return true;
    }

}

export const powerTokenDescription = new PowerTokenDescription();