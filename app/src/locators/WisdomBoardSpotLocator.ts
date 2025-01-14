import {Locator} from "@gamepark/react-game";

class WisdomBoardSpotLocator extends Locator {
    coordinates = { x: -50, y: 0 }
    rotateZ = -90
}

export const wisdomBoardSpotLocator = new WisdomBoardSpotLocator()