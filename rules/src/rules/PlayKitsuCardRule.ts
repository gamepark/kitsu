import {
    CustomMove,
    isMoveItemType,
    ItemMove,
    Material,
    MaterialMove,
    MoveItem,
    PlayerTurnRule,
    PlayMoveContext
} from '@gamepark/rules-api';
import { CustomMoveType, isPlayCardAndTokenCustomMove } from '../material/CustomMoveType';
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
    public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        const previousPlayer = this.game.players[(this.game.players.indexOf(this.player) - 1 + this.game.players.length) % this.game.players.length];
        const previousPlayerTeam = this.remind<TeamColor>(Memorize.Team, previousPlayer);
        const isPreviousCardBlackKitsune = this.isPlayerPreviousCardABlackKitsune(previousPlayer);
        const allCards = this.material(MaterialType.KitsuCard).location(LocationType.PlayerHand).player(this.player);
        const allMoves: MaterialMove<number, MaterialType, LocationType>[] = allCards.moveItems({
            type: LocationType.PlayedKitsuCardSpot,
            player: this.player
        });
        allMoves.push(...this.getPowerTokenMoves(allCards));
        if (isPreviousCardBlackKitsune && this.areOpposingTeamCardsInHand(allCards, previousPlayerTeam)) {
            return this.filterMovesBecauseOfBlackKitsune(previousPlayerTeam, allCards, allMoves);
        }
        return allMoves;
    }

    public onCustomMove(move: CustomMove, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isPlayCardAndTokenCustomMove(move))
        {
            return [
                move.data.powerTokenMove,
                this.material(MaterialType.KitsuCard).index(move.data.cardIndex).moveItem({
                    type: LocationType.PlayedKitsuCardSpot,
                    player: this.player,
                }),
            ]
        }
        return [];
    }

    public afterItemMove(move: ItemMove<number, MaterialType, LocationType>, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        if (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
            && (move as MoveItem<number, MaterialType, LocationType>).location.type === LocationType.PlayedKitsuCardSpot
            && (move as MoveItem<number, MaterialType, LocationType>).location.player === this.player) {
            const cardPlayed = this.material(MaterialType.KitsuCard).getItem<KitsuCard>(move.itemIndex);
            if (isSpecialCard(cardPlayed.id) && getSpecialCardType(cardPlayed.id) === KitsuCardSpecialType.Katana) {
                return [this.startRule(RuleId.SelectKatanaTarget)];
            }
            const moves: MaterialMove<number, MaterialType, LocationType>[] = [];
            const selectedPowerToken = this.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnClanCard).player(this.player).selected(true);
            if (selectedPowerToken.length === 1) {
                moves.push(
                    selectedPowerToken.unselectItem(),
                    selectedPowerToken.moveItem({
                        type: LocationType.PowerTokenSportOnKitsuCard,
                        parent: move.itemIndex,
                    })
                );
            }
            const numberOfCardsPlayed = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).length;
            moves.push(numberOfCardsPlayed < 4
                ? this.startPlayerTurn<number, RuleId>(RuleId.PlayKitsuCard, this.nextPlayer)
                : this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickKistunePawnMove, this.nextPlayer));
            return moves;
        }
        return [];
    }

    private areOpposingTeamCardsInHand(cards: Material<number, MaterialType, LocationType>, opposingTeam: TeamColor): boolean {
        const opposingTeamCardType = opposingTeam === TeamColor.Yako ? KitsuCardType.Zenko : KitsuCardType.Yako;
        return cards.getItems(card => getKitsuCardType(card.id) === opposingTeamCardType).length !== 0;
    }

    private filterMovesBecauseOfBlackKitsune(previousPlayerTeam: TeamColor, allCards: Material<number, MaterialType, LocationType>, allMoves: MaterialMove<number, MaterialType, LocationType>[]): MaterialMove<number, MaterialType, LocationType>[] {
        const previousPlayerTeamCardType = previousPlayerTeam === TeamColor.Yako ? KitsuCardType.Yako : KitsuCardType.Zenko;
        const consideredCardIndexes = allCards.id((cardId: KitsuCard) => getKitsuCardType(cardId) === previousPlayerTeamCardType).getIndexes();
        return allMoves.filter(move =>
            (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && consideredCardIndexes.includes(move.itemIndex))
            || (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) && consideredCardIndexes.includes(move.location.parent!)));
    }

    private getPowerTokenMoves(allCards: Material<number, MaterialType, LocationType>): MaterialMove<number, MaterialType, LocationType>[] {
        const powerToken = this.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnClanCard).player(this.player);
        if (powerToken.length === 1) {
            if (powerToken.selected(true).length === 1) {
                return [powerToken.unselectItem()];
            } else {
                return [
                    ...allCards.getIndexes()
                        .map(index => this.customMove<CustomMoveType>(CustomMoveType.PlayCardAndToken, {cardIndex: index, powerTokenMove: powerToken.moveItem({
                            type: LocationType.PowerTokenSportOnKitsuCard,
                            parent: index
                        })})),
                    powerToken.selectItem()];
            }
        }
        return [];
    }

    private isPlayerPreviousCardABlackKitsune(previousPlayer: number): boolean {
        const cardPlayedByPreviousPlayer = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot)
            .player(previousPlayer)
            .maxBy(card => card.location.x!)
            .getItem();
        return cardPlayedByPreviousPlayer !== undefined
            && isSpecialCard(cardPlayedByPreviousPlayer.id)
            && getSpecialCardType(cardPlayedByPreviousPlayer.id) === KitsuCardSpecialType.BlackKitsune;
    }
}