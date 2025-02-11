import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { DeckLocator } from "@gamepark/react-game";
import {MaterialType} from "@gamepark/kitsu/material/MaterialType";

class KitsuCardDiscardSpotOnWisdomBoardLocator extends DeckLocator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.WisdomBoard
    coordinates = { x: 15.7, y: 0 }
    limit = 30
}

export const kitsuCardDiscardSpotOnWisdomBoardLocator = new KitsuCardDiscardSpotOnWisdomBoardLocator()