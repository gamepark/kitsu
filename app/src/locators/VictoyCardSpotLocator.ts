import { FlexLocator } from '@gamepark/react-game';

class VictoryCardLocator extends FlexLocator {
    coordinates = { x: -60, y: 0 }
    limit = 2
    rotateZ = -90
}

export const victoryCardSpotLocator = new VictoryCardLocator();