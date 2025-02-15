import {
    CustomMove,
    isCreateItemType,
    isCustomMoveType,
    isEndGame,
    isMoveItemType,
    isMoveItemTypeAtOnce,
    isStartPlayerTurn,
    MoveKind,
    RuleMoveType,
    StartRule
} from '@gamepark/rules-api';
import { CustomMoveType } from '../src/material/CustomMoveType';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { VictoryCard } from '../src/material/VictoryCard';
import { RoundEndRule } from '../src/rules/RoundEndRule';
import { RuleId } from '../src/rules/RuleId';
import { TeamColor } from '../src/TeamColor';
import { create2PlayersGameBuilder } from './utils/MaterialGameTestUtils';

describe('RoundEnd rule tests', () => {
    test.each([
        {victoryCardTeam: VictoryCard.Yako, kitsunePawnTeam: TeamColor.Yako},
        {victoryCardTeam: VictoryCard.Zenko, kitsunePawnTeam: TeamColor.Zenko},
    ])('Given a team with a victory card, onRuleStart() should return an array containing only a EndGame rule move', ({
                                                                                                                          victoryCardTeam,
                                                                                                                          kitsunePawnTeam
                                                                                                                      }) => {
        //Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.material(MaterialType.VictoryCard).createItem({
            id: victoryCardTeam, location: {
                type: LocationType.VictoryCardsSpot
            }
        });
        gameBuilder.material(MaterialType.KitsunePawn).id(kitsunePawnTeam).moveItem({
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: 13
        });
        const game = gameBuilder.build();
        const rule = new RoundEndRule(game);
        const previousRuleMove: StartRule<RuleId> = {
            type: RuleMoveType.StartRule,
            kind: MoveKind.RulesMove,
            id: RuleId.RoundEnd
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(isEndGame<number, MaterialType, LocationType>)

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toBe(consequences[0]);
    });

    describe('2 players tests', () => {
        test.each([
            {winningTeam: TeamColor.Yako, expectedVictoryCardId: VictoryCard.Yako},
            {winningTeam: TeamColor.Zenko, expectedVictoryCardId: VictoryCard.Zenko},
        ])('Given no team already has a victory card, onRuleStart() should return an array of move, with the first being ' +
            'a VictoryCard CreateItem, the second and last one a custom move of type PickRandomPlayer', ({
                                                                                                             winningTeam,
                                                                                                             expectedVictoryCardId,
                                                                                                         }) => {
            // Given
            const gameBuilder = create2PlayersGameBuilder();
            gameBuilder.material(MaterialType.KitsunePawn).id(winningTeam).moveItem({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 13
            });
            const game = gameBuilder.build();
            const rule = new RoundEndRule(game);
            const previousRuleMove: StartRule<RuleId> = {
                type: RuleMoveType.StartRule,
                kind: MoveKind.RulesMove,
                id: RuleId.RoundEnd
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const kitsuCardMoves = consequences.filter(isMoveItemTypeAtOnce<number, MaterialType, LocationType>(MaterialType.KitsuCard));
            const victoryCardMoves = consequences.filter(isCreateItemType<number, MaterialType, LocationType>(MaterialType.VictoryCard));
            const customMoves = consequences.filter(isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer));

            // Then
            expect(consequences).toHaveLength(3);
            expect(kitsuCardMoves).toHaveLength(1);
            expect(victoryCardMoves).toHaveLength(1);
            expect(customMoves).toHaveLength(1);
            expect(kitsuCardMoves[0]).toBe(consequences[0]);
            expect(kitsuCardMoves[0].location.type).toBe(LocationType.KitsuCardDeckSpotOnWisdomBoard);
            expect(victoryCardMoves[0]).toBe(consequences[1]);
            expect(customMoves[0]).toBe(consequences[2]);
            expect(victoryCardMoves[0].item.id).toEqual(expectedVictoryCardId);
            expect(victoryCardMoves[0].item.location.type).toEqual(LocationType.VictoryCardsSpot);
            expect(customMoves[0].data).toBeUndefined();
        });

        test.each([
            {winningTeam: TeamColor.Yako, expectedVictoryCardId: VictoryCard.Yako},
            {winningTeam: TeamColor.Zenko, expectedVictoryCardId: VictoryCard.Zenko},
        ])('Given loosing team team already has a victory card, onRuleStart() should return an array of move, with the first being ' +
            'a VictoryCard CreateItem, the second and last one a custom move of type PickRandomPlayer', ({
                                                                                                             winningTeam,
                                                                                                             expectedVictoryCardId,
                                                                                                         }) => {
            // Given
            const gameBuilder = create2PlayersGameBuilder();
            gameBuilder.material(MaterialType.VictoryCard).createItem({
                id: winningTeam === TeamColor.Yako ? VictoryCard.Zenko : VictoryCard.Yako,
                location: {
                    type: LocationType.VictoryCardsSpot
                }
            });
            gameBuilder.material(MaterialType.KitsunePawn).id(winningTeam).moveItem({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 13
            });
            const game = gameBuilder.build();
            const rule = new RoundEndRule(game);
            const previousRuleMove: StartRule<RuleId> = {
                type: RuleMoveType.StartRule,
                kind: MoveKind.RulesMove,
                id: RuleId.RoundEnd
            };

            // When
            const consequences = rule.onRuleStart(previousRuleMove);
            const victoryCardMoves = consequences.filter(isCreateItemType<number, MaterialType, LocationType>(MaterialType.VictoryCard));
            const customMoves = consequences.filter(isCustomMoveType<CustomMoveType>(CustomMoveType.PickRandomPlayer));

            // Then
            expect(consequences).toHaveLength(3);
            expect(victoryCardMoves).toHaveLength(1);
            expect(customMoves).toHaveLength(1);
            expect(victoryCardMoves[0]).toBe(consequences[1]);
            expect(customMoves[0]).toBe(consequences[2]);
            expect(victoryCardMoves[0].item.id).toEqual(expectedVictoryCardId);
            expect(victoryCardMoves[0].item.location.type).toEqual(LocationType.VictoryCardsSpot);
            expect(customMoves[0].data).toBeUndefined();
        });

        test.each([
            {winningTeam: TeamColor.Yako, expectedPlayer: 2},
            {winningTeam: TeamColor.Zenko, expectedPlayer: 1},
        ])('onCustomMove() should return a leadertoken MoveItem and a StartPlayerTurn rule move', ({
                                                                                                       winningTeam,
                                                                                                       expectedPlayer
                                                                                                   }) => {
            // Given
            const gameBuilder = create2PlayersGameBuilder();
            gameBuilder.material(MaterialType.KitsunePawn).id(winningTeam).moveItem({
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 13
            });
            gameBuilder.material(MaterialType.LeaderToken).createItem({
                location: {
                    type: LocationType.LeaderTokenSpotOnClanCard,
                    player: 1
                }
            });
            const game = gameBuilder.build();
            const rule = new RoundEndRule(game);
            const previousCustomMove: CustomMove<CustomMoveType> = {
                kind: MoveKind.CustomMove,
                type: CustomMoveType.PickRandomPlayer,
                data: 0
            };

            // When
            const consequences = rule.onCustomMove(previousCustomMove);
            const leaderTokenMoves = consequences.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken));
            const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>);

            // Then
            expect(consequences).toHaveLength(2);
            expect(leaderTokenMoves).toHaveLength(1);
            expect(ruleMoves).toHaveLength(1);
            expect(leaderTokenMoves[0]).toBe(consequences[0]);
            expect(leaderTokenMoves[0].location.player).toBe(expectedPlayer);
            expect(ruleMoves[0]).toBe(consequences[1]);
            expect(ruleMoves[0].player).toBe(expectedPlayer);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupMoveKitsunePawns);
        });


    });

});