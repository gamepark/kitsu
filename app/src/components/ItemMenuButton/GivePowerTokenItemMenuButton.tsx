import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { ItemMenuButton, usePlayerId, usePlayerName } from '@gamepark/react-game';
import { MaterialMove } from '@gamepark/rules-api';
import { FC, PropsWithChildren } from 'react';
import { Trans } from 'react-i18next';

type GivePowerTokenItemMenuButtonProps = {
    playerId?: number,
    move: MaterialMove<number, MaterialType, LocationType>,
    x?: number,
    y?: number,
}

export const GivePowerTokenItemMenuButton: FC<PropsWithChildren<GivePowerTokenItemMenuButtonProps>> = ({playerId, move, x, y, children}) => {
    const me = usePlayerId<number>();
    const player = usePlayerName(playerId);
    const labelComponent = playerId === me
        ? <Trans defaults='button.powerToken.takeForSelf' />
        : <Trans defaults='button.powerToken.giveToPlayer' values={{playerName: player}} />;
    return (<ItemMenuButton move={move} x={x} y={y} label={labelComponent} >
        {children}
    </ItemMenuButton>)
}