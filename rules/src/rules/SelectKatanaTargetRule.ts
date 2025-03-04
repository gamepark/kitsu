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
        const selectableNumeralCardsPlayed = cardsPlayedByOthers.id<KitsuCard>(id => !isSpecialCard(id)).rotation(rotation => rotation !== KitsuCardRotation.FaceDown);
        if (selectableNumeralCardsPlayed.length > 0) {
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
            .rotation(rotation => rotation !== KitsuCardRotation.FaceDown)
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
            const numberOfCardsToPlay = this.game.players.length === 6 ? 6 : 4
            return numberOfCardsPlayed === numberOfCardsToPlay
                ? [this.startPlayerTurn(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer)]
                : [this.startPlayerTurn(RuleId.PlayKitsuCard, this.nextPlayer)];
        }
        return [];
    }


}