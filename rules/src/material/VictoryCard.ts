import { getEnumValues } from '@gamepark/rules-api';

export enum VictoryCard {
    Yako = 1,
    Zenko,
}

export const victoryCardIds = getEnumValues(VictoryCard);