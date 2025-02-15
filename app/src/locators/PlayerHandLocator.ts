import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { getRelativePlayerIndex, HandLocator, MaterialContext } from '@gamepark/react-game';
import { Coordinates, Location } from '@gamepark/rules-api';
import { RADIUS } from './Radius';

const LOCATOR_RADIUS = RADIUS + 8;

class PlayerHandLocator extends HandLocator<number, MaterialType, LocationType> {
    radius = 100;

    getBaseAngle(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;

        return 180 * getRelativePlayerIndex(context, location.player) / numberOfSectors;
    }

    maxAngle = 15;
    gapMaxAngle = 3;
    clockwise = true;

    getCoordinates(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        return {
            x: LOCATOR_RADIUS * Math.sin(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
            y: LOCATOR_RADIUS * Math.cos(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
        };
    }
}

export const playerHandLocator = new PlayerHandLocator();