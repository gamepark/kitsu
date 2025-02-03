import { MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from "@gamepark/rules-api";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";
import { RuleId } from "./RuleId";
import { TeamColor } from "../TeamColor";

export class EndOfTrickDecideEndOfRoundRule extends PlayerTurnRule<number, MaterialType, LocationType> {
    onRuleStart(_move: RuleMove<number, RuleId>, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove<number, MaterialType, LocationType>[] {
        const yakoPawnLocation = this.pawnLocation(TeamColor.Yako);
        const zenkoPawnLocation = this.pawnLocation(TeamColor.Zenko);

        if (yakoPawnLocation === 13 || zenkoPawnLocation === 13) {
            return [this.startRule(RuleId.RoundEnd)];
        }

        return [this.startRule(RuleId.EndOfTrickMoveLeaderToken)];
    }

    private pawnLocation (team: TeamColor): number {
        return this.material(MaterialType.KitsunePawn).id(team).getItem()!.location.id;
    }
}