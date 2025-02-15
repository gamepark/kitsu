import { ClanCard } from '@gamepark/kitsu/material/ClanCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { Locator, MaterialContext } from '@gamepark/react-game';
import { Location, MaterialItem } from '@gamepark/rules-api';
import { clanCardDescription } from '../material/ClanCardDescription';

class PowerTokenSpotOnClanCardLocator extends Locator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.ClanCard;

    getParentItem(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): MaterialItem<number, LocationType, ClanCard> | undefined {
        return clanCardDescription.getStaticItems(context).find(item => item.location.player === location.player);
    }

    coordinates = {x: -0.55, y: 1.69};
    rotateZ = -90;
}

export const powerTokenSpotOnClanCardLocator = new PowerTokenSpotOnClanCardLocator();