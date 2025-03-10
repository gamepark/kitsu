import { isMoveItemType, isStartPlayerTurn, MoveKind, RuleMoveType, StartPlayerTurn } from '@gamepark/rules-api'
import { KitsuCard } from '../src/material/KitsuCard'
import { LocationType } from '../src/material/LocationType'
import { MaterialType } from '../src/material/MaterialType'
import { EndOfTrickPickCardsRule } from '../src/rules/EndOfTrickPickCardsRule'
import { RuleId } from '../src/rules/RuleId'
import { create2PlayersGameBuilder, create2PlayersGameStateWithDiscardedCards } from './utils/MaterialGameTestUtils'

describe('End of trick - Pick cards', () => {
  describe('2-players tests', () => {
    test.each([
      { discardedCards: [KitsuCard.Zenko4, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5] },
      {
        discardedCards: [
          KitsuCard.Zenko4,
          KitsuCard.Yako6,
          KitsuCard.Yako3_1,
          KitsuCard.Zenko5,
          KitsuCard.Yako3_2,
          KitsuCard.Zenko1_2,
          KitsuCard.Yako1_2,
          KitsuCard.Zenko2_2,
        ],
      },
      {
        discardedCards: [
          KitsuCard.Zenko4,
          KitsuCard.Yako6,
          KitsuCard.Yako3_1,
          KitsuCard.Zenko5,
          KitsuCard.Yako3_2,
          KitsuCard.Zenko1_2,
          KitsuCard.Yako1_2,
          KitsuCard.Zenko2_2,
          KitsuCard.Zenko1_1,
          KitsuCard.Zenko1_3,
          KitsuCard.Yako4,
          KitsuCard.Zenko2_1,
        ],
      },
    ])(
      'Given a deck with cards in it, onRuleStart() should return an array of consequences consisting of moves ' +
        'dealing two cards to each player and a rule move starting the PlayKitsuCardRule for the next leader',
      ({ discardedCards }) => {
        // Given
        const game = create2PlayersGameStateWithDiscardedCards(discardedCards)
        const rule = new EndOfTrickPickCardsRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          player: 1,
          id: RuleId.EndOfTrickPickCards,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const dealCardMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>)

        // Then
        expect(consequences).toHaveLength(5)
        expect(dealCardMoves).toHaveLength(4)
        expect(ruleMoves).toHaveLength(1)
        expect(consequences[4]).toBe(ruleMoves[0])
      },
    )

    test(
      'Given an empty deck, onRuleStart() should return an array of consequences consisting of a single rule ' +
        'move starting the PlayKitsuCardRule for the next leader',
      () => {
        // Given
        const gameBuilder = create2PlayersGameBuilder()
        gameBuilder.material(MaterialType.KitsuCard).moveItemsAtOnce({ type: LocationType.KitsuCardDiscardSpotOnWisdomBoard })
        const game = gameBuilder.build()
        const rule = new EndOfTrickPickCardsRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          player: 1,
          id: RuleId.EndOfTrickPickCards,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>)

        // Then
        expect(consequences).toHaveLength(1)
        expect(ruleMoves).toHaveLength(1)
        expect(consequences[0]).toBe(ruleMoves[0])
      },
    )
  })
})
