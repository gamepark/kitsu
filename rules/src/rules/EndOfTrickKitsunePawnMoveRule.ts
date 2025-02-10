import { MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api';
import {
    getKitsuCardValue,
    getSpecialCardType,
    isSpecialCard,
    isYakoCard,
    isZenkoCard,
    KitsuCard,
    KitsuCardSpecialType
} from '../material/KitsuCard';
import { LocationType } from '../material/LocationType';
import { MaterialType } from '../material/MaterialType';
import { TeamColor } from '../TeamColor';
import { RuleId } from './RuleId';

export class EndOfTrickKitsunePawnMoveRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const playedCards = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot)
            .getItems<KitsuCard>();
        const numberOfWhiteKitsunePlayed = this.material(MaterialType.KitsuCard)
            .location(LocationType.PlayedKitsuCardSpot)
            .id<KitsuCard>(id => isSpecialCard(id) && getSpecialCardType(id) === KitsuCardSpecialType.WhiteKitsune)
            .length;
        const invertColors = numberOfWhiteKitsunePlayed % 2 === 1;

        const yakoScore = this.getScore(playedCards, invertColors ? TeamColor.Zenko : TeamColor.Yako);
        const zenkoScore = this.getScore(playedCards, invertColors ? TeamColor.Yako : TeamColor.Zenko);
        const scoreDifference = Math.abs(yakoScore - zenkoScore);
        const winningTeam = scoreDifference === 0
            ? undefined
            : (yakoScore > zenkoScore ? TeamColor.Yako : TeamColor.Zenko);
        const ruleMove = this.startRule(RuleId.EndOfTrickDiscardCards);

        if (winningTeam === undefined) {
            return [ruleMove];
        }

        const currentKitsuneSpotId = this.material(MaterialType.KitsunePawn).id(winningTeam).getItem()!.location.id;
        const finalKitsuneSpotId = Math.min(currentKitsuneSpotId + scoreDifference, 13);
        const kitsuneSpotMaterial = this.material(MaterialType.KitsunePawn).id(winningTeam);
        return [
            ...Array(finalKitsuneSpotId - currentKitsuneSpotId).fill(1).map((_, index) => kitsuneSpotMaterial.moveItem({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: currentKitsuneSpotId + 1 + index,
            })),
            ruleMove
        ];

    }

    private getScore(playedCards: MaterialItem<number, LocationType, KitsuCard>[], team: TeamColor) {
        const filteringFunction = team === TeamColor.Zenko ? isZenkoCard : isYakoCard;
        return playedCards.filter((card) => filteringFunction(card.id)).reduce(
            (score, card) => score + getKitsuCardValue(card.id), 0
        );
    }
}