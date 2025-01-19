import {
  hideItemId, hideItemIdToOthers,
  //HiddenMaterialRules,
  MaterialGame,
  MaterialMove,
  //MaterialRules,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { TheFirstStepRule } from './rules/TheFirstStepRule'
import { RuleId } from './rules/RuleId'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class KitsuRules extends SecretMaterialRules
  implements TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number> {
  rules = {
    [RuleId.TheFirstStep]: TheFirstStepRule
  }

  locationsStrategies = {
    [MaterialType.KitsunePawn]: {
      [LocationType.KitsunePawnSpotOnWisdomBoard]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.KitsuCard]: {
      [LocationType.KitsuCardDeckSpotOnWisdomBoard]: hideItemId,
      [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: hideItemId,
      [LocationType.PlayerHand]: hideItemIdToOthers
    }
  }

  giveTime(): number {
    return 60
  }
}