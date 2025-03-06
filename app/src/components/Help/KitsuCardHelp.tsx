/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { getKitsuCardType, KitsuCardType } from '@gamepark/kitsu/material/KitsuCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { MaterialHelpProps, useRules } from '@gamepark/react-game';
import { FC } from 'react';
import { NumericKitsuCardHelp } from './NumericKitsuCardHelp';
import { SpecialKitsuCardHelp } from './SpecialKitsuCardHelp';
import { UnknownKitsuCardHelp } from './UnknownKitsuCardHelp';

export const KitsuCardHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = (props) => {
    const rules = useRules<KitsuRules>();
    const isSixPlayersGame = rules?.game.players.length === 6;
    const isSpecialCard = getKitsuCardType(props.item.id) === KitsuCardType.Special;
    return (
        <>{
            props.item.id
                ? (isSpecialCard
                    ? (<SpecialKitsuCardHelp item={props.item}/>)
                    : (<NumericKitsuCardHelp item={props.item} isSixPlayersGame={isSixPlayersGame}/>))
                : <UnknownKitsuCardHelp item={props.item}/>
        }</>)
        ;
};