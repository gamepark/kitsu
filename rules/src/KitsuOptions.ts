import { OptionsSpec, OptionsSpecV2, OptionsValidationError, TFunction } from '@gamepark/rules-api'
import { sumBy } from 'es-toolkit'
import { TeamColor, teamColors } from './TeamColor'

/**
 * This is the options for each player in the game.
 */
interface PlayerOptions {
  team?: TeamColor
}

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export interface KitsuOptions {
  players: PlayerOptions[]
}

/**
 * What Kitsu is: two clans, and a table split between them.
 *
 * `teams` says both. The platform derives the legal table sizes from it — two
 * clans of equal size means 2, 4 or 6 players, never an odd count — and assigns
 * the clans balanced. The two rules the old `validate` below threw for are
 * therefore no longer Kitsu's to state; they are what declaring teams *means*.
 *
 * Clan names are not here by design: a v2 spec carries no text. They live in the
 * options document published with the game's translations, under the keys the
 * platform derives from this spec — `teams`, `teams.1`, `teams.2`.
 */
export const KitsuOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 6 },
  teams: { values: teamColors }
}

/**
 * The legacy declaration, superseded by `KitsuOptionsSpecV2`.
 *
 * Kept exported only because a few platform screens still read the v1 spec for
 * its labels and per-player options; nothing here should be edited any more, and
 * the whole object goes once those screens have moved. `validate` is dead code
 * for game creation already: the platform generates from the v2 spec, which can
 * no longer produce a table this function would refuse.
 */
export const KitsuOptionsSpec: OptionsSpec<KitsuOptions> = {
  players: {
    team: {
      label: (t) => t('clan'),
      values: teamColors,
      valueSpec: (color) => ({ label: (t) => getTeamName(color, t) })
    }
  },
  validate: (options, t) => {
    if (options.players) {
      if (options.players.length % 2 === 1) {
        throw new OptionsValidationError(t('invalid.player.count'), ['players.team'])
      }
      const zenko = sumBy(options.players, (p) => (p.team === TeamColor.Zenko ? 1 : 0))
      const yako = sumBy(options.players, (p) => (p.team === TeamColor.Yako ? 1 : 0))
      if (zenko > options.players.length / 2 || yako > options.players.length / 2) {
        throw new OptionsValidationError(t('invalid.teams'), ['players.team'])
      }
    }
  }
}

export function getTeamName(color: TeamColor | undefined, t: TFunction) {
  switch (color) {
    case TeamColor.Zenko:
      return t('clan.zenko')
    case TeamColor.Yako:
      return t('clan.yako')
    default:
      return ''
  }
}
