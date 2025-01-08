import { getEnumValues } from "@gamepark/rules-api";

export enum KitsuCard {
    Yako1_1 = 1,
    Yako1_2,
    Yako1_3,
    Yako2_1,
    Yako2_2,
    Yako3_1,
    Yako4,
    Yako5,
    Yako6,
    Zenko1_1,
    Zenko1_2,
    Zenko1_3,
    Zenko2_1,
    Zenko2_2,
    Zenko3_1,
    Zenko4,
    Zenko5,
    Zenko6,
    WhiteKitsune_1,
    WhiteKitsune_2,
    BlackKitsune_1,
    BlackKitsune_2,
    Katana_1,
    Katana_2,
    Yako1_4,
    Yako2_3,
    Yako3_2,
    Zenko1_4,
    Zenko2_3,
    Zenko3_2,
}

export const kistuCardIds = getEnumValues(KitsuCard);

export const last24PlayersKitsuCardId = KitsuCard.Katana_2