import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { FlexLocator, MaterialContext } from '@gamepark/react-game';
import { Coordinates, Location } from '@gamepark/rules-api';

class VictoryCardLocator extends FlexLocator<number, MaterialType, LocationType> {
    limit = 2;
    coordinates = {x: -60, y: 0};
    rotateZ = -90;
    maxLines = 1;
    gap = {y: 7};

    public getCoordinates(_location: Location<number, LocationType>, _context: MaterialContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        switch (this.countItems(_location, _context)) {
            case 2:
                return { x: -60, y: -3.2 };
            case 3:
                return { x: -60, y: -6 };
            default:
                return { x: -60, y: 0 };
        }
    }
}

export const victoryCardSpotLocator = new VictoryCardLocator();