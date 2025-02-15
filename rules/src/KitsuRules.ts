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
import { EndOfTrickDecideEndOfRoundRule } from './rules/EndOfTrickDecideEndOfRoundRule';
import { EndOfTrickDiscardCardsRule } from './rules/EndOfTrickDiscardCardsRule';
import { EndOfTrickKitsunePawnMoveRule } from './rules/EndOfTrickKitsunePawnMoveRule';
import { EndOfTrickMoveLeaderTokenRule } from './rules/EndOfTrickMoveLeaderTokenRule';
import { EndOfTrickPickCardsRule } from './rules/EndOfTrickPickCardsRule';
import { PlayKitsuCardRule } from './rules/PlayKitsuCardRule';
import { RoundEndRule } from './rules/RoundEndRule';
import { RoundSetupDealCardsRule } from './rules/RoundSetupDealCardsRule';
import { RoundSetupMoveKitsunePawnsRule } from './rules/RoundSetupMoveKitsunePawnsRule';
import { RuleId } from './rules/RuleId';
import { SelectKatanaTargetRule } from './rules/SelectKatanaTargetRule';


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
        [RuleId.SelectKatanaTarget]: SelectKatanaTargetRule,
        [RuleId.EndOfTrickKistunePawnMove]: EndOfTrickKitsunePawnMoveRule,
        [RuleId.EndOfTrickDiscardCards]: EndOfTrickDiscardCardsRule,
        [RuleId.EndOfTrickDecideEndOfRound]: EndOfTrickDecideEndOfRoundRule,
        [RuleId.EndOfTrickMoveLeaderToken]: EndOfTrickMoveLeaderTokenRule,
        [RuleId.EndOfTrickPickCards]: EndOfTrickPickCardsRule,
        [RuleId.RoundEnd]: RoundEndRule,
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

    public randomize(move: MaterialMove<number, MaterialType, LocationType>, player?: number): MaterialMove<number, MaterialType, LocationType> & MaterialMoveRandomized<number, MaterialType, LocationType> {
        if (isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move)) {
            return {...move, data: Math.floor(Math.random() * Math.floor(this.players.length / 2))};
        }
        return super.randomize(move, player);
    }

    giveTime(): number {
        return 60;
    }

    public isUnpredictableMove(move: MaterialMove<number, MaterialType, LocationType>, player: number): boolean {
        return super.isUnpredictableMove(move, player) || isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer)(move);
    }


}