import { getEnumValues } from '@gamepark/rules-api';

export enum ClanCard {
    Zenko2Players = 1,
    Zenko4Players,
    Zenko6Players,
    Yako2Players,
    Yako4Players,
    Yako6Players
}

export const clanCardIds = getEnumValues(ClanCard);