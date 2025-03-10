import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { ItemContext, Locator } from '@gamepark/react-game'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'

class PowerTokenSpotOnWisdomBoardLocator extends Locator<number, MaterialType, LocationType> {
  parentItemType = MaterialType.WisdomBoard

  getItemCoordinates(item: MaterialItem<number, LocationType, PowerToken>, _context: ItemContext<number, MaterialType, LocationType>): Partial<Coordinates> {
    switch (item.id) {
      case PowerToken.ColourExchange:
        return { x: -8.25, y: 5.8 }
      case PowerToken.PickDiscarded:
        return { x: -4.2, y: 5.8 }
      case PowerToken.Protection:
        return { x: -0.2, y: 5.8 }
      case PowerToken.NoAdvance:
        return { x: 3.8, y: 5.8 }
      case PowerToken.Plus3:
        return { x: 7.85, y: 5.8 }
    }
  }
}

export const powerTokenSpotOnWisdomBoardLocator = new PowerTokenSpotOnWisdomBoardLocator()
