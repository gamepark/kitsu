/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game';

export const SelectKatanaTargetHeader = () => {
    const rules = useRules<KitsuRules>()!;
    const me = usePlayerId<number>();
    const activePlayer = rules.getActivePlayer();
    const player = usePlayerName(activePlayer);
    if (activePlayer === me) {
        return <>You must select a numeral card to flip</>;
    }
    return <>{player} must select a numeral card to flip</>;
};
