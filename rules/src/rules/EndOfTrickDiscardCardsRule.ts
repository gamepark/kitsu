import {
    isMoveItemType,
    isMoveItemTypeAtOnce,
    ItemMove,
    MaterialMove,
    PlayerTurnRule,
    PlayMoveContext,
    RuleMove,
    RuleStep
} from '@gamepark/rules-api';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class EndOfTrickDiscardCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {

    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const moves = [
            this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).moveItemsAtOnce({
                type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
            }),
            ...this.getPowerTokenMove(),
        ];
        const cardsInPlayerHands = this.material(MaterialType.KitsuCard).location(LocationType.PlayerHand);
        if (cardsInPlayerHands.length === 1) {
            moves.push(...cardsInPlayerHands.moveItems({
                type: LocationType.KitsuCardDiscardSpotOnWisdomBoard
            }));
        }
        const ruleMove = this.startRule(RuleId.EndOfTrickDecideEndOfRound);
        moves.push(ruleMove);
        return moves;
    }

    afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if ((isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.KitsuCardDiscardSpotOnWisdomBoard) || (
            isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && move.location.type === LocationType.KitsuCardDiscardSpotOnWisdomBoard)
        ) {
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

    private getPowerTokenMove(): MaterialMove<number, MaterialType, LocationType>[] {
        const playedPowerTokens = this.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnKitsuCard);
        if (playedPowerTokens.length > 0) {
            return [
                playedPowerTokens.moveItemsAtOnce({
                    type: LocationType.DiscardedPowerTokenAreaOnWisdomBoard
                })
            ];
        }
        return [];
    }
}