/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const SendCardToTeamMemberHeader: FC = () => {
    const { t } = useTranslation();
    const me = usePlayerId<number>();
    const rules = useRules<KitsuRules>();
    const activePlayers = rules?.game.rule?.players ?? [];
    const nextTeamMemberId = me !== undefined ? rules!.game.players[rules!.game.players.indexOf(me) + 2 % rules!.game.players.length] : undefined ;
    const nextTeamMemberName = usePlayerName(nextTeamMemberId);
    const activePlayer = usePlayerName<number>(activePlayers[0]);
    if (me !== undefined && activePlayers.includes(me)) {
        return (<>{t('header.sendCardToTeamMember.active', {name: nextTeamMemberName})}</>)
    } else if (activePlayers.length > 1) {
        return (<>{t('header.sendCardToTeamMember.others')}</>)
    } else {
        return (<>{t('header.sendCardToTeamMember.other', {name: activePlayer})}</>);
    }
}