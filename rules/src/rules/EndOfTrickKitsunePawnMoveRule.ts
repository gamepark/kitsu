import { MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from "@gamepark/rules-api";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";
import { RuleId } from "./RuleId";
import { getKitsuCardValue, isYakoCard, isZenkoCard } from "../material/KitsuCard";
import { TeamColor } from "../TeamColor";

export class EndOfTrickKitsunePawnMoveRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const playedCards = this.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot).getItems();

        const yakoScore = this.getScore(playedCards, TeamColor.Yako);
        const zenkoScore = this.getScore(playedCards, TeamColor.Zenko);
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

    private getScore(playedCards: MaterialItem<number, LocationType, any>[], team: TeamColor) {
        const filteringFunction = team === TeamColor.Zenko ? isZenkoCard : isYakoCard
        return playedCards.filter((card) => filteringFunction(card.id)).reduce(
            (score, card) => score + getKitsuCardValue(card.id), 0
        );
    }
}