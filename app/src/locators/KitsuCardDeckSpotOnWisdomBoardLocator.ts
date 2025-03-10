import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { DeckLocator } from '@gamepark/react-game'

class KitsuCardDeckSpotOnWisdomBoardLocator extends DeckLocator<number, MaterialType, LocationType> {
  parentItemType = MaterialType.WisdomBoard
  limit = 30
  coordinates = { x: -15.7, y: 0 }
}

export const kitsuCardDeckSpotOnWisdomBoardLocator = new KitsuCardDeckSpotOnWisdomBoardLocator()
