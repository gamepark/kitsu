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
import { EndOfTrickKitsunePawnMoveRule } from '../src/rules/EndOfTrickKitsunePawnMoveRule';
import { RuleId } from '../src/rules/RuleId';
import { TeamColor, teamColors } from '../src/TeamColor';
import {
    create2PlayersGameBuilderWithPlayedCards,
    create2PlayersGameStateWithPlayedCards
} from './utils/MaterialGameTestUtils';

describe('End of trick - kitsune pawn move rule', () => {
    describe('2 players tests', () => {
        test.each([
            {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako3_1]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 0, [TeamColor.Yako]: 0},
                expectedWinningTeam: TeamColor.Zenko,
                expectedNumberOfKitsunePawnMoves: 3,
                expectedKitsunePawnReachedSpot: 3
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Zenko6, KitsuCard.Yako2_1]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 2, [TeamColor.Yako]: 5},
                expectedWinningTeam: TeamColor.Yako,
                expectedNumberOfKitsunePawnMoves: 3,
                expectedKitsunePawnReachedSpot: 8
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko2_2]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako1_3]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 10, [TeamColor.Yako]: 11},
                expectedWinningTeam: TeamColor.Zenko,
                expectedNumberOfKitsunePawnMoves: 3,
                expectedKitsunePawnReachedSpot: 13
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Yako5, KitsuCard.Yako6]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako2_2]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 10, [TeamColor.Yako]: 5},
                expectedWinningTeam: TeamColor.Yako,
                expectedNumberOfKitsunePawnMoves: 8,
                expectedKitsunePawnReachedSpot: 13
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko3_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako6, KitsuCard.Zenko5]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 12, [TeamColor.Yako]: 10},
                expectedWinningTeam: TeamColor.Zenko,
                expectedNumberOfKitsunePawnMoves: 1,
                expectedKitsunePawnReachedSpot: 13
            },
        ])('Given the played cards resulting in a winning team, onRuleStart() should return an array of moves' +
            ' containing one move for each spot the winning team\'s kitsune pawn advances to', ({
                                                                                                    givenPlayedCards,
                                                                                                    givenKitsunePawnSpots,
                                                                                                    expectedWinningTeam,
                                                                                                    expectedNumberOfKitsunePawnMoves,
                                                                                                    expectedKitsunePawnReachedSpot
                                                                                                }) => {
            // Given
            const game = create2PlayersGameStateWithPlayedCards(givenPlayedCards);
            teamColors.forEach(color => game.items[MaterialType.KitsunePawn]!.find(pawn => pawn.id === color)!.location = {
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: givenKitsunePawnSpots[color],
            });
            const winningTeamPawnId = game.items[MaterialType.KitsunePawn]?.findIndex(pawn => pawn.id === expectedWinningTeam)!;
            const rule = new EndOfTrickKitsunePawnMoveRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickKistunePawnMove
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const kistunePawnMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move))
                .map(move => (move as MoveItem<number, MaterialType, LocationType>));

            // Then
            expect(consequences).toHaveLength(expectedNumberOfKitsunePawnMoves + 1);
            expect(kistunePawnMoves).toHaveLength(expectedNumberOfKitsunePawnMoves);
            expect(kistunePawnMoves.every(move => move.itemIndex === winningTeamPawnId)).toBe(true);
            expect(kistunePawnMoves[expectedNumberOfKitsunePawnMoves - 1].location.id).toBe(expectedKitsunePawnReachedSpot);
        });

        test.each([
            {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako4]}]
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Yako4, KitsuCard.Yako2_2]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_3]}]
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Yako6]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2]}]
            },
        ])('Given played cards resulting in a draw, onRuleStart() should return an array of moves not containing' +
            ' any kitsune pawn moves', ({givenPlayedCards}) => {
            // Given
            const game = create2PlayersGameStateWithPlayedCards(givenPlayedCards);
            const rule = new EndOfTrickKitsunePawnMoveRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickKistunePawnMove
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const kitsunePawnMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move));

            // Then
            expect(consequences).toHaveLength(1);
            expect(kitsunePawnMoves).toHaveLength(0);
        });

        test.each([
            {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko3_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako2_1, KitsuCard.Yako2_2]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 5, [TeamColor.Yako]: 2},
                expectedConsequencesLength: 5,
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko4, KitsuCard.Zenko3_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako6, KitsuCard.Zenko5]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 12, [TeamColor.Yako]: 10},
                expectedConsequencesLength: 2,
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Yako4, KitsuCard.Yako2_2]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Zenko5, KitsuCard.Zenko1_3]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 1, [TeamColor.Yako]: 4},
                expectedConsequencesLength: 1,
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko3_1, KitsuCard.Yako6]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Zenko1_2]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 7, [TeamColor.Yako]: 5},
                expectedConsequencesLength: 1,
            }
        ])('Given played cards, onRuleStart() should return an array of move, the last being a rule move to the next rule', ({
                                                                                                                                 givenPlayedCards,
                                                                                                                                 givenKitsunePawnSpots,
                                                                                                                                 expectedConsequencesLength
                                                                                                                             }) => {
            // Given
            const game = create2PlayersGameStateWithPlayedCards(givenPlayedCards);
            teamColors.forEach(color => game.items[MaterialType.KitsunePawn]!.find(pawn => pawn.id === color)!.location = {
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: givenKitsunePawnSpots[color],
            });
            const rule = new EndOfTrickKitsunePawnMoveRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickKistunePawnMove
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const ruleMoves = consequences.filter(move => isStartRule<number, MaterialType, LocationType>(move))
                .map(move => (move as StartRule<RuleId>));

            // Then
            expect(consequences).toHaveLength(expectedConsequencesLength);
            expect(ruleMoves).toHaveLength(1);
            expect(consequences[consequences.length - 1]).toBe(ruleMoves[0]);
            expect(ruleMoves[0]).toEqual({
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartRule,
                id: RuleId.EndOfTrickDiscardCards,
            });
        });

        test.each([
            {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko2_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Yako3_1]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 0, [TeamColor.Yako]: 0},
                expectedWinningTeam: TeamColor.Yako,
                expectedNumberOfKitsunePawnMoves: 5,
                expectedKitsunePawnReachedSpot: 5
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Yako4]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako2_1]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 2, [TeamColor.Yako]: 5},
                expectedWinningTeam: TeamColor.Zenko,
                expectedNumberOfKitsunePawnMoves: 9,
                expectedKitsunePawnReachedSpot: 11
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko5, KitsuCard.WhiteKitsune_2]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako3_1, KitsuCard.WhiteKitsune_1]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 10, [TeamColor.Yako]: 11},
                expectedWinningTeam: TeamColor.Zenko,
                expectedNumberOfKitsunePawnMoves: 2,
                expectedKitsunePawnReachedSpot: 12
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Yako6]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Yako2_2]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 10, [TeamColor.Yako]: 5},
                expectedWinningTeam: TeamColor.Yako,
                expectedNumberOfKitsunePawnMoves: 8,
                expectedKitsunePawnReachedSpot: 13
            }, {
                givenPlayedCards: [{
                    player: (1 as 1 | 2),
                    playedCardIds: [KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1]
                }, {player: (2 as 1 | 2), playedCardIds: [KitsuCard.Yako6, KitsuCard.WhiteKitsune_2]}],
                givenKitsunePawnSpots: {[TeamColor.Zenko]: 12, [TeamColor.Yako]: 10},
                expectedWinningTeam: TeamColor.Yako,
                expectedNumberOfKitsunePawnMoves: 2,
                expectedKitsunePawnReachedSpot: 12
            },
        ])('Given played cards with white kitsune cards played, onRuleStart() should return an array of moves with the ' +
            'relevant number of kitsune pawn moves', ({
                                                          givenPlayedCards,
                                                          givenKitsunePawnSpots,
                                                          expectedWinningTeam,
                                                          expectedNumberOfKitsunePawnMoves,
                                                          expectedKitsunePawnReachedSpot
                                                      }) => {
            // Given
            const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
            gameBuilder.setRule(RuleId.EndOfTrickKistunePawnMove, 2);
            teamColors.forEach(color => gameBuilder.material(MaterialType.KitsunePawn).id(color).moveItem({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: givenKitsunePawnSpots[color],
            }));
            const game = gameBuilder.build();
            const winningTeamPawnId = game.items[MaterialType.KitsunePawn]?.findIndex(pawn => pawn.id === expectedWinningTeam)!;
            const rule = new EndOfTrickKitsunePawnMoveRule(game);
            const previousRuleMove: StartPlayerTurn<number, RuleId> = {
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartPlayerTurn,
                id: RuleId.EndOfTrickKistunePawnMove,
                player: 1,
            }

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const kistunePawnMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move))
                .map(move => move as MoveItem<number, MaterialType, LocationType>)

            // Then
            expect(consequences).toHaveLength(expectedNumberOfKitsunePawnMoves + 1);
            expect(kistunePawnMoves).toHaveLength(expectedNumberOfKitsunePawnMoves);
            expect(kistunePawnMoves.every(move => move.itemIndex === winningTeamPawnId)).toBe(true);
            expect(kistunePawnMoves[expectedNumberOfKitsunePawnMoves - 1].location.id).toBe(expectedKitsunePawnReachedSpot);
        });
    });
});