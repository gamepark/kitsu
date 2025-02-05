import { HidingSecretsStrategy, MaterialItem } from '@gamepark/rules-api';
import { LocationType } from './LocationType';

export const hideToTOthersWhenRotatedFaceDown: HidingSecretsStrategy<number, LocationType> = (item: MaterialItem<number, LocationType>, player?: number): string[] => [];