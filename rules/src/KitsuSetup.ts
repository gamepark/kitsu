import { MaterialGameSetup } from '@gamepark/rules-api'
import { KitsuOptions } from './KitsuOptions'
import { KitsuRules } from './KitsuRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class KitsuSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, KitsuOptions> {
  Rules = KitsuRules

  setupMaterial(_options: KitsuOptions) {
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}