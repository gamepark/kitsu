import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { ItemContext, Locator } from "@gamepark/react-game";
import { MaterialType } from "@gamepark/kitsu/material/MaterialType";
import { Coordinates, MaterialItem } from "@gamepark/rules-api";
import { PowerToken } from "@gamepark/kitsu/material/PowerToken";

class PowerTokenSpotOnWisdomBoardLocator extends Locator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.WisdomBoard

    getItemCoordinates(item: MaterialItem<number, LocationType, PowerToken>, _context: ItemContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        switch (item.id) {
            case PowerToken.ColourExchange:
                return { x: -8.25, y: 5.9 }
            case PowerToken.PickDiscarded:
                return { x: -4.25, y: 5.9 }
            case PowerToken.Protection:
                return { x: -0.25, y: 5.9 }
            case PowerToken.NoAdvance:
                return { x: 3.75, y: 5.9 }
            case  PowerToken.Plus3:
                return { x: 7.75, y: 5.9 }
        }
    }
}

export const powerTokenSpotOnWisdomBoardLocator = new PowerTokenSpotOnWisdomBoardLocator();