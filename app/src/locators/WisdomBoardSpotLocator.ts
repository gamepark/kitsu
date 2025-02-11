import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import {Locator} from "@gamepark/react-game";

class WisdomBoardSpotLocator extends Locator<number, MaterialType, LocationType> {
    coordinates = { x: -50, y: 0 }
    rotateZ = -90
}

export const wisdomBoardSpotLocator = new WisdomBoardSpotLocator()