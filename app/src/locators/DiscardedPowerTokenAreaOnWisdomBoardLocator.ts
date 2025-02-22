import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PileLocator } from '@gamepark/react-game';

class DiscardedPowerTokenAreaOnWisdomBoardLocator extends PileLocator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.WisdomBoard;
    limit = 5;
    coordinates = {x: 5.305, y: -2.02};
    radius = 1.75;
    maxAngle = 180;
}

export const discardedPowerTokenAreaOnWisdomBoardLocator = new DiscardedPowerTokenAreaOnWisdomBoardLocator();