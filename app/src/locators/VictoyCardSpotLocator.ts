import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { FlexLocator } from '@gamepark/react-game';

class VictoryCardLocator extends FlexLocator<number, MaterialType, LocationType> {
    limit = 2;
    coordinates = {x: -60, y: 0};
    rotateZ = -90;
    maxLines = 1;
    gap = {y: 7.5};
}

export const victoryCardSpotLocator = new VictoryCardLocator();