import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { DeckLocator } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";

class KitsuCardDeckSpotOnWisdomBoardLocator extends DeckLocator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.WisdomBoard
    coordinates = { x: -15.7, y: 0 }
    limit = 30
}

export const kitsuCardDeckSpotOnWisdomBoardLocator = new KitsuCardDeckSpotOnWisdomBoardLocator()