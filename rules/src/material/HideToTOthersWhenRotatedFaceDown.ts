import { HidingSecretsStrategy, MaterialItem } from '@gamepark/rules-api';
import { KitsuCardRotation } from './KitsuCardRotation';
import { LocationType } from './LocationType';

export const hideToTOthersWhenRotatedFaceDown: HidingSecretsStrategy<number, LocationType> = (item: MaterialItem<number, LocationType>, player?: number): string[] => {
    if (item.location.rotation !== KitsuCardRotation.FaceDown) {
        return [];
    }
    return player !== item.location.player ? ['id'] : [];
};