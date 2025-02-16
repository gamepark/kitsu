import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove } from '@gamepark/rules-api';
import { LocationType } from './LocationType';
import { MaterialType } from './MaterialType';

export enum CustomMoveType {
    PickRandomPlayer = 1,
    PlayCardAndToken = 2
}

export type PlayCardAndTokenCustomMove = CustomMove & {
    type: typeof CustomMoveType.PlayCardAndToken;
    data: {
        cardIndex: number;
        powerTokenMove: MaterialMove<number, MaterialType, LocationType>
    }
}

export const isPlayCardAndTokenCustomMove = (move: MaterialMove<number, MaterialType, LocationType>): move is PlayCardAndTokenCustomMove => {
    return isCustomMoveType<CustomMoveType>(CustomMoveType.PlayCardAndToken)(move) && typeof move.data.cardIndex === 'number' && isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move.data.powerTokenMove);
}