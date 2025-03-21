import {
  isMoveItemType,
  isSelectItemType,
  isStartPlayerTurn,
  isStartRule,
  ItemMoveType,
  MoveItem,
  MoveKind,
  RuleMoveType,
  StartPlayerTurn,
} from '@gamepark/rules-api'
import { KitsuCard } from '../src/material/KitsuCard'
import { LocationType } from '../src/material/LocationType'
import { MaterialType } from '../src/material/MaterialType'
import { PowerToken } from '../src/material/PowerToken'
import { PlayKitsuCardRule } from '../src/rules/PlayKitsuCardRule'
import { RuleId } from '../src/rules/RuleId'
import {
  create2PlayersGameBuilder,
  create2PlayersGameBuilderWithCardsInPlayerHand,
  create2PlayersGameBuilderWithPlayedCards,
  create2PlayersGameState,
} from './utils/MaterialGameTestUtils'

describe('PlayKitsuCardRule tests', () => {
  describe('2 players tests', () => {
    test.each([
      {
        givenCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1],
        expectedCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1],
        expectedNumberOfMoves: 6,
      },
      {
        givenCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1],
        expectedCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1],
        expectedNumberOfMoves: 5,
      },
      {
        givenCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko6, KitsuCard.Zenko4, KitsuCard.Katana_2],
        expectedCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko6, KitsuCard.Zenko4, KitsuCard.Katana_2],
        expectedNumberOfMoves: 4,
      },
      {
        givenCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Zenko1_1, KitsuCard.Yako3_1],
        expectedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Zenko1_1, KitsuCard.Yako3_1],
        expectedNumberOfMoves: 3,
      },
      {
        givenCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1],
        expectedCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1],
        expectedNumberOfMoves: 2,
      },
      {
        givenCardIds: [KitsuCard.BlackKitsune_1],
        expectedCardIds: [KitsuCard.BlackKitsune_1],
        expectedNumberOfMoves: 1,
      },
    ])(
      "getPlayerMoves() should return an array with a move for each card in the player's hand to the corresponding PlayerCard location",
      ({ givenCardIds, expectedCardIds, expectedNumberOfMoves }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithCardsInPlayerHand(1, givenCardIds)
        gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
        const game = gameBuilder.build()
        const rule = new PlayKitsuCardRule(game)

        // When
        const moves = rule.getPlayerMoves()

        // Then
        expect(moves).toHaveLength(expectedNumberOfMoves)
        expect(moves.every((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))).toBe(true)
        expect(moves.every((move) => (move as MoveItem<number, MaterialType, LocationType>).location.type === LocationType.PlayedKitsuCardSpot)).toBe(true)
        expect(moves.every((move) => (move as MoveItem<number, MaterialType, LocationType>).location.player === 1)).toBe(true)
        expect(moves.map((move) => game.items[MaterialType.KitsuCard]![(move as MoveItem<number, MaterialType, LocationType>).itemIndex].id)).toEqual(
          expect.arrayContaining(expectedCardIds),
        )
      },
    )

    test.each([
      {
        alreadyPlayedCards: [
          { player: 1 as 1 | 2, playedCardIds: [KitsuCard.Yako1_1] as KitsuCard[] },
          {
            player: 2 as 1 | 2,
            playedCardIds: [] as KitsuCard[],
          },
        ],
        move: {
          kind: MoveKind.ItemMove,
          type: ItemMoveType.Move,
          itemType: MaterialType.KitsuCard,
          itemIndex: 0,
          location: { type: LocationType.PlayedKitsuCardSpot, player: 1 },
        } as MoveItem<number, MaterialType, LocationType>,
        expectedConsequence: {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.PlayKitsuCard,
          player: 2,
        } as StartPlayerTurn<number, RuleId>,
      },
      {
        alreadyPlayedCards: [
          { player: 1 as 1 | 2, playedCardIds: [KitsuCard.Yako1_1] as KitsuCard[] },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.Yako4] as KitsuCard[],
          },
        ],
        move: {
          kind: MoveKind.ItemMove,
          type: ItemMoveType.Move,
          itemType: MaterialType.KitsuCard,
          itemIndex: 7,
          location: { type: LocationType.PlayedKitsuCardSpot, player: 2 },
        } as MoveItem<number, MaterialType, LocationType>,
        expectedConsequence: {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.PlayKitsuCard,
          player: 1,
        } as StartPlayerTurn<number, RuleId>,
      },
      {
        alreadyPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko6] as KitsuCard[],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako5] as KitsuCard[] },
        ],
        move: {
          kind: MoveKind.ItemMove,
          type: ItemMoveType.Move,
          itemType: MaterialType.KitsuCard,
          itemIndex: 18,
          location: { type: LocationType.PlayedKitsuCardSpot, player: 1 },
        } as MoveItem<number, MaterialType, LocationType>,
        expectedConsequence: {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.PlayKitsuCard,
          player: 2,
        } as StartPlayerTurn<number, RuleId>,
      },
    ])(
      'Given 1, 2 or 3 cards already played, afterItemMove() should return consequence containing only a rule ' + 'move for the next player',
      ({ alreadyPlayedCards, move, expectedConsequence }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(alreadyPlayedCards)
        gameBuilder.setRule(RuleId.PlayKitsuCard, move.location.player)
        const game = gameBuilder.build()
        const rule = new PlayKitsuCardRule(game)

        // When
        const consequences = rule.afterItemMove(move)

        // Then
        expect(consequences).toHaveLength(1)
        expect(consequences[0]).toEqual(expectedConsequence)
      },
    )

    test('Given 4 cards already played, afterItemMove() should return consequences containing only a rule move for the end of trick rule', () => {
      // Given
      const gameBuilder = create2PlayersGameBuilderWithPlayedCards([
        {
          player: 1,
          playedCardIds: [KitsuCard.Yako5, KitsuCard.Yako1_1] as KitsuCard[],
        },
        { player: 2, playedCardIds: [KitsuCard.Zenko4, KitsuCard.Yako2_1] as KitsuCard[] },
      ])
      gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
      const game = gameBuilder.build()
      const rule = new PlayKitsuCardRule(game)
      const itemMove: MoveItem<number, MaterialType, LocationType> = {
        kind: MoveKind.ItemMove,
        type: ItemMoveType.Move,
        itemType: MaterialType.KitsuCard,
        itemIndex: 0,
        location: { type: LocationType.PlayedKitsuCardSpot, player: 1 },
      }

      // When
      const consequences = rule.afterItemMove(itemMove)

      // Then
      expect(consequences).toHaveLength(1)
      expect(consequences[0]).toEqual({
        kind: MoveKind.RulesMove,
        type: RuleMoveType.StartPlayerTurn,
        id: RuleId.EndOfTrickKistunePawnMove,
        player: 2,
      })
    })

    test('Given a move indicating a Katana card was just played, afterItemMove() should return an array of moves with a single rule move to the SelectKatanaTarget rule', () => {
      // Given
      const gameBuilder = create2PlayersGameBuilder()
      gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
      const katanaCard = gameBuilder.material(MaterialType.KitsuCard).id<KitsuCard>(KitsuCard.Katana_2)
      katanaCard.moveItem({
        type: LocationType.PlayedKitsuCardSpot,
        player: 1,
      })
      const game = gameBuilder.build()
      const rule = new PlayKitsuCardRule(game)
      const katanaMove: MoveItem<number, MaterialType, LocationType> = {
        kind: MoveKind.ItemMove,
        type: ItemMoveType.Move,
        itemIndex: katanaCard.getIndex(),
        itemType: MaterialType.KitsuCard,
        location: {
          type: LocationType.PlayedKitsuCardSpot,
          player: 1,
        },
      }

      // When
      const consequences = rule.afterItemMove(katanaMove)
      const ruleMoves = consequences.filter(isStartRule<number, MaterialType, LocationType>)

      // Then
      expect(consequences).toHaveLength(1)
      expect(ruleMoves).toHaveLength(1)
      expect(ruleMoves[0]).toBe(consequences[0])
      expect(ruleMoves[0].id).toBe(RuleId.SelectKatanaTarget)
    })

    test('given an invalid move, afterItemMove() should return an empty array', () => {
      // Given
      const game = create2PlayersGameState()
      const rule = new PlayKitsuCardRule(game)
      const invalidMove: MoveItem<number, MaterialType, LocationType> = {
        kind: MoveKind.ItemMove,
        type: ItemMoveType.Move,
        itemIndex: 0,
        itemType: MaterialType.KitsuCard,
        location: { type: LocationType.PlayerHand, player: 2 },
      }

      // When
      const consequences = rule.afterItemMove(invalidMove)

      // Then
      expect(consequences).toHaveLength(0)
    })

    describe('Black kitsune tests', () => {
      test.each([
        {
          givenActivePlayer: 1,
          givenActivePlayerHand: [KitsuCard.Zenko2_2, KitsuCard.Yako2_1, KitsuCard.Yako3_1],
          expectedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako3_1],
        },
        {
          givenActivePlayer: 2,
          givenActivePlayerHand: [KitsuCard.Zenko4, KitsuCard.Yako1_1, KitsuCard.Yako6],
          expectedCardIds: [KitsuCard.Zenko4],
        },
        {
          givenActivePlayer: 1,
          givenActivePlayerHand: [KitsuCard.Zenko1_2, KitsuCard.Yako4, KitsuCard.Zenko2_2, KitsuCard.Katana_2, KitsuCard.WhiteKitsune_1],
          expectedCardIds: [KitsuCard.Yako4],
        },
        {
          givenActivePlayer: 2,
          givenActivePlayerHand: [KitsuCard.Zenko6, KitsuCard.Yako3_1, KitsuCard.Yako1_1, KitsuCard.Zenko1_2, KitsuCard.BlackKitsune_2],
          expectedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko1_2],
        },
      ])(
        'given the previous player played a black kitsune card, getPlayerMoves() should only be return cards of ' + "the previous player's color",
        ({ givenActivePlayer, givenActivePlayerHand, expectedCardIds }) => {
          // Given
          const gameBuilder = create2PlayersGameBuilderWithCardsInPlayerHand(givenActivePlayer as 1 | 2, givenActivePlayerHand)
          gameBuilder
            .material(MaterialType.KitsuCard)
            .id(KitsuCard.BlackKitsune_1)
            .moveItem({
              type: LocationType.PlayedKitsuCardSpot,
              player: givenActivePlayer === 1 ? 2 : 1,
              x: 0,
            })
          gameBuilder.setRule(RuleId.PlayKitsuCard, givenActivePlayer)
          const game = gameBuilder.build()
          const rule = new PlayKitsuCardRule(game)

          // When
          const allowedMoves = rule.getPlayerMoves()
          const playableCardIds = allowedMoves
            .filter((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))
            .map((move) => {
              const cardIndex = (move as MoveItem<number, MaterialType, LocationType>).itemIndex
              return game.items[MaterialType.KitsuCard]![cardIndex].id as KitsuCard
            })

          // Then
          expect(allowedMoves).toHaveLength(expectedCardIds.length)
          expect(playableCardIds).toHaveLength(expectedCardIds.length)
          expect(playableCardIds).toEqual(expect.arrayContaining(expectedCardIds))
        },
      )

      test.each([
        {
          givenActivePlayer: 1,
          givenActivePlayerHand: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2, KitsuCard.BlackKitsune_2],
          expectedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2, KitsuCard.BlackKitsune_2],
        },
        {
          givenActivePlayer: 2,
          givenActivePlayerHand: [KitsuCard.Yako1_1, KitsuCard.Yako6],
          expectedCardIds: [KitsuCard.Yako1_1, KitsuCard.Yako6],
        },
        {
          givenActivePlayer: 1,
          givenActivePlayerHand: [KitsuCard.Zenko1_2, KitsuCard.Zenko2_2, KitsuCard.Katana_2, KitsuCard.WhiteKitsune_1],
          expectedCardIds: [KitsuCard.Zenko1_2, KitsuCard.Zenko2_2, KitsuCard.Katana_2, KitsuCard.WhiteKitsune_1],
        },
        {
          givenActivePlayer: 2,
          givenActivePlayerHand: [KitsuCard.Yako3_1, KitsuCard.Yako1_1, KitsuCard.BlackKitsune_2],
          expectedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako1_1, KitsuCard.BlackKitsune_2],
        },
      ])(
        'Given the previous player played a back kitsune card and no cards of their color in the active player ' +
          'hand, getPlayerMoves() should return other normally available cards',
        ({ givenActivePlayer, givenActivePlayerHand, expectedCardIds }) => {
          // Given
          const gameBuilder = create2PlayersGameBuilderWithCardsInPlayerHand(givenActivePlayer as 1 | 2, givenActivePlayerHand)
          gameBuilder.setRule(RuleId.PlayKitsuCard, givenActivePlayer)
          const game = gameBuilder.build()
          const rule = new PlayKitsuCardRule(game)

          // When
          const allowedMoves = rule.getPlayerMoves()
          const playableCardIds = allowedMoves
            .filter((move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))
            .map((move) => {
              const cardIndex = (move as MoveItem<number, MaterialType, LocationType>).itemIndex
              return game.items[MaterialType.KitsuCard]![cardIndex].id as KitsuCard
            })

          // Then
          expect(allowedMoves).toHaveLength(expectedCardIds.length)
          expect(playableCardIds).toHaveLength(expectedCardIds.length)
          expect(playableCardIds).toEqual(expect.arrayContaining(expectedCardIds))
        },
      )
    })

    describe('Power token tests', () => {
      test.each([
        {
          givenCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1],
          givenPowerToken: PowerToken.PickDiscarded,
          expectedCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1],
          expectedNumberOfMoves: 12,
        },
        {
          givenCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1],
          givenPowerToken: PowerToken.NoAdvance,
          expectedCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1],
          expectedNumberOfMoves: 10,
        },
        {
          givenCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1],
          givenPowerToken: PowerToken.ColourExchange,
          expectedCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1],
          expectedNumberOfMoves: 4,
        },
        {
          givenCardIds: [KitsuCard.BlackKitsune_1],
          givenPowerToken: PowerToken.PickDiscarded,
          expectedCardIds: [KitsuCard.BlackKitsune_1],
          expectedNumberOfMoves: 2,
        },
      ])(
        'Given the player has an unselected power token, getPlayerMoves() should return an array for each card in the' +
          " player's hand to the corresponding PlayerCard location, as well as a move of the power token to the" +
          ' card',
        ({ givenCardIds, givenPowerToken, expectedCardIds, expectedNumberOfMoves }) => {
          // Given
          const gameBuilder = create2PlayersGameBuilderWithCardsInPlayerHand(1, givenCardIds)
          gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(givenPowerToken).moveItem({
            type: LocationType.PowerTokenSpotOnClanCard,
            player: 1,
          })
          gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
          const game = gameBuilder.build()
          const rule = new PlayKitsuCardRule(game)

          // When
          const legalMoves = rule.getPlayerMoves()
          const cardMoves = legalMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
          const cardIdsInMoves = cardMoves.map((move) => game.items[MaterialType.KitsuCard]![move.itemIndex].id as KitsuCard)
          const tokenMoves = legalMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
          const tokenTargetCardIds = tokenMoves.map((move) => game.items[MaterialType.KitsuCard]![move.location.parent!].id as KitsuCard)

          // Then
          expect(legalMoves).toHaveLength(expectedNumberOfMoves)
          expect(cardMoves).toHaveLength(Math.floor(expectedNumberOfMoves / 2))
          expect(tokenMoves).toHaveLength(Math.floor(expectedNumberOfMoves / 2))
          expect(tokenMoves.every((move) => move.location.type === LocationType.PowerTokenSpotOnKitsuCard)).toBe(true)
          expect(cardIdsInMoves).toHaveLength(Math.floor(expectedNumberOfMoves / 2))
          expect(cardIdsInMoves).toEqual(expect.arrayContaining(expectedCardIds))
          expect(tokenTargetCardIds).toHaveLength(Math.floor(expectedNumberOfMoves / 2))
          expect(tokenTargetCardIds).toEqual(expect.arrayContaining(expectedCardIds))
        },
      )

      test(
        'Given 4 cards already played and a seelcted power token, afterItemMove() should return consequences' +
          ' containing a move to unselect the power token, a rule to ove the power token to the relevant location' +
          ' and a rule move for the end of trick rule',
        () => {
          // Given
          const gameBuilder = create2PlayersGameBuilderWithPlayedCards([
            {
              player: 1,
              playedCardIds: [KitsuCard.Yako5, KitsuCard.Yako1_1] as KitsuCard[],
            },
            { player: 2, playedCardIds: [KitsuCard.Zenko4, KitsuCard.Yako2_1] as KitsuCard[] },
          ])
          gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
          const token = gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.Plus3)
          token.moveItem({
            type: LocationType.PowerTokenSpotOnClanCard,
            player: 1,
          })
          token.selectItem()
          const game = gameBuilder.build()
          const rule = new PlayKitsuCardRule(game)
          const itemMove: MoveItem<number, MaterialType, LocationType> = {
            kind: MoveKind.ItemMove,
            type: ItemMoveType.Move,
            itemType: MaterialType.KitsuCard,
            itemIndex: 0,
            location: { type: LocationType.PlayedKitsuCardSpot, player: 1 },
          }

          // When
          const consequences = rule.afterItemMove(itemMove)
          const selectMoves = consequences.filter(isSelectItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
          const moveTokenMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))

          // Then
          expect(consequences).toHaveLength(1)
          expect(selectMoves).toHaveLength(0)
          expect(moveTokenMoves).toHaveLength(0)
          expect(consequences[0]).toEqual({
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartPlayerTurn,
            id: RuleId.EndOfTrickKistunePawnMove,
            player: 2,
          })
        },
      )

      describe('Protection token tests - ', () => {
        test.each([
          {
            givenCardsInHand: [KitsuCard.Zenko6, KitsuCard.Yako6, KitsuCard.WhiteKitsune_1, KitsuCard.Zenko1_1],
            expectLegalMovesNumber: 8,
            expectedTokenMovesNumber: 4,
            expectedTokenMoveCardIds: [KitsuCard.Zenko6, KitsuCard.Yako6, KitsuCard.WhiteKitsune_1, KitsuCard.Zenko1_1],
          },
          {
            givenCardsInHand: [KitsuCard.Zenko6, KitsuCard.Yako6, KitsuCard.WhiteKitsune_1, KitsuCard.BlackKitsune_1],
            expectLegalMovesNumber: 7,
            expectedTokenMovesNumber: 3,
            expectedTokenMoveCardIds: [KitsuCard.Zenko6, KitsuCard.Yako6, KitsuCard.WhiteKitsune_1],
          },
          {
            givenCardsInHand: [KitsuCard.Zenko6, KitsuCard.Katana_1, KitsuCard.WhiteKitsune_1, KitsuCard.BlackKitsune_1],
            expectLegalMovesNumber: 6,
            expectedTokenMovesNumber: 2,
            expectedTokenMoveCardIds: [KitsuCard.Zenko6, KitsuCard.WhiteKitsune_1],
          },
        ])(
          'Given a protection token and cards in hand, getPlayerMoves() should return a move to play each card,' +
            ' moves to play the token on the card, and moves to play relevant cards face down',
          ({ givenCardsInHand, expectLegalMovesNumber, expectedTokenMovesNumber, expectedTokenMoveCardIds }) => {
            // Given
            const gameBuilder = create2PlayersGameBuilderWithCardsInPlayerHand(1, givenCardsInHand)
            gameBuilder.material(MaterialType.PowerToken).id(PowerToken.Protection).moveItem({
              type: LocationType.PowerTokenSpotOnClanCard,
              player: 1,
            })
            gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
            const game = gameBuilder.build()
            const rule = new PlayKitsuCardRule(game)

            // When
            const legalMoves = rule.getPlayerMoves()
            const tokenMoves = legalMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
            const tokenMovesCardIds = tokenMoves.map((move) => game.items[MaterialType.KitsuCard]![move.location.parent!].id as KitsuCard)

            // Then
            expect(legalMoves).toHaveLength(expectLegalMovesNumber)
            expect(tokenMovesCardIds).toHaveLength(expectedTokenMovesNumber)
            expect(tokenMovesCardIds).toEqual(expect.arrayContaining(expectedTokenMoveCardIds))
            expect([...new Set(tokenMovesCardIds)]).toHaveLength(expectedTokenMovesNumber)
          },
        )
      })
    })
  })

  describe('non-regression tests:', () => {
    test("Bug #32: Numeral 3 card shouldn't trigger a start SelectKatanaTarget rule", () => {
      // Given
      const gameBuilder = create2PlayersGameBuilderWithPlayedCards([
        {
          player: 1 as 1 | 2,
          playedCardIds: [KitsuCard.Zenko3_1],
        },
      ])
      const zenko3Index = gameBuilder.material(MaterialType.KitsuCard).id<KitsuCard>(KitsuCard.Zenko3_1).getIndex()
      gameBuilder.setRule(RuleId.PlayKitsuCard, 1)
      const game = gameBuilder.build()
      const rule = new PlayKitsuCardRule(game)
      const numeral3Move: MoveItem<number, MaterialType, LocationType> = {
        kind: MoveKind.ItemMove,
        type: ItemMoveType.Move,
        itemIndex: zenko3Index,
        itemType: MaterialType.KitsuCard,
        location: {
          type: LocationType.PlayedKitsuCardSpot,
          player: 1,
        },
      }

      // When
      const consequences = rule.afterItemMove(numeral3Move)
      const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>)

      // Then
      expect(ruleMoves).toHaveLength(1)
      expect(ruleMoves[0].id).toEqual(RuleId.PlayKitsuCard)
      expect(ruleMoves[0].player).toEqual(2)
    })
  })
})
