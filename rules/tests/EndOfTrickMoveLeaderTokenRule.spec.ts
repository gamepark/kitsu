import {
    isMoveItemType,
    isStartRule,
    MoveItem,
    MoveKind,
    RuleMoveType,
    StartPlayerTurn,
    StartRule
} from '@gamepark/rules-api';
import { KitsuCard } from '../src/material/KitsuCard';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { EndOfTrickMoveLeaderTokenRule } from '../src/rules/EndOfTrickMoveLeaderTokenRule';
import { RuleId } from '../src/rules/RuleId';
import { create2PlayersGameState, create2PlayersGameStateWithCardsInPlayersHands } from './utils/MaterialGameTestUtils';

describe('End of trick - Move leader token rule tests', () => {
    describe('2-players tests', () => {
        test.each([
            {
                playerHands: [{
                    player: 1 as (1 | 2),
                    cardIds: [KitsuCard.Yako2_2, KitsuCard.Zenko1_1, KitsuCard.Yako3_1]
                }, {player: 2 as (1 | 2), cardIds: [KitsuCard.Zenko6, KitsuCard.Yako2_2, KitsuCard.Zenko4]}]
            },
            {
                playerHands: [{
                    player: 1 as (1 | 2),
                    cardIds: [KitsuCard.Zenko1_2, KitsuCard.Zenko3_1]
                }, {player: 2 as (1 | 2), cardIds: [KitsuCard.Yako6, KitsuCard.Yako2_2]}]
            },
            {
                playerHands: [{player: 1 as (1 | 2), cardIds: [KitsuCard.Zenko4]}, {
                    player: 2 as (1 | 2),
                    cardIds: [KitsuCard.Yako5]
                }]
            },
        ])('Given non-empty player hands, onRuleStart() should return an array containing one item move for the ' +
            'leader token and one rule move to the EndOfTrickPickCardsRule', ({playerHands}) => {
            // Given
            const game = create2PlayersGameStateWithCardsInPlayersHands(playerHands);
            const rule = new EndOfTrickMoveLeaderTokenRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickDiscardCards,
                player: 1
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const leaderTokenMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken)(move))
                .map(move => move as MoveItem<number, MaterialType, LocationType>);
            const ruleMoves = consequences.filter(move => isStartRule<number, MaterialType, LocationType>(move))
                .map(move => move as StartRule<RuleId>);

            // Then
            expect(consequences).toHaveLength(2);
            expect(leaderTokenMoves).toHaveLength(1);
            expect(leaderTokenMoves[0].location.player).toBe(2);
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0].id).toBe(RuleId.EndOfTrickPickCards);
        });

        test('Given empty player hands, onRuleStart() should return an array containing one item move for the ' +
            'leader token and one rule move to the RoundSetupDealCardsRule', () => {
            // Given
            const game = create2PlayersGameState();
            const rule = new EndOfTrickMoveLeaderTokenRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickDiscardCards,
                player: 1
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const leaderTokenMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken)(move))
                .map(move => move as MoveItem<number, MaterialType, LocationType>);
            const ruleMoves = consequences.filter(move => isStartRule<number, MaterialType, LocationType>(move))
                .map(move => move as StartRule<RuleId>);

            // Then
            expect(consequences).toHaveLength(2);
            expect(leaderTokenMoves).toHaveLength(1);
            expect(leaderTokenMoves[0].location.player).toBe(2);
            expect(ruleMoves).toHaveLength(1);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupDealCards);
        });
    });
});