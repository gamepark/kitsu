import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { FlexLocator, MaterialContext } from '@gamepark/react-game';
import { Coordinates, Location } from '@gamepark/rules-api';

class DiscardedCardsToPickSpotLocator extends FlexLocator<number, MaterialType, LocationType> {
    limit = 6;
    lineSize = 6;
    gap = {x: 7, y: 0};

    public getCoordinates(location: Location<number, number>, context: MaterialContext<number, number, number>): Partial<Coordinates> {
        return context.rules.material(MaterialType.KitsuCard).location(location.type).length === 4
            ? { x: -60.5, y: -25 }
            : { x: -66, y: -25 }
    }
}

export const discardedCardsToPickSpotLocator = new DiscardedCardsToPickSpotLocator();