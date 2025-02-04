import { PileLocator } from "@gamepark/react-game";

class VictoryCardLocator extends PileLocator {
    coordinates = { x: -60, y: 0 }
    limit = 2
    radius = 90
    maxAngle = 90
}

export const victoryCardSpotLocator = new VictoryCardLocator();