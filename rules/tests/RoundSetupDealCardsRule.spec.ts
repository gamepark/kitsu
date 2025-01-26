import { RoundSetupMoveKitsunePawnsRule } from "../src/rules/RoundSetupMoveKitsunePawnsRule";
import {
    isMoveItemType,
    isShuffleItemType, isStartPlayerTurn,
    MoveItem,
    MoveKind,
    RuleMoveType,
    Shuffle, StartPlayerTurn
} from "@gamepark/rules-api";
import { RuleId } from "../src/rules/RuleId";
import { MaterialType } from "../src/material/MaterialType";
import { LocationType } from "../src/material/LocationType";
import { create2PlayersGameState } from "./utils/MaterialGameTestUtils";

describe("Round setup - deal card rule tests", () => {
    describe("2-players tests", () => {
        test('onRuleStart() should return an array of moves with the first item being a shuffle move of 24 cards', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetupMoveKitsunePawns, kind: MoveKind.RulesMove});
            const shuffleMove = moves[0];

            // Then
            expect(isShuffleItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(shuffleMove)).toBe(true);
            expect((shuffleMove as Shuffle).indexes).toHaveLength(24);
        });

        test('onRuleStart() should return an array of moves containing 12 deal KitsuCard moves, 6 for each player, each player being alternated', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetupMoveKitsunePawns, kind: MoveKind.RulesMove})
            const dealCardMoves = moves.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
                && (move as MoveItem).location.type === LocationType.PlayerHand)
                .map((move, index) => ({index: index, move: move as MoveItem}));
            const firstPlayerMoves = dealCardMoves.filter(({move}) => move.location.player === 1);
            const secondPlayerMoves = dealCardMoves.filter(({move}) => move.location.player === 2);

            // Then
            expect(dealCardMoves).toHaveLength(12);
            expect(firstPlayerMoves).toHaveLength(6);
            expect(secondPlayerMoves).toHaveLength(6);
            expect(firstPlayerMoves.every(({index}) => index % 2 === 1)).toBe(true);
            expect(secondPlayerMoves.every(({index}) => index % 2 === 0)).toBe(true);
        });

        test('onRuleStart() should return an array of moves with the last item being a rule move starting the PlayKitsuCard for the leader', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupMoveKitsunePawnsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetupMoveKitsunePawns, kind: MoveKind.RulesMove})
            const ruleMoves = moves.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move)).map(move => move as StartPlayerTurn);

            // Expect
            expect(ruleMoves).toHaveLength(1);
            expect(moves.indexOf(ruleMoves[0])).toBe(moves.length - 1);
            expect(ruleMoves[0].id).toBe(RuleId.PlayKitsuCard);
            expect(ruleMoves[0].player).toBe(1);
        });
    })
})