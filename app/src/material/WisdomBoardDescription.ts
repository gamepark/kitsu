import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { BoardDescription } from '@gamepark/react-game';
import WisdomBoard from '../images/Board/WisdomBoard.jpg';

class WisdomBoardDescription extends BoardDescription<number, MaterialType, LocationType> {
    height = 10.10;
    width = 28.61;
    image = WisdomBoard;

    staticItem = {
        location: {
            type: LocationType.WisdomBoardSpot
        }
    };
}

export const wisdomBoardDescription = new WisdomBoardDescription();