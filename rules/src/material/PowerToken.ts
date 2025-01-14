import { getEnumValues } from '@gamepark/rules-api';

export enum PowerToken {
    ColourExchange = 1,
    NoAdvance,
    PickDiscarded,
    Plus3,
    Protection,
}

export const powerToken = getEnumValues(PowerToken);