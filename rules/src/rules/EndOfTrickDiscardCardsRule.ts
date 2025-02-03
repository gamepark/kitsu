import {
    isMoveItemTypeAtOnce,
    ItemMove,
    MaterialMove,
    PlayerTurnRule,
    PlayMoveContext,
    RuleMove,
    RuleStep
} from "@gamepark/rules-api";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";
import { RuleId } from "./RuleId";

export class EndOfTrickDiscardCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        return [
            this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).moveItemsAtOnce({
                type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
            }),
            this.startRule(RuleId.EndOfTrickDecideEndOfRound)
        ];
    }

    afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.KitsuCardDiscardSpotOnWisdomBoard) {
            if (this.material(MaterialType.KitsuCard).location(LocationType.PlayerHand).length === 0) {
                return [
                    this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDiscardSpotOnWisdomBoard).moveItemsAtOnce({
                        type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
                    })
                ];
            }
        }

        return [];
    }
}