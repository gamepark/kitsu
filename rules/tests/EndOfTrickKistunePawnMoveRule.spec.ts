import { isMoveItemType, isStartPlayerTurn, isStartRule, MoveKind, RuleMoveType, StartPlayerTurn, StartRule } from '@gamepark/rules-api'
import { KitsuCard, kitsuCardIds } from '../src/material/KitsuCard'
import { KitsuCardRotation } from '../src/material/KitsuCardRotation'
import { KitsunePawn } from '../src/material/KitsunePawn'
import { LocationType } from '../src/material/LocationType'
import { MaterialType } from '../src/material/MaterialType'
import { PowerToken } from '../src/material/PowerToken'
import { EndOfTrickKitsunePawnMoveRule } from '../src/rules/EndOfTrickKitsunePawnMoveRule'
import { RuleId } from '../src/rules/RuleId'
import { TeamColor, teamColors } from '../src/TeamColor'
import { create2PlayersGameBuilderWithPlayedCards, create2PlayersGameStateWithPlayedCards } from './utils/MaterialGameTestUtils'

describe('End of trick - kitsune pawn move rule', () => {
  describe('2 players tests', () => {
    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako3_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 0, [TeamColor.Yako]: 0 },
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 3,
        expectedKitsunePawnReachedSpot: 3,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko6, KitsuCard.Yako2_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 2, [TeamColor.Yako]: 5 },
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 3,
        expectedKitsunePawnReachedSpot: 8,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko2_2],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako1_3] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 10, [TeamColor.Yako]: 11 },
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 3,
        expectedKitsunePawnReachedSpot: 13,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako5, KitsuCard.Yako6],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako2_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 10, [TeamColor.Yako]: 5 },
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 8,
        expectedKitsunePawnReachedSpot: 13,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko3_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako6, KitsuCard.Zenko5] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 12, [TeamColor.Yako]: 10 },
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 1,
        expectedKitsunePawnReachedSpot: 13,
      },
    ])(
      'Given the played cards resulting in a winning team, onRuleStart() should return an array of moves' +
        " containing one move for each spot the winning team's kitsune pawn advances to",
      ({ givenPlayedCards, givenKitsunePawnSpots, expectedWinningTeam, expectedNumberOfKitsunePawnMoves, expectedKitsunePawnReachedSpot }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards)
        teamColors.forEach((color) =>
          gameBuilder.material(MaterialType.KitsunePawn).id(color).moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: givenKitsunePawnSpots[color],
          }),
        )
        const winningTeamPawnId = gameBuilder.material(MaterialType.KitsunePawn).id(expectedWinningTeam).getIndex()
        const game = gameBuilder.build()
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kistunePawnMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn))

        // Then
        expect(consequences).toHaveLength(expectedNumberOfKitsunePawnMoves + 1)
        expect(kistunePawnMoves).toHaveLength(expectedNumberOfKitsunePawnMoves)
        expect(kistunePawnMoves.every((move) => move.itemIndex === winningTeamPawnId)).toBe(true)
        expect(kistunePawnMoves[expectedNumberOfKitsunePawnMoves - 1].location.id).toBe(expectedKitsunePawnReachedSpot)
      },
    )

    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako4] },
        ],
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako4, KitsuCard.Yako2_2],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_3] },
        ],
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Yako6],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2] },
        ],
      },
    ])(
      'Given played cards resulting in a draw, onRuleStart() should return an array of moves not containing' + ' any kitsune pawn moves',
      ({ givenPlayedCards }) => {
        // Given
        const game = create2PlayersGameStateWithPlayedCards(givenPlayedCards)
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kitsunePawnMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))

        // Then
        expect(consequences).toHaveLength(1)
        expect(kitsunePawnMoves).toHaveLength(0)
      },
    )

    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko3_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako6, KitsuCard.Zenko5] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 12, [TeamColor.Yako]: 10 },
        expectedConsequencesLength: 2,
        expectedRuleMoveType: RuleMoveType.StartRule,
        expectedRuleId: RuleId.EndOfTrickDiscardCards,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako4, KitsuCard.Yako2_2],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_3] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 1, [TeamColor.Yako]: 4 },
        expectedConsequencesLength: 1,
        expectedRuleMoveType: RuleMoveType.StartRule,
        expectedRuleId: RuleId.EndOfTrickDiscardCards,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Yako6],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 7, [TeamColor.Yako]: 5 },
        expectedConsequencesLength: 1,
        expectedRuleMoveType: RuleMoveType.StartRule,
        expectedRuleId: RuleId.EndOfTrickDiscardCards,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko3_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako2_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 5, [TeamColor.Yako]: 2 },
        expectedConsequencesLength: 5,
        expectedRuleMoveType: RuleMoveType.StartPlayerTurn,
        expectedRuleId: RuleId.EndOfTrickPickAvailablePowerToken,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko6],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako1_3, KitsuCard.Yako2_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 5, [TeamColor.Yako]: 2 },
        expectedConsequencesLength: 9,
        expectedRuleMoveType: RuleMoveType.StartPlayerTurn,
        expectedRuleId: RuleId.EndOfTrickPickAvailablePowerToken,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako1_1, KitsuCard.BlackKitsune_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 5, [TeamColor.Yako]: 2 },
        expectedConsequencesLength: 9,
        expectedRuleMoveType: RuleMoveType.StartPlayerTurn,
        expectedRuleId: RuleId.EndOfTrickPickAvailablePowerToken,
      },
    ])(
      'Given played cards, onRuleStart() should return an array of move, the last being a rule move to the next rule',
      ({ givenPlayedCards, givenKitsunePawnSpots, expectedConsequencesLength, expectedRuleMoveType, expectedRuleId }) => {
        // Given
        const game = create2PlayersGameStateWithPlayedCards(givenPlayedCards)
        teamColors.forEach(
          (color) =>
            (game.items[MaterialType.KitsunePawn]!.find((pawn) => pawn.id === color)!.location = {
              type: LocationType.KitsunePawnSpotOnWisdomBoard,
              id: givenKitsunePawnSpots[color],
            }),
        )
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const ruleMoves = consequences
          .filter((move) => isStartRule<number, MaterialType, LocationType>(move) || isStartPlayerTurn<number, MaterialType, LocationType>(move))
          .map((move) => (move as StartRule<RuleId>) ?? (move as StartPlayerTurn<number, RuleId>))

        // Then
        expect(consequences).toHaveLength(expectedConsequencesLength)
        expect(ruleMoves).toHaveLength(1)
        expect(consequences[consequences.length - 1]).toBe(ruleMoves[0])
        expect(ruleMoves[0].type).toEqual(expectedRuleMoveType)
        expect(ruleMoves[0].id).toEqual(expectedRuleId)
      },
    )

    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Yako3_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 0, [TeamColor.Yako]: 0 },
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 5,
        expectedKitsunePawnReachedSpot: 5,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 2, [TeamColor.Yako]: 5 },
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 9,
        expectedKitsunePawnReachedSpot: 11,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko5, KitsuCard.WhiteKitsune_2],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako3_1, KitsuCard.WhiteKitsune_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 10, [TeamColor.Yako]: 11 },
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 2,
        expectedKitsunePawnReachedSpot: 12,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako6],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Yako2_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 10, [TeamColor.Yako]: 5 },
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 8,
        expectedKitsunePawnReachedSpot: 13,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako6, KitsuCard.WhiteKitsune_2] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 12, [TeamColor.Yako]: 10 },
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 2,
        expectedKitsunePawnReachedSpot: 12,
      },
    ])(
      'Given played cards with white kitsune cards played, onRuleStart() should return an array of moves with the ' + 'relevant number of kitsune pawn moves',
      ({ givenPlayedCards, givenKitsunePawnSpots, expectedWinningTeam, expectedNumberOfKitsunePawnMoves, expectedKitsunePawnReachedSpot }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards)
        gameBuilder.setRule(RuleId.EndOfTrickKistunePawnMove, 2)
        teamColors.forEach((color) =>
          gameBuilder.material(MaterialType.KitsunePawn).id(color).moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: givenKitsunePawnSpots[color],
          }),
        )
        const game = gameBuilder.build()
        const winningTeamPawnId = game.items[MaterialType.KitsunePawn]!.findIndex((pawn) => pawn.id === expectedWinningTeam)!
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
          player: 1,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kistunePawnMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn))

        // Then
        expect(consequences).toHaveLength(expectedNumberOfKitsunePawnMoves + 1)
        expect(kistunePawnMoves).toHaveLength(expectedNumberOfKitsunePawnMoves)
        expect(kistunePawnMoves.every((move) => move.itemIndex === winningTeamPawnId)).toBe(true)
        expect(kistunePawnMoves[expectedNumberOfKitsunePawnMoves - 1].location.id).toBe(expectedKitsunePawnReachedSpot)
      },
    )

    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Katana_2, KitsuCard.Yako3_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 0, [TeamColor.Yako]: 0 },
        givenRotatedFaceDownCardId: KitsuCard.Zenko2_1,
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 3,
        expectedKitsunePawnReachedSpot: 3,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Zenko6, KitsuCard.Katana_1] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 2, [TeamColor.Yako]: 5 },
        givenRotatedFaceDownCardId: KitsuCard.Yako4,
        expectedWinningTeam: TeamColor.Zenko,
        expectedNumberOfKitsunePawnMoves: 3,
        expectedKitsunePawnReachedSpot: 5,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Katana_1, KitsuCard.Zenko2_2],
          },
          { player: 2 as 1 | 2, playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako1_3] },
        ],
        givenKitsunePawnSpots: { [TeamColor.Zenko]: 10, [TeamColor.Yako]: 11 },
        givenRotatedFaceDownCardId: KitsuCard.Yako1_3,
        expectedWinningTeam: TeamColor.Yako,
        expectedNumberOfKitsunePawnMoves: 1,
        expectedKitsunePawnReachedSpot: 12,
      },
    ])(
      'Given played cards with rotated face down cards, onRuleStart() should return an array of moves containing' +
        'the relevant number of kitsune pawn moves for the winning team',
      ({
        givenPlayedCards,
        givenRotatedFaceDownCardId,
        givenKitsunePawnSpots,
        expectedWinningTeam,
        expectedNumberOfKitsunePawnMoves,
        expectedKitsunePawnReachedSpot,
      }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards)
        gameBuilder
          .material(MaterialType.KitsuCard)
          .location(LocationType.PlayedKitsuCardSpot)
          .id(givenRotatedFaceDownCardId)
          .moveItem((item) => ({
            type: LocationType.PlayedKitsuCardSpot,
            player: item.location.player,
            rotation: KitsuCardRotation.FaceDown,
          }))
        teamColors.forEach((color) =>
          gameBuilder.material(MaterialType.KitsunePawn).id(color).moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: givenKitsunePawnSpots[color],
          }),
        )
        const winningTeamPawnId = gameBuilder.material(MaterialType.KitsunePawn).id(expectedWinningTeam).getIndex()
        const game = gameBuilder.build()
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kistunePawnMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn))

        // Then
        expect(consequences).toHaveLength(expectedNumberOfKitsunePawnMoves + 1)
        expect(kistunePawnMoves).toHaveLength(expectedNumberOfKitsunePawnMoves)
        expect(kistunePawnMoves.every((move) => move.itemIndex === winningTeamPawnId)).toBe(true)
        expect(kistunePawnMoves[expectedNumberOfKitsunePawnMoves - 1].location.id).toBe(expectedKitsunePawnReachedSpot)
      },
    )

    test.each([
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Zenko4],
          },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1],
          },
        ],
        givenColourExchangeTokenParent: undefined,
        expectedWinningKitsunePawn: KitsunePawn.Yako,
        expectedReachedSpot: 5,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Zenko4],
          },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.Yako1_1, KitsuCard.Yako2_1],
          },
        ],
        givenColourExchangeTokenParent: kitsuCardIds.indexOf(KitsuCard.Yako2_1),
        expectedWinningKitsunePawn: KitsunePawn.Yako,
        expectedReachedSpot: 4,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Zenko4],
          },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1],
          },
        ],
        givenColourExchangeTokenParent: kitsuCardIds.indexOf(KitsuCard.Zenko4),
        expectedWinningKitsunePawn: KitsunePawn.Zenko,
        expectedReachedSpot: 5,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Zenko4],
          },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1],
          },
        ],
        givenColourExchangeTokenParent: undefined,
        expectedWinningKitsunePawn: KitsunePawn.Zenko,
        expectedReachedSpot: 2,
      },
      {
        givenPlayedCards: [
          {
            player: 1 as 1 | 2,
            playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.WhiteKitsune_2],
          },
          {
            player: 2 as 1 | 2,
            playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1],
          },
        ],
        givenColourExchangeTokenParent: kitsuCardIds.indexOf(KitsuCard.Yako2_1),
        expectedWinningKitsunePawn: KitsunePawn.Yako,
        expectedReachedSpot: 1,
      },
    ])(
      'Given various colour exchange colour tokens and cards, onRuleStart() should return moves making the relevant Kitsune Pawn advance',
      ({ givenPlayedCards, givenColourExchangeTokenParent, expectedWinningKitsunePawn, expectedReachedSpot }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards)
        if (givenColourExchangeTokenParent !== undefined) {
          gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(PowerToken.ColourExchange).moveItem({
            type: LocationType.PowerTokenSpotOnKitsuCard,
            parent: givenColourExchangeTokenParent,
          })
        }
        gameBuilder.setRule(RuleId.EndOfTrickKistunePawnMove)
        const game = gameBuilder.build()
        const rule = new EndOfTrickKitsunePawnMoveRule(game)
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
          kind: MoveKind.RulesMove,
          type: RuleMoveType.StartPlayerTurn,
          id: RuleId.EndOfTrickKistunePawnMove,
          player: 1,
        }

        // When
        const consequences = rule.onRuleStart(previousRuleMove)
        const kitsunePawnMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn))

        // Then
        expect(consequences).toHaveLength(expectedReachedSpot + 1)
        expect(kitsunePawnMoves).toHaveLength(expectedReachedSpot)
        expect(kitsunePawnMoves.every((move) => game.items[MaterialType.KitsunePawn]![move.itemIndex].id === expectedWinningKitsunePawn)).toBe(true)
        expect(kitsunePawnMoves[expectedReachedSpot - 1].location.id).toBe(expectedReachedSpot)
      },
    )
  })

  test('Given a no advance player token played during the trick, onRuleStart() should return a move to the next rule', () => {
    // Given
    const gameBuilder = create2PlayersGameBuilderWithPlayedCards([
      {
        player: 1,
        playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Zenko4],
      },
      {
        player: 2,
        playedCardIds: [KitsuCard.Yako1_1, KitsuCard.Yako2_1],
      },
    ])
    gameBuilder
      .material(MaterialType.PowerToken)
      .id<PowerToken>(PowerToken.NoAdvance)
      .moveItem({
        type: LocationType.PowerTokenSpotOnKitsuCard,
        parent: gameBuilder.material(MaterialType.KitsuCard).id<KitsuCard>(KitsuCard.Yako1_1).getIndex(),
      })
    gameBuilder.setRule(RuleId.EndOfTrickKistunePawnMove, 1)
    const game = gameBuilder.build()
    const rule = new EndOfTrickKitsunePawnMoveRule(game)
    const previousRuleMove: StartPlayerTurn<number, RuleId> = {
      kind: MoveKind.RulesMove,
      type: RuleMoveType.StartPlayerTurn,
      id: RuleId.EndOfTrickKistunePawnMove,
      player: 1,
    }

    // When
    const consequences = rule.onRuleStart(previousRuleMove)
    const ruleMoves = consequences.filter(isStartRule<number, MaterialType, LocationType>)

    // Then
    expect(consequences).toHaveLength(1)
    expect(ruleMoves).toHaveLength(1)
    expect(consequences[0]).toBe(ruleMoves[0])
    expect(ruleMoves[0].id).toBe(RuleId.EndOfTrickDiscardCards)
  })
})
