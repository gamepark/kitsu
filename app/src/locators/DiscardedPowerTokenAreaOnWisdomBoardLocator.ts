import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PileLocator } from '@gamepark/react-game';

class DiscardedPowerTokenAreaOnWisdomBoardLocator extends PileLocator<number, MaterialType, LocationType> {
    limit = 5;
    coordinates = {x: -60, y: -15};
    radius = 3;
    maxAngle = 180;
}

export const discardedPowerTokenAreaOnWisdomBoardLocator = new DiscardedPowerTokenAreaOnWisdomBoardLocator();