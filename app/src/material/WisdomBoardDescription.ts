import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { BoardDescription } from '@gamepark/react-game';
import { WisdomBoardHelp } from '../components/Help/WisdomBoardHelp';
import WisdomBoard from '../images/Board/WisdomBoard.jpg';

class WisdomBoardDescription extends BoardDescription<number, MaterialType, LocationType> {
    height = 10.10;
    width = 28.61;
    image = WisdomBoard;
    help = WisdomBoardHelp

    staticItem = {
        location: {
            type: LocationType.WisdomBoardSpot
        }
    };
}

export const wisdomBoardDescription = new WisdomBoardDescription();