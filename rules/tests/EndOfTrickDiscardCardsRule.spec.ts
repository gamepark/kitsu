import { isMoveItemTypeAtOnce, isStartRule, ItemMoveType, MoveItemsAtOnce, MoveKind, RuleMoveType, Shuffle, StartRule } from '@gamepark/rules-api'
import { KitsuCard, kitsuCardIds } from '../src/material/KitsuCard'
import { LocationType } from '../src/material/LocationType'
import { MaterialType } from '../src/material/MaterialType'
import { PowerToken } from '../src/material/PowerToken'
import { EndOfTrickDiscardCardsRule } from '../src/rules/EndOfTrickDiscardCardsRule'
import { RuleId } from '../src/rules/RuleId'
import {
  create2PlayersGameBuilderWithPlayedCards,
  create2PlayersGameState,
  create2PlayersGameStateWithDiscardedCards,
  create2PlayersGameStateWithDiscardedCardsAndCardsInPlayersHands,
  create2PlayersGameStateWithPlayedCards,
} from './utils/MaterialGameTestUtils'

describe('End of trick - Discard cards rule ', () => {
  describe('2 players tests', () => {
    test.each([
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko1_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko2_2] },
        ],
        expectedIndexes: [15, 9, 3, 13],
      },
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako1_1, KitsuCard.Yako5],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1] },
        ],
        expectedIndexes: [0, 7, 17, 12],
      },
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko6] },
        ],
        expectedIndexes: [5, 6, 16, 17],
      },
    ])(
      'onRuleStart() should return an array of moves, the first of which is a move of all trick cards at once' + ' to the discard',
      ({ cards, expectedIndexes }) => {
        // Given
        const game = create2PlayersGameStateWithPlayedCards(cards)
        const rule = new EndOfTrickDiscardCardsRule(game)
        const previousRuleMove: StartRule = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartRule,
          id: RuleId.EndOfTrickDiscardCards,
        }

        // When
        const moves = rule.onRuleStart(previousRuleMove)
        const kistuCardMoves = moves.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard))

        // Then
        expect(kistuCardMoves).toHaveLength(1)
        expect(moves[0]).toBe(kistuCardMoves[0])
        expect(kistuCardMoves[0].location.type).toBe(LocationType.KitsuCardDiscardSpotOnWisdomBoard)
        expect(kistuCardMoves[0].indexes).toHaveLength(4)
        expect(kistuCardMoves[0].indexes).toEqual(expect.arrayContaining(expectedIndexes))
      },
    )

    test('onRuleStart() should return an array of moves, the second and last of which is a rule move to start the EndOfTrickDecideEndOfRoundRule', () => {
      // Given
      const cards = [
        {
          player: 1 as 1 | 2,
          playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako5],
        },
        {
          player: 2 as 1 | 2,
          playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko3_1],
        },
      ]
      const game = create2PlayersGameStateWithPlayedCards(cards)
      const rule = new EndOfTrickDiscardCardsRule(game)
      const previousRuleMove: StartRule = {
        kind: MoveKind.RulesMove,
        type: RuleMoveType.StartRule,
        id: RuleId.EndOfTrickDiscardCards,
      }

      // When
      const moves = rule.onRuleStart(previousRuleMove)
      const ruleMoves = moves.filter(isStartRule<number, MaterialType, LocationType>)

      // Then
      expect(moves).toHaveLength(2)
      expect(ruleMoves).toHaveLength(1)
      expect(moves[1]).toBe(ruleMoves[0])
      expect(ruleMoves[0].id).toBe(RuleId.EndOfTrickDecideEndOfRound)
    })

    test.each([
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko1_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko2_2] },
        ],
        playedPowerTokens: [{ player: 1 as 1 | 2, powerToken: PowerToken.ColourExchange, parentIndex: 9 }],
        expectedCardIndexes: [15, 9, 3, 13],
        expectedTokenIndexes: [0],
      },
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako1_1, KitsuCard.Yako5],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1] },
        ],
        playedPowerTokens: [{ player: 2 as 1 | 2, powerToken: PowerToken.NoAdvance, parentIndex: 12 }],
        expectedCardIndexes: [0, 7, 17, 12],
        expectedTokenIndexes: [1],
      },
      {
        cards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko6] },
        ],
        playedPowerTokens: [
          { player: 1 as 1 | 2, powerToken: PowerToken.Protection, parentIndex: 5 },
          { player: 2 as 1 | 2, powerToken: PowerToken.PickDiscarded, parentIndex: 17 },
        ],
        expectedCardIndexes: [5, 6, 16, 17],
        expectedTokenIndexes: [4, 2],
      },
    ])(
      'Given played power tokens, onRuleStart() should return an array containing 3 moves, one for the cards, one' +
        ' for the power tokens, and one for the rule',
      ({ cards, playedPowerTokens, expectedCardIndexes, expectedTokenIndexes }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(cards)
        gameBuilder.setRule(RuleId.EndOfTrickDiscardCards, 1)
        playedPowerTokens.forEach(({ powerToken, parentIndex }) =>
          gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(powerToken).moveItem({
            type: LocationType.PowerTokenSpotOnKitsuCard,
            parent: parentIndex,
          }),
        )
        const game = gameBuilder.build()
        const rule = new EndOfTrickDiscardCardsRule(game)
        const previousRuleMove: StartRule = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartRule,
          id: RuleId.EndOfTrickDiscardCards,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kitsuCardMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard))
        const powerTokenMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.PowerToken))
        const ruleMoves = consequences.filter(isStartRule<number, MaterialType, LocationType>)

        // Then
        expect(consequences).toHaveLength(3)
        expect(kitsuCardMoves).toHaveLength(1)
        expect(kitsuCardMoves[0]).toBe(consequences[0])
        expect(powerTokenMoves).toHaveLength(1)
        expect(powerTokenMoves[0]).toBe(consequences[1])
        expect(ruleMoves).toHaveLength(1)
        expect(ruleMoves[0]).toBe(consequences[2])
        expect(kitsuCardMoves[0].indexes).toEqual(expect.arrayContaining(expectedCardIndexes))
        expect(powerTokenMoves[0].indexes).toEqual(expect.arrayContaining(expectedTokenIndexes))
        expect(powerTokenMoves[0].location.type).toBe(LocationType.DiscardedPowerTokenAreaOnWisdomBoard)
      },
    )

    test(
      'given a KitsuCard move to the discard and empty player hands, afterItemMove() should return an array of' +
        ' moves, the first of which is a move at once of the discard to the deck',
      () => {
        // Given
        const game = create2PlayersGameStateWithDiscardedCards(kitsuCardIds)
        const rule = new EndOfTrickDiscardCardsRule(game)
        const previousMove: MoveItemsAtOnce<number, MaterialType, LocationType> = {
          type: ItemMoveType.MoveAtOnce,
          kind: MoveKind.ItemMove,
          itemType: MaterialType.KitsuCard,
          indexes: [],
          location: {
            type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
          },
        }

        // When
        const consequences = rule.afterItemMove(previousMove)
        const kitsuCardMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard))

        // Then
        expect(consequences).toHaveLength(1)
        expect(kitsuCardMoves).toHaveLength(1)
        expect(consequences[0]).toBe(kitsuCardMoves[0])
        expect(kitsuCardMoves[0].location.type).toBe(LocationType.KitsuCardDeckSpotOnWisdomBoard)
        expect(kitsuCardMoves[0].indexes).toHaveLength(24)
      },
    )

    test('given a KitsuCard move to the discard and players still having cards in their hands, afterItemMove() ' + 'should return an empty array', () => {
      // Given
      const game = create2PlayersGameStateWithDiscardedCardsAndCardsInPlayersHands(
        [KitsuCard.Zenko3_1, KitsuCard.Yako2_1, KitsuCard.Zenko4, KitsuCard.Yako6],
        [
          {
            player: 1 as 1 | 2,
            cardIds: [KitsuCard.Zenko4],
          },
          {
            player: 2 as 1 | 2,
            cardIds: [KitsuCard.Yako5],
          },
        ],
      )
      const rule = new EndOfTrickDiscardCardsRule(game)
      const previousMove: MoveItemsAtOnce<number, MaterialType, LocationType> = {
        type: ItemMoveType.MoveAtOnce,
        kind: MoveKind.ItemMove,
        itemType: MaterialType.KitsuCard,
        indexes: [],
        location: {
          type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
        },
      }

      // When
      const consequences = rule.afterItemMove(previousMove)

      // Then
      expect(consequences).toHaveLength(0)
    })

    test('given an unexpected move, afterItemMove() should return an empty array', () => {
      // Given
      const game = create2PlayersGameState()
      const rule = new EndOfTrickDiscardCardsRule(game)
      const previousMove: Shuffle<MaterialType> = {
        type: ItemMoveType.Shuffle,
        kind: MoveKind.ItemMove,
        itemType: MaterialType.KitsuCard,
        indexes: Array(24)
          .fill(0)
          .map((_, i) => i),
      }

      // When
      const consequences = rule.afterItemMove(previousMove)

      // Then
      expect(consequences).toHaveLength(0)
    })
  })
})
