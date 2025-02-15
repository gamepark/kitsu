import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { Locator } from '@gamepark/react-game';

class PowerTokenSpotOnKitsuCardLocator extends Locator<number, MaterialType, LocationType> {
    parentItemType = MaterialType.KitsuCard;
    coordinates = { x: 0, y: 0 };
    limit = 1
}

export const powerTokenSpotOnKitsuCardLocator = new PowerTokenSpotOnKitsuCardLocator();