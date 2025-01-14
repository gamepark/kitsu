import { Locator, MaterialContext } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";
import { Location, MaterialItem } from "@gamepark/rules-api";
import { clanCardDescription } from "../material/ClanCardDescription";

class LeaderTokenSpotOnClanCardLocator extends Locator {
    parentItemType = MaterialType.ClanCard
    coordinates = { x: -0.1, y: -4.15 }
    rotateZ = -90

    getParentItem(location: Location<number, number>, context: MaterialContext<number, number, number>): MaterialItem<number, number> | undefined {
        return clanCardDescription.getStaticItems(context).find(item => item.location.player === location.player)
    }
}

export const leaderTokenSpotOnClanCardLocator = new LeaderTokenSpotOnClanCardLocator();