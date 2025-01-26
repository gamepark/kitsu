import { RoundSetupMoveKitsunePawnsRule } from "../src/rules/RoundSetupMoveKitsunePawnsRule";
import {
    isMoveItemType, isStartPlayerTurn,
    MoveItem,
    MoveKind,
    RuleMoveType, StartPlayerTurn,
} from "@gamepark/rules-api";
import { RuleId } from "../src/rules/RuleId";
import { MaterialType } from "../src/material/MaterialType";
import { LocationType } from "../src/material/LocationType";
import { create2PlayersGameState } from "./utils/MaterialGameTestUtils";

describe('Round setup - move kitsune pawns rule tests', () => {
    describe('Given a game with 2 players', () => {
        test('onRuleStart() should return an array of moves containing two moves of KitsuneToken to LocationType.KistunePawnSpotOnWisdomBoard and id 0', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetupMoveKitsunePawns, kind: MoveKind.RulesMove})
            const kitsuneTokenMoves = moves.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move))
                .map(move => move as MoveItem);

            // Then
            expect(kitsuneTokenMoves).toHaveLength(2);
            expect(kitsuneTokenMoves.every(move => move.location.type === LocationType.KitsunePawnSpotOnWisdomBoard && move.location.id === 0)).toBe(true);
        });

        test('onRuleStart() should return an array of 3 moves with the last being a rule move to the RoundSetupDealCardsRule', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetupMoveKitsunePawns, kind: MoveKind.RulesMove})
            const ruleMoves = moves.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move))
                .map(move => move as StartPlayerTurn<number, RuleId>);

            // Then
            expect(moves).not.toHaveLength(3);
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0]).toBe(moves[2]);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupDealCards);
        })
    });
});