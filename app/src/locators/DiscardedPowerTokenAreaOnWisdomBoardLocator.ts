import { PileLocator } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";

class DiscardedPowerTokenAreaOnWisdomBoardLocator extends PileLocator {
    parentItemType = MaterialType.WisdomBoard
    coordinates = { x: -7.05, y: 0 }
    limit = 5
    radius = 2
    maxAngle = 180
}

export const discardedPowerTokenAreaOnWisdomBoardLocator = new DiscardedPowerTokenAreaOnWisdomBoardLocator();