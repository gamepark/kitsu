/** @jsxImportSource @emotion/react */
import { getKitsuCardType, getKitsuCardValue, KitsuCard, KitsuCardType } from '@gamepark/kitsu/material/KitsuCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialItem } from '@gamepark/rules-api';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type NumericKitsuCardHelpProps = {
    item: Partial<MaterialItem<number, LocationType, any>>;
    isSixPlayersGame?: boolean;
}

export const NumericKitsuCardHelp: FC<NumericKitsuCardHelpProps> = ({item, isSixPlayersGame}) => {
    const {t} = useTranslation();
    const translatedClan = getClanTranslationKey(item.id, t);
    const cardValue = getKitsuCardValue(item.id);
    const numberOfCards = getQuantityFromValueAndPlayers(item.id, isSixPlayersGame ?? false);

    return (<>
        <h2>{t('help.kitsuCard.title')}</h2>
        <h3>{t('help.kitsuCard.value.title', {clan: translatedClan, cardValue})}</h3>
        <p>{t('help.kitsuCard.value.description', {clan: translatedClan, cardValue})}</p>
        <p>{t('help.kitsuCard.quantity', {quantity: numberOfCards})}</p>
    </>);
};

const getClanTranslationKey = (itemId: KitsuCard, t: TFunction) => {
    switch (getKitsuCardType(itemId)) {
        case KitsuCardType.Yako:
            return t('clan.yako');
        case KitsuCardType.Zenko:
            return t('clan.zenko');
        default:
            throw new Error('Invalid KitsuCardType');
    }
};

const getQuantityFromValueAndPlayers = (itemId: KitsuCard, is6PlayersGame: boolean) => {
    switch (getKitsuCardValue(itemId)) {
        case 1:
            return is6PlayersGame ? 4 : 3;
        case 2:
            return is6PlayersGame ? 3 : 2;
        case 3:
            return is6PlayersGame ? 2 : 1;
        case 4:
        case 5:
        case 6:
            return 1;
        default:
            throw new Error('Invalid KitsuCardType');
    }
};

