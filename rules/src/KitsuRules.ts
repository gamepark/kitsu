import {
    hideItemId,
    hideItemIdToOthers,
    isCustomMoveType,
    MaterialGame,
    MaterialMove,
    MaterialMoveRandomized,
    PositiveSequenceStrategy,
    SecretMaterialRules,
    TimeLimit
} from '@gamepark/rules-api';
import { CustomMoveType } from './material/CustomMoveType';
import { hideToTOthersWhenRotatedFaceDown } from './material/HideToTOthersWhenRotatedFaceDown';
import { LocationType } from './material/LocationType';
import { MaterialType } from './material/MaterialType';
import { PlayKitsuCardRule } from './rules/PlayKitsuCardRule';
import { RoundSetupDealCardsRule } from './rules/RoundSetupDealCardsRule';
import { RoundSetupMoveKitsunePawnsRule } from './rules/RoundSetupMoveKitsunePawnsRule';
import { RuleId } from './rules/RuleId';


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class KitsuRules extends SecretMaterialRules<number, MaterialType, LocationType>
    implements TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number> {
    rules = {
        [RuleId.RoundSetupMoveKitsunePawns]: RoundSetupMoveKitsunePawnsRule,
        [RuleId.RoundSetupDealCards]: RoundSetupDealCardsRule,
        [RuleId.PlayKitsuCard]: PlayKitsuCardRule,
    };

    locationsStrategies = {
        [MaterialType.KitsunePawn]: {
            [LocationType.KitsunePawnSpotOnWisdomBoard]: new PositiveSequenceStrategy(),
        },
        [MaterialType.KitsuCard]: {
            [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
            [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: new PositiveSequenceStrategy(),
            [LocationType.PlayedKitsuCardSpot]: new PositiveSequenceStrategy(),
        },
        [MaterialType.PowerToken]: {
            [LocationType.DiscardedPowerTokenAreaOnWisdomBoard]: new PositiveSequenceStrategy(),
        },
        [MaterialType.VictoryCard]: {
            [LocationType.VictoryCardsSpot]: new PositiveSequenceStrategy(),
        }
    };

    hidingStrategies = {
        [MaterialType.KitsuCard]: {
            [LocationType.KitsuCardDeckSpotOnWisdomBoard]: hideItemId,
            [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: hideItemId,
            [LocationType.PlayerHand]: hideItemIdToOthers,
            [LocationType.PlayedKitsuCardSpot]: hideToTOthersWhenRotatedFaceDown,
        }
    };

    giveTime(): number {
        return 60;
    }

    public isUnpredictableMove(move: MaterialMove<number, MaterialType, LocationType>, player: number): boolean {
        return super.isUnpredictableMove(move, player) || isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move);
    }

    public randomize(move: MaterialMove<number, MaterialType, LocationType>, player?: number): MaterialMove<number, MaterialType, LocationType> & MaterialMoveRandomized<number, MaterialType, LocationType> {
        if (isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move)) {
            return {...move, data: Math.floor(Math.random() * Math.floor(this.players.length / 2))};
        }
        return super.randomize(move, player);
    }
}