import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

const spotsCoordinates = [
  { x: -10.36, y: -1.19 },
  { x: -9.32, y: 1.21 },
  { x: -6.86, y: 2.67 },
  { x: -4.34, y: 3.03 },
  { x: -1.68, y: 2.73 },
  { x: -1.36, y: 0.45 },
  { x: -2.54, y: -1.61 },
  { x: -0.26, y: -2.15 },
  { x: 1.52, y: -0.61 },
  { x: 2.99, y: 1.21 },
  { x: 5.48, y: 2.19 },
  { x: 7.74, y: 1.54 },
  { x: 9.1, y: -0.31 },
  { x: 9.7, y: -3.07 },
]

class KitsunePawnSpotOnWisdomBoardLocator extends ListLocator<number, MaterialType, LocationType> {
  parentItemType = MaterialType.WisdomBoard

  getCoordinates(
    location: Location<number, LocationType, number, number>,
    _context: MaterialContext<number, MaterialType, LocationType>,
  ): Partial<Coordinates> {
    return {
      x: spotsCoordinates[location.id ?? 0].x,
      y: spotsCoordinates[location.id ?? 0].y - 0.7,
    }
  }

  gap = { x: 1, y: 0 }
  maxCount = 2

  getItemCoordinates(item: MaterialItem<number, LocationType, KitsunePawn>, context: ItemContext<number, MaterialType, LocationType>): Partial<Coordinates> {
    const numberOfItems = this.countListItems(item.location, context)
    const coordinates = super.getItemCoordinates(item, context)
    if (numberOfItems === 2 && typeof coordinates.x !== 'undefined') {
      coordinates.x -= 0.5
    }
    return coordinates
  }
}

export const kitsunePawnSpotOnWisdomBoardLocator = new KitsunePawnSpotOnWisdomBoardLocator()
