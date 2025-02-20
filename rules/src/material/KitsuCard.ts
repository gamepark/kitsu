import { getEnumValues } from '@gamepark/rules-api';

export enum KitsuCard {
    Yako1_1 = 111,
    Yako1_2 = 112,
    Yako1_3 = 113,
    Yako2_1 = 121,
    Yako2_2 = 122,
    Yako3_1 = 131,
    Yako4 = 141,
    Yako5 = 151,
    Yako6 = 161,
    Zenko1_1 = 211,
    Zenko1_2 = 212,
    Zenko1_3 = 213,
    Zenko2_1 = 221,
    Zenko2_2 = 222,
    Zenko3_1 = 231,
    Zenko4 = 241,
    Zenko5 = 251,
    Zenko6 = 261,
    WhiteKitsune_1 = 311,
    WhiteKitsune_2 = 312,
    BlackKitsune_1 = 321,
    BlackKitsune_2 = 322,
    Katana_1 = 331,
    Katana_2 = 332,
    Yako1_4 = 114,
    Yako2_3 = 123,
    Yako3_2 = 132,
    Zenko1_4 = 214,
    Zenko2_3 = 223,
    Zenko3_2 = 232,
}

export enum KitsuCardType {
    Yako = 1,
    Zenko,
    Special,
}

export enum KitsuCardSpecialType {
    WhiteKitsune = 1,
    BlackKitsune,
    Katana,
}

export const getKitsuCardValue = (cardId: KitsuCard) => Math.floor(cardId / 10) % 10;

export const getKitsuCardType = (cardId: KitsuCard): KitsuCardType => Math.floor(cardId / 100);

export const isYakoCard = (cardId: KitsuCard): boolean => getKitsuCardType(cardId) === KitsuCardType.Yako;

export const isZenkoCard = (cardId: KitsuCard): boolean => getKitsuCardType(cardId) === KitsuCardType.Zenko;

export const isSpecialCard = (cardId: KitsuCard): boolean => getKitsuCardType(cardId) === KitsuCardType.Special;

export const getSpecialCardType = (cardId: KitsuCard): KitsuCardSpecialType => getKitsuCardValue(cardId);

export const canBePlayedWithProtectionToken = (cardId: KitsuCard): boolean => !isSpecialCard(cardId) || (isSpecialCard(cardId) && getSpecialCardType(cardId) === KitsuCardSpecialType.WhiteKitsune);

export const kitsuCardIds = getEnumValues(KitsuCard);

export const last24PlayersKitsuCardEnumValueIndex = kitsuCardIds.indexOf(KitsuCard.Katana_2) + 1;