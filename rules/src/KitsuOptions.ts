import { OptionsSpec, OptionsValidationError } from '@gamepark/rules-api';
import { TFunction } from 'i18next';
import { sumBy } from 'lodash';
import { TeamColor, teamColors } from './TeamColor';

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = {
    team?: TeamColor
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
        team: {
            label: t => t('clan'),
            values: teamColors,
            valueSpec: color => ({label: t => getTeamName(color, t)}),
        }
    },
    validate: (options, t) => {
        if (options.players) {
            if (options.players.length % 2 === 1) {
                throw new OptionsValidationError(t('invalid.player.count'), ['players.team']);
            }
            const zenko = sumBy(options.players, p => p.team === TeamColor.Zenko ? 1 : 0);
            const yako = sumBy(options.players, p => p.team === TeamColor.Yako ? 1 : 0);
            if (zenko > options.players.length / 2 || yako > options.players.length / 2) {
                throw new OptionsValidationError(t('invalid.teams'), ['players.team']);
            }
        }
    }
};

export function getTeamName(color: TeamColor | undefined, t: TFunction) {
    switch (color) {
        case TeamColor.Zenko:
            return t('clan.zenko');
        case TeamColor.Yako:
            return t('clan.yako');
        default:
            return '';
    }
}