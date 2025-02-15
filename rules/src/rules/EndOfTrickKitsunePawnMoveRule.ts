import { Material, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import {
    getKitsuCardValue,
    getSpecialCardType,
    isSpecialCard,
    isYakoCard,
    isZenkoCard,
    KitsuCard,
    KitsuCardSpecialType
} from '../material/KitsuCard';
import { KitsuCardRotation } from '../material/KitsuCardRotation';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { TeamColor } from '../TeamColor';
import { RuleId } from './RuleId';

export class EndOfTrickKitsunePawnMoveRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const playedCards = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot);
        const numberOfWhiteKitsunePlayed = playedCards
            .id<KitsuCard>(id => isSpecialCard(id) && getSpecialCardType(id) === KitsuCardSpecialType.WhiteKitsune)
            .length;
        const invertColors = numberOfWhiteKitsunePlayed % 2 === 1;

        const yakoScore = this.getScore(playedCards, invertColors ? TeamColor.Zenko : TeamColor.Yako);
        const zenkoScore = this.getScore(playedCards, invertColors ? TeamColor.Yako : TeamColor.Zenko);
        const scoreDifference = Math.abs(yakoScore - zenkoScore);
        const winningTeam = scoreDifference === 0
            ? undefined
            : (yakoScore > zenkoScore ? TeamColor.Yako : TeamColor.Zenko);
        const discardCardsRuleMove = this.startRule(RuleId.EndOfTrickDiscardCards);

        if (winningTeam === undefined) {
            return [discardCardsRuleMove];
        }

        const currentKitsuneSpotId = this.material(MaterialType.KitsunePawn).id(winningTeam).getItem()!.location.id;
        const finalKitsuneSpotId = Math.min(currentKitsuneSpotId + scoreDifference, 13);
        const kitsuneSpotMaterial = this.material(MaterialType.KitsunePawn).id(winningTeam);
        const moves: MaterialMove<number, MaterialType, LocationType>[] = [...Array(finalKitsuneSpotId - currentKitsuneSpotId).fill(1).map((_, index) => kitsuneSpotMaterial.moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: currentKitsuneSpotId + 1 + index,
        }))];
        if (finalKitsuneSpotId - currentKitsuneSpotId >= 4) {
            const currentLeader = this.material(MaterialType.LeaderToken).getItem()!.location.player!;
            const loosingTeamNextLeader = this.game.players[(this.game.players.indexOf(currentLeader) + 1) % this.game.players.length];
            moves.push(this.startPlayerTurn<number, RuleId>(RuleId.EndOfTrickPickAvailablePowerToken, loosingTeamNextLeader));
        } else {
            moves.push(discardCardsRuleMove);
        }
        return moves;

    }

    private getScore(playedCards: Material<number, MaterialType, LocationType>, team: TeamColor) {
        const filteringFunction = team === TeamColor.Zenko ? isZenkoCard : isYakoCard;
        return playedCards.id<KitsuCard>(id => filteringFunction(id))
            .getItems<KitsuCard>(item => item.location.rotation !== KitsuCardRotation.FaceDown)
            .reduce(
                (score, card) => score + getKitsuCardValue(card.id),
                0
            );
    }
}