/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game';

export const PlayKitsuCardHeader = () => {
    const rules = useRules<KitsuRules>()!;
    const me = usePlayerId<number>();
    const activePlayer = rules.getActivePlayer();
    const player = usePlayerName(activePlayer);
    if (activePlayer === me) {
        return <>You must play a card</>;
    }
    return <>{player} must play a card</>;
};
