import { ItemContext, ListLocator, MaterialContext } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";
import { Coordinates, Location, MaterialItem } from "@gamepark/rules-api";

const spotsCoordinates = [
    { x: -10.36, y: -1.19 },
    { x: -9.32, y: 1.21 },
    { x: -6.86, y: 2.67 },
    { x: -4.34, y: 3.03 },
    { x: -1.68, y: 2.73 },
    { x: -1.36, y: 0.45 },
    { x: -2.54, y: -1.61 },
    { x: -0.26, y: -2.15 },
    { x: 1.52, y: -0.61 },
    { x: 2.99, y: 1.21 },
    { x: 5.48, y: 2.19 },
    { x: 7.74, y: 1.54 },
    { x: 9.10, y: -0.31 },
    { x: 9.70, y: -3.07 }
];

class KitsunePawnSpotOnWisdomBoardLocator extends ListLocator {
    parentItemType = MaterialType.WisdomBoard

    getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>): Partial<Coordinates> {
        return {
            x: spotsCoordinates[location.id].x,
            y: spotsCoordinates[location.id].y - 0.7
        }
    }

    getItemCoordinates(item: MaterialItem<number, number>, context: ItemContext<number, number, number>): Partial<Coordinates> {
        const numberOfItems = this.countListItems(item.location, context);
        let coordinates = super.getItemCoordinates(item, context);
        if (numberOfItems === 2 && typeof coordinates.x !== 'undefined') {
            coordinates.x -= 0.5
        }
        return coordinates;
    }

    gap = { x: 1, y: 0 }
    maxCount = 2
}

export const kitsunePawnSpotOnWisdomBoardLocator = new KitsunePawnSpotOnWisdomBoardLocator();