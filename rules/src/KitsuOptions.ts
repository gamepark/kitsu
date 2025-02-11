import { OptionsSpec, OptionsValidationError } from '@gamepark/rules-api';
import { TFunction } from 'i18next';
import { TeamColor, teamColors } from './TeamColor';

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = {
    team: TeamColor | undefined
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
            label: t => t('Team color'),
            values: teamColors,
            valueSpec: color => ({label: t => getTeamName(color, t)}),
        }
    },
    validate: (options, t) => {
        if ((options.players?.filter(playerOption => playerOption.team === TeamColor.Yako) ?? 0) != Math.floor((options.players?.length ?? 0) / 2)) {
            throw new OptionsValidationError(t('invalid.team.attribution'), ['players.team']);
        }
    }
};

export function getTeamName(color: TeamColor | undefined, t: TFunction) {
    switch (color) {
        case TeamColor.Zenko:
            return t('Zenko (blue) team');
        case TeamColor.Yako:
            return t('Yako (orange) team');
        case undefined:
            return t('Random team');
    }
}