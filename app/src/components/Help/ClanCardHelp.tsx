/** @jsxImportSource @emotion/react */
import { ClanCard } from '@gamepark/kitsu/material/ClanCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { MaterialHelpProps, usePlayerId, usePlayerName } from '@gamepark/react-game';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const getTranslatedClanFromCard = (id: ClanCard, t: TFunction): string => {
    switch (id) {
        case ClanCard.Yako2Players:
        case ClanCard.Yako4Players:
        case ClanCard.Yako6Players:
            return t('clan.yako');
        case ClanCard.Zenko2Players:
        case ClanCard.Zenko4Players:
        case ClanCard.Zenko6Players:
            return t('clan.zenko');
    }
};

export const ClanCardHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({item}) => {
    const {t} = useTranslation();
    const translatedClan = getTranslatedClanFromCard(item.id, t);
    const me = usePlayerId<number>();
    const cardOwnerId = item.location?.player;
    const cardOwner = usePlayerName(cardOwnerId);
    return (<>
        <h2>{t('help.clanCard.title')}</h2>
        <p>{me === cardOwnerId
            ? t('help.clanCard.description.self', {clan: translatedClan})
            : t('help.clanCard.description.player', {clan: translatedClan, playerName: cardOwner})}</p>
    </>);
};