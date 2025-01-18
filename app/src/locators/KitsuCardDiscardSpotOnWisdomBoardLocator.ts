import { DeckLocator } from "@gamepark/react-game";
import {MaterialType} from "@gamepark/kitsu/material/MaterialType";

class KitsuCardDiscardSpotOnWisdomBoardLocator extends DeckLocator {
    parentItemType = MaterialType.WisdomBoard
    coordinates = { x: 15.7, y: 0 }
    limit = 30
}

export const kitsuCardDiscardSpotOnWisdomBoardLocator = new KitsuCardDiscardSpotOnWisdomBoardLocator()