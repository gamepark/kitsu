import { OptionsSpec } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import {TeamColor, teamColors} from "./TeamColor";

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = {
  Team: TeamColor
}

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type KitsuOptions = {
  players: PlayerOptions[]
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const KitsuOptionsSpec: OptionsSpec<KitsuOptions> = {
  players: {
    Team: {
      label: t => t("TeamColor"),
      values: teamColors,
      valueSpec: color => ({ label: t => getTypeName(color, t) }),
    }
  }
}

export function getTypeName (color: TeamColor, t: TFunction) {
  switch (color) {
    case TeamColor.Zenko:
      return t('Bleu');
    case TeamColor.Yako:
      return t('Orange');
  }
}