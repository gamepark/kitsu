/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game';
import { createPortal } from 'react-dom';
import ScoreIcon from '../images/Icons/Score.png'

export const PlayerPanels = () => {
    const players = usePlayers<number>({sortFromMe: true});
    const rules = useRules<KitsuRules>();
    const root = document.getElementById('root');
    if (!root) {
        return null;
    }

    return createPortal(
        <>
            {players.map((player, index) =>
                <StyledPlayerPanel key={player.id} player={player} color={playerColorCode[player.id]}
                                   css={panelPosition(index)} counters={[{image: ScoreIcon, value: rules?.getScore(player.id) ?? 0}]}/>
            )}
        </>,
        root
    );
};
const panelPosition = (index: number) => css`
    position: absolute;
    right: 1em;
    top: ${8.5 + index * 16}em;
    width: 28em;
`;

export const playerColorCode: Record<number, string> = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'yellow'
};