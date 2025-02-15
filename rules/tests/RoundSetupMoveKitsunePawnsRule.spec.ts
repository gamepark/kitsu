import {
    isMoveItemTypeAtOnce,
    isStartRule,
    MoveItemsAtOnce,
    MoveKind,
    RuleMoveType,
    StartRule,
} from '@gamepark/rules-api';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { RoundSetupMoveKitsunePawnsRule } from '../src/rules/RoundSetupMoveKitsunePawnsRule';
import { RuleId } from '../src/rules/RuleId';
import { create2PlayersGameState } from './utils/MaterialGameTestUtils';

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
            const kitsuneTokenMoves = moves.filter(move => isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move))
                .map(move => move as MoveItemsAtOnce<number, MaterialType, LocationType>);

            // Then
            expect(kitsuneTokenMoves).toHaveLength(1);
            expect(kitsuneTokenMoves[0].location.type).toEqual(LocationType.KitsunePawnSpotOnWisdomBoard);
            expect(kitsuneTokenMoves[0].location.id).toBe(0);
        });

        test('onRuleStart() should return an array of 3 moves with the last being a rule move to the RoundSetupDealCardsRule', () => {
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
            const ruleMoves = moves.filter(move => isStartRule<number, MaterialType, LocationType>(move))
                .map(move => move as StartRule<RuleId>);

            // Then
            expect(moves).toHaveLength(2);
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0]).toBe(moves[1]);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupDealCards);
        });
    });
});