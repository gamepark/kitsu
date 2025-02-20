import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { ItemMenuButton, usePlay } from '@gamepark/react-game';
import { MaterialMove } from '@gamepark/rules-api';
import { FC, PropsWithChildren } from 'react';
import { Trans } from 'react-i18next';

type PlayPowerTokenAndCardItemMenuButtonProps = {
    key?: string;
    cardMove: MaterialMove<number, MaterialType, LocationType>;
    powerTokenMove: MaterialMove<number, MaterialType, LocationType>;
}

export const PlayPowerTokenAndCardItemMenuButton: FC<PropsWithChildren<PlayPowerTokenAndCardItemMenuButtonProps>> = ({key, cardMove, powerTokenMove, children}) => {
    const play = usePlay();
    return (<ItemMenuButton key={key} move={powerTokenMove} onPlay={() => play(cardMove)} label={<Trans defaults='button.card.playWithToken'/>} >
        {children}
    </ItemMenuButton>);
}