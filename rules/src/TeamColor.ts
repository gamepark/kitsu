import { getEnumValues } from "@gamepark/rules-api";

export enum TeamColor {
    Zenko = 1,
    Yako
}

export const teamColors = getEnumValues(TeamColor)