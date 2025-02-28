import {
    isMoveItemType,
    ItemMove,
    Location,
    Material,
    MaterialItem,
    MaterialMove,
    MoveItem,
    PlayerTurnRule,
    PlayMoveContext
} from '@gamepark/rules-api';
import {
    canBePlayedWithProtectionToken,
    getKitsuCardType,
    getSpecialCardType,
    isSpecialCard,
    KitsuCard,
    KitsuCardSpecialType,
    KitsuCardType
} from '../material/KitsuCard';
import { KitsuCardRotation } from '../material/KitsuCardRotation';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { PowerToken } from '../material/PowerToken';
import { PowerTokenPlus3Side } from '../material/PowerTokenPlus3Side';
import { Memorize } from '../Memorize';
import { TeamColor } from '../TeamColor';
import { RuleId } from './RuleId';

export class PlayKitsuCardRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    public getPlayerMoves(): MaterialMove<number, MaterialType, LocationType>[] {
        const previousPlayer = this.game.players[(this.game.players.indexOf(this.player) - 1 + this.game.players.length) % this.game.players.length];
        const previousPlayerTeam = this.remind<TeamColor>(Memorize.Team, previousPlayer);
        const isPreviousCardBlackKitsune = this.isPlayerPreviousCardABlackKitsune(previousPlayer);
        const protectionPowerToken = this.material(MaterialType.PowerToken)
            .location(location => (location.type === LocationType.PowerTokenSpotOnClanCard && location.player === this.player) || (location.type === LocationType.PowerTokenSportOnKitsuCard && this.material(MaterialType.KitsuCard).index(location.parent).player(this.player).length !== 0))
            .id<PowerToken>(PowerToken.Protection);
        const isProtectionTokenSelected = protectionPowerToken
            .selected(true)
            .getItem<PowerToken>() !== undefined;
        const allPlayableCards = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayerHand)
            .player(this.player)
            .filter(kitsuCard => !isProtectionTokenSelected || canBePlayedWithProtectionToken(kitsuCard.id));
        const cardDestinationLocation = this.getCardsDestination(isProtectionTokenSelected);
        const allMoves: MaterialMove<number, MaterialType, LocationType>[] = allPlayableCards.moveItems(cardDestinationLocation);
        allMoves.push(...this.getPowerTokenMoves(allPlayableCards, protectionPowerToken.getItem<PowerToken>()));
        if (isPreviousCardBlackKitsune && this.areOpposingTeamCardsInHand(allPlayableCards, previousPlayerTeam)) {
            return this.filterMovesBecauseOfBlackKitsune(previousPlayerTeam, allPlayableCards, allMoves);
        }
        return allMoves;
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

    private getCardsDestination(isProtectionTokenSelected: boolean): Location<number, LocationType, any, KitsuCardRotation> {
        const cardDestinationLocation: Location<number, LocationType, any, KitsuCardRotation> = {
            type: LocationType.PlayedKitsuCardSpot,
            player: this.player
        };
        if (isProtectionTokenSelected) {
            cardDestinationLocation.rotation = KitsuCardRotation.FaceDown;
        }
        return cardDestinationLocation;
    }

    private filterMovesBecauseOfBlackKitsune(previousPlayerTeam: TeamColor, allCards: Material<number, MaterialType, LocationType>, allMoves: MaterialMove<number, MaterialType, LocationType>[]): MaterialMove<number, MaterialType, LocationType>[] {
        const previousPlayerTeamCardType = previousPlayerTeam === TeamColor.Yako ? KitsuCardType.Yako : KitsuCardType.Zenko;
        const consideredCardIndexes = allCards.id((cardId: KitsuCard) => getKitsuCardType(cardId) === previousPlayerTeamCardType).getIndexes();
        return allMoves.filter(move =>
            (isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) && consideredCardIndexes.includes(move.itemIndex))
            || (isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) && consideredCardIndexes.includes(move.location.parent!)));
    }

    private getPowerTokenMoves(allCards: Material<number, MaterialType, LocationType>, protectionPowerToken?: MaterialItem<number, LocationType, PowerToken>): MaterialMove<number, MaterialType, LocationType>[] {
        const powerToken = this.material(MaterialType.PowerToken)
            .location(location => (location.type === LocationType.PowerTokenSpotOnClanCard && location.player === this.player));
        if (powerToken.length === 1) {
            if (powerToken.selected(true).length === 1) {
                return [powerToken.unselectItem()];
            } else {
                const isProtectionPowerToken = protectionPowerToken !== undefined;
                const isPlus3PowerToken = this.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.Plus3).location(LocationType.PowerTokenSpotOnClanCard).length === 1;
                const cardIndexes = allCards.filter(kitsuCard => !isProtectionPowerToken || canBePlayedWithProtectionToken(kitsuCard.id))
                    .getIndexes();
                return [
                    ...cardIndexes.flatMap(cardIndex => this.mapIndexToTokenAndCardMoveIfNecessary(cardIndex, powerToken, isProtectionPowerToken, isPlus3PowerToken)),
                    powerToken.selectItem()
                ];
            }
        }
        return [];
    }

    private mapIndexToTokenAndCardMoveIfNecessary(cardIndex: number, powerToken: Material<number, MaterialType, LocationType>, isTokenPowerToken: boolean, isPlus3PowerToken: boolean): MaterialMove<number, MaterialType, LocationType>[] {
        const moves = [
            powerToken.moveItem({
                type: LocationType.PowerTokenSportOnKitsuCard,
                parent: cardIndex
            })
        ];
        if (isTokenPowerToken) {
            moves.push(this.material(MaterialType.KitsuCard).index(cardIndex).moveItem({
                type: LocationType.PlayedKitsuCardSpot,
                player: this.player,
                rotation: KitsuCardRotation.FaceDown
            }));
        }
        if (isPlus3PowerToken) {
            moves.push(powerToken.moveItem({
                type: LocationType.PowerTokenSportOnKitsuCard,
                parent: cardIndex,
                rotation: PowerTokenPlus3Side.Zenko
            }));
        }
        return moves;
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