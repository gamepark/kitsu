import {
    isMoveItemType,
    ItemMove,
    Material,
    MaterialMove,
    MoveItem,
    PlayerTurnRule,
    PlayMoveContext
} from '@gamepark/rules-api';
import {
    getKitsuCardType,
    getSpecialCardType,
    isSpecialCard,
    KitsuCard,
    KitsuCardSpecialType,
    KitsuCardType
} from '../material/KitsuCard';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { Memorize } from '../Memorize';
import { TeamColor } from '../TeamColor';
import { RuleId } from './RuleId';

export class PlayKitsuCardRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        const previousPlayer = this.game.players[(this.game.players.indexOf(this.player) - 1 + this.game.players.length) % this.game.players.length];
        const previousPlayerTeam = this.remind<TeamColor>(Memorize.Team, previousPlayer);
        const cardPlayedByPreviousPlayer = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot)
            .player(previousPlayer)
            .maxBy(card => card.location.x!)
            .getItem();
        const isPreviousCardBlackKitsune = cardPlayedByPreviousPlayer !== undefined && isSpecialCard(cardPlayedByPreviousPlayer.id) && getSpecialCardType(cardPlayedByPreviousPlayer.id) === KitsuCardSpecialType.BlackKitsune;
        const allCards = this.material(MaterialType.KitsuCard).location(LocationType.PlayerHand).player(this.player);
        const allCardsMoves = allCards.moveItems({type: LocationType.PlayedKitsuCardSpot, player: this.player});
        if (isPreviousCardBlackKitsune && this.areOpposingTeamCardsInHand(allCards, previousPlayerTeam)) {
            const previousPlayerTeamCardType = previousPlayerTeam === TeamColor.Yako ? KitsuCardType.Yako : KitsuCardType.Zenko;
            return allCards.id((cardId: KitsuCard) => getKitsuCardType(cardId) === previousPlayerTeamCardType).moveItems({
                type: LocationType.PlayedKitsuCardSpot,
                player: this.player
            });
        }
        return allCardsMoves;
    }

    afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
            && (move as MoveItem<number, MaterialType, LocationType>).location.type === LocationType.PlayedKitsuCardSpot
            && (move as MoveItem<number, MaterialType, LocationType>).location.player === this.player) {
            const numberOfCardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length;
            return (numberOfCardsPlayed < 4)
                ? [this.startPlayerTurn<number, RuleId>(RuleId.PlayKitsuCard, this.nextPlayer)]
                : [this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer)];
        }
        return [];
    }

    private areOpposingTeamCardsInHand(cards: Material<number, MaterialType, LocationType>, opposingTeam: TeamColor): boolean {
        const opposingTeamCardType = opposingTeam === TeamColor.Yako ? KitsuCardType.Zenko : KitsuCardType.Yako;
        return cards.getItems(card => getKitsuCardType(card.id) === opposingTeamCardType).length !== 0;
    }
}