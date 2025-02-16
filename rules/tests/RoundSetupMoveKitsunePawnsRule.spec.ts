import { isMoveItemTypeAtOnce, isStartRule, MoveKind, RuleMoveType, StartPlayerTurn, } from '@gamepark/rules-api';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { PowerToken } from '../src/material/PowerToken';
import { RoundSetupMoveKitsunePawnsRule } from '../src/rules/RoundSetupMoveKitsunePawnsRule';
import { RuleId } from '../src/rules/RuleId';
import { create2PlayersGameBuilder, create2PlayersGameState } from './utils/MaterialGameTestUtils';

describe('Round setup - move kitsune pawns rule tests', () => {
    describe('Given a game with 2 players', () => {
        test('onRuleStart() should return an array of moves containing two moves of KitsuneToken to LocationType.KistunePawnSpotOnWisdomBoard and id 0', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({
                type: RuleMoveType.StartPlayerTurn,
                player: 1,
                id: RuleId.RoundSetupMoveKitsunePawns,
                kind: MoveKind.RulesMove
            });
            const kitsuneTokenMoves = moves.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsunePawn));

            // Then
            expect(kitsuneTokenMoves).toHaveLength(1);
            expect(kitsuneTokenMoves[0].location.type).toEqual(LocationType.KitsunePawnSpotOnWisdomBoard);
            expect(kitsuneTokenMoves[0].location.id).toBe(0);
        });

        test('onRuleStart() should return an array of 2 moves with the last being a rule move to the RoundSetupDealCardsRule', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({
                type: RuleMoveType.StartPlayerTurn,
                player: 1,
                id: RuleId.RoundSetupMoveKitsunePawns,
                kind: MoveKind.RulesMove
            });
            const ruleMoves = moves.filter(isStartRule<number, MaterialType, LocationType>);

            // Then
            expect(moves).toHaveLength(2);
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0]).toBe(moves[1]);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupDealCards);
        });

        test.each([
            {givenDiscardedPowerTokens: [PowerToken.PickDiscarded, PowerToken.NoAdvance, PowerToken.Protection], expectedTokenIndexes: [2, 1, 4]},
            {givenDiscardedPowerTokens: [PowerToken.Plus3, PowerToken.ColourExchange], expectedTokenIndexes: [3, 0]},
            {givenDiscardedPowerTokens: [PowerToken.NoAdvance], expectedTokenIndexes: [1]}
        ])('Given discarded power tokens, onRuleStart() should return a consequences array with 3 moves, one for the' +
            ' kitsune pawns, one for the power tokens and a rule move to the next rule', ({givenDiscardedPowerTokens, expectedTokenIndexes}) => {
            // Given
            const gameBuilder = create2PlayersGameBuilder();
            gameBuilder.setRule(RuleId.RoundSetupMoveKitsunePawns, 1);
            gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(id => givenDiscardedPowerTokens.includes(id)).moveItems({
                type: LocationType.DiscardedPowerTokenAreaOnWisdomBoard
            });
            const game = gameBuilder.build();
            const rule = new RoundSetupMoveKitsunePawnsRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.RoundSetupMoveKitsunePawns,
                player: 1
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const kistunePawnsMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsunePawn));
            const powerTokenMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.PowerToken));
            const ruleMoves = consequences.filter(isStartRule<number, MaterialType, LocationType>);

            // Then
            expect(consequences).toHaveLength(3);
            expect(kistunePawnsMoves).toHaveLength(1);
            expect(kistunePawnsMoves[0]).toBe(consequences[0])
            expect(kistunePawnsMoves[0].location.type).toBe(LocationType.KitsunePawnSpotOnWisdomBoard);
            expect(kistunePawnsMoves[0].location.id).toBe(0);
            expect(kistunePawnsMoves[0].indexes).toEqual(expect.arrayContaining([0, 1]))
            expect(powerTokenMoves).toHaveLength(1);
            expect(powerTokenMoves[0]).toBe(consequences[1])
            expect(powerTokenMoves[0].location.type).toBe(LocationType.PowerTokenSpotOnWisdomBoard);
            expect(powerTokenMoves[0].indexes).toEqual(expect.arrayContaining(expectedTokenIndexes))
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0]).toBe(consequences[2]);
        });
    });
});