import { PlayerTurnRule } from '@gamepark/rules-api'

export class RoundSetupRule extends PlayerTurnRule {
  getPlayerMoves() {
    return []
  }
}