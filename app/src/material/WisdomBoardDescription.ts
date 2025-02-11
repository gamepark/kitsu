import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { BoardDescription } from '@gamepark/react-game'
import WisdomBoard from '../images/Board/WisdomBoard.jpg'
import {LocationType} from "@gamepark/kitsu/material/LocationType";

class WisdomBoardDescription extends BoardDescription<number, MaterialType, LocationType> {
    width = 28.61
    height = 10.10
    image = WisdomBoard

    staticItem = {
        location: {
            type: LocationType.WisdomBoardSpot
        }
    }
}

export const wisdomBoardDescription = new WisdomBoardDescription()