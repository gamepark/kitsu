import {
    isMoveItemType,
    isShuffleItemType,
    isStartRule,
    MoveItem,
    MoveKind,
    RuleMoveType,
    Shuffle,
    StartRule
} from '@gamepark/rules-api';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { RoundSetupDealCardsRule } from '../src/rules/RoundSetupDealCardsRule';
import { RuleId } from '../src/rules/RuleId';
import { create2PlayersGameBuilder, create2PlayersGameState } from './utils/MaterialGameTestUtils';

describe('Round setup - deal card rule tests', () => {
    describe('2-players tests', () => {
        test('onRuleStart() should return an array of moves with the first item being a shuffle move of 24 cards', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupDealCardsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({
                type: RuleMoveType.StartPlayerTurn,
                player: 1,
                id: RuleId.RoundSetupMoveKitsunePawns,
                kind: MoveKind.RulesMove
            });
            const shuffleMove = moves[0];

            // Then
            expect(isShuffleItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(shuffleMove)).toBe(true);
            expect((shuffleMove as Shuffle).indexes).toHaveLength(24);
        });

        test('onRuleStart() should return an array of moves containing 12 deal KitsuCard moves, 6 for each player, each player being alternated', () => {
            // Given
            const gameStateBuilder = create2PlayersGameBuilder();
            gameStateBuilder.setRule(RuleId.RoundSetupDealCards, 1);
            const roundSetupRule = new RoundSetupDealCardsRule(gameStateBuilder.build());

            // When
            const moves = roundSetupRule.onRuleStart({
                type: RuleMoveType.StartPlayerTurn,
                player: 1,
                id: RuleId.RoundSetupMoveKitsunePawns,
                kind: MoveKind.RulesMove
            });
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
            const roundSetupRule = new RoundSetupDealCardsRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({
                type: RuleMoveType.StartPlayerTurn,
                player: 1,
                id: RuleId.RoundSetupMoveKitsunePawns,
                kind: MoveKind.RulesMove
            });
            const ruleMoves = moves.filter(move => isStartRule<number, MaterialType, LocationType>(move)).map(move => move as StartRule<RuleId>);

            // Expect
            expect(ruleMoves).toHaveLength(1);
            expect(moves.indexOf(ruleMoves[0])).toBe(moves.length - 1);
            expect(ruleMoves[0].id).toBe(RuleId.PlayKitsuCard);
        });
    });
});