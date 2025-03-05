/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { usePlayerName, useRules } from '@gamepark/react-game';
import { MaterialItem } from '@gamepark/rules-api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type UnknownKitsuCardHelpProps = {
    item: Partial<MaterialItem<number, LocationType, any>>
}

export const UnknownKitsuCardHelp: FC<UnknownKitsuCardHelpProps> = ({item}) => {
    const rules = useRules<KitsuRules>();
    const cardOwner = usePlayerName(item.location?.player)
    const { t } = useTranslation();
    switch (item.location?.type) {
        case LocationType.PlayerHand:
            return (<>
                <h2>{t('help.kitsuCard.title')}</h2>
                <h3>{t('help.kitsuCard.unknown.title')}</h3>
                <p>{t('help.kitsuCard.unknown.location.playerHand', {playerName: cardOwner})}</p>
            </>);
        case LocationType.PlayedKitsuCardSpot:
            switch (rules?.game.rule?.id) {
                case RuleId.SendCardToTeamMember:
                    return (<>
                        <h2>{t('help.kitsuCard.title')}</h2>
                        <h3>{t('help.kitsuCard.unknown.title')}</h3>
                        <p>{t('help.kitsuCard.unknown.location.playedKitsuCard.sendCardToTeamMember', {playerName: cardOwner})}</p>
                    </>);
                case RuleId.PlayKitsuCard:
                    return (<>
                        <h2>{t('help.kitsuCard.title')}</h2>
                        <h3>{t('help.kitsuCard.unknown.title')}</h3>
                        <p>{t('help.kitsuCard.unknown.location.playedKitsuCard.playKitsuCard', {playerName: cardOwner})}</p>
                    </>);
                default:
                    throw new Error('Rule type not supported');
            }
        case LocationType.KitsuCardDiscardSpotOnWisdomBoard:
            return (<>
                <h2>{t('help.kitsuCard.title')}</h2>
                <h3>{t('help.kitsuCard.unknown.title')}</h3>
                <p>{t('help.kitsuCard.unknown.location.discard', {numberOfCards: rules?.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDiscardSpotOnWisdomBoard).length})}</p>
            </>);
        case LocationType.KitsuCardDeckSpotOnWisdomBoard:
            return (<>
                <h2>{t('help.kitsuCard.title')}</h2>
                <h3>{t('help.kitsuCard.unknown.title')}</h3>
                <p>{t('help.kitsuCard.unknown.location.deck', {numberOfCards: rules?.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).length})}</p>
            </>);
        case LocationType.DiscardedCardsToPickSpot:
            return (<>
                <h2>{t('help.kitsuCard.title')}</h2>
                <h3>{t('help.kitsuCard.unknown.title')}</h3>
                <p>{t('help.kitsuCard.unknown.location.pickDiscardCard', {playerName: cardOwner})}</p>
            </>);
        default:
            throw new Error('Location type not supported');
    }
};