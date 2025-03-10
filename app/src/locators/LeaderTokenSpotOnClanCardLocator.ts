import { ClanCard } from '@gamepark/kitsu/material/ClanCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { clanCardDescription } from '../material/ClanCardDescription'

class LeaderTokenSpotOnClanCardLocator extends Locator<number, MaterialType, LocationType> {
  parentItemType = MaterialType.ClanCard

  getParentItem(
    location: Location<number, LocationType, number, number>,
    context: MaterialContext<number, MaterialType, LocationType>,
  ): MaterialItem<number, LocationType, ClanCard> | undefined {
    return clanCardDescription.getStaticItems(context).find((item) => item.location.player === location.player)
  }

  coordinates = { x: 4.15, y: -0.1 }
}

export const leaderTokenSpotOnClanCardLocator = new LeaderTokenSpotOnClanCardLocator()
