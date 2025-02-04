import { PileLocator } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";

class VictoryCardLocator extends PileLocator {
    parentItemType = MaterialType.WisdomBoard
    coordinates = { x: 0, y: -9.45 }
    limit = 2
    radius = 90
    maxAngle = 90
}

export const victoryCardSpotLocator = new VictoryCardLocator();