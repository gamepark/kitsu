import {
    isMoveItemType,
    ItemMove,
    MaterialMove,
    PlayerTurnRule,
    PlayMoveContext,
    RuleMove,
    RuleStep
} from '@gamepark/rules-api';
import { isSpecialCard, KitsuCard } from '../material/KitsuCard';
import { KitsuCardRotation } from '../material/KitsuCardRotation';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { RuleId } from './RuleId';

export class SelectKatanaTargetRule extends PlayerTurnRule<number, MaterialType, LocationType> {

    public onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const cardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot);
        const cardsPlayedByOthers = cardsPlayed.player(player => player !== this.player);
        const numeralCardsPlayed = cardsPlayedByOthers.id<KitsuCard>(id => !isSpecialCard(id));
        if (numeralCardsPlayed.length > 0) {
            return [];
        }
        return cardsPlayed.length === 4
            ? [this.startPlayerTurn(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer)]
            : [this.startPlayerTurn(RuleId.PlayKitsuCard, this.nextPlayer)];
    }

    public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        return this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot)
            .player(player => player !== this.player)
            .id<KitsuCard>(id => !isSpecialCard(id))
            .moveItems(item => ({
                type: LocationType.PlayedKitsuCardSpot,
                rotation: KitsuCardRotation.FaceDown,
                player: item.location.player
            }));
    }

    public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
            && move.location.type === LocationType.PlayedKitsuCardSpot
            && move.location.rotation === KitsuCardRotation.FaceDown) {
            const numberOfCardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length;
            return numberOfCardsPlayed === 4
                ? [this.startPlayerTurn(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer)]
                : [this.startPlayerTurn(RuleId.PlayKitsuCard, this.nextPlayer)];
        }
        return [];
    }


}