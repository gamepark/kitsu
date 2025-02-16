import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PileLocator } from '@gamepark/react-game';

class DiscardedPowerTokenAreaOnWisdomBoardLocator extends PileLocator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.WisdomBoard;
    limit = 5;
    coordinates = {x: -7.05, y: 0};
    radius = 2;
    maxAngle = 180;
}

export const discardedPowerTokenAreaOnWisdomBoardLocator = new DiscardedPowerTokenAreaOnWisdomBoardLocator();