import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game';
import { Coordinates, Location } from '@gamepark/rules-api';
import { RADIUS } from './Radius';

class ClanCardSpotLocator extends Locator<number, MaterialType, LocationType> {
    getCoordinates(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        return {
            x: RADIUS * Math.sin(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
            y: RADIUS * Math.cos(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
        };
    }

    getRotateZ(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;

        return 180 * getRelativePlayerIndex(context, location.player) / numberOfSectors;
    }
}

export const clanCardSpotLocator = new ClanCardSpotLocator();