import { isMoveItemType, ItemMove, MaterialMove, MoveItem, PlayerTurnRule, PlayMoveContext } from "@gamepark/rules-api";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";
import { RuleId } from "./RuleId";

export class PlayKitsuCardRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        return this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayerHand)
            .player(this.player)
            .moveItems({ type: LocationType.PlayedKitsuCardSpot, player: this.player });
    }

    afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
            && (move as MoveItem<number, MaterialType, LocationType>).location.type === LocationType.PlayedKitsuCardSpot
            && (move as MoveItem<number, MaterialType, LocationType>).location.player === this.player) {
            const numberOfCardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length;
            return (numberOfCardsPlayed < 4)
                ? [this.startPlayerTurn<number, RuleId>(RuleId.PlayKitsuCard, this.nextPlayer)]
                : [this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickDiscardCardsAndMoveKitsunePawn, this.nextPlayer)];
        }
        return [];
    }
}