import {
    CreateItem,
    EndGame,
    isCreateItemType,
    isEndGame,
    isMoveItemType,
    isStartPlayerTurn,
    MoveItem,
    MoveKind,
    RuleMoveType,
    StartPlayerTurn,
    StartRule
} from '@gamepark/rules-api';
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
        const ruleMoves = consequences.filter(move => isEndGame<number, MaterialType, LocationType>(move))
            .map(move => move as EndGame);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toBe(consequences[0]);
    });

    describe('2 players tests', () => {
        test.each([
            {winningTeam: TeamColor.Yako, expectedVictoryCardId: VictoryCard.Yako, expectedPlayer: 2},
            {winningTeam: TeamColor.Zenko, expectedVictoryCardId: VictoryCard.Zenko, expectedPlayer: 1},
        ])('Given no team already has a victory card, onRuleStart() should return an array of move, with the first being ' +
            'a VictoryCard CreateItem, the second one a LeaderToken move the player in the winning team and the ' +
            'last one a rule move to the RoundSetMoveKitsunePawnsRule', ({
                                                                             winningTeam,
                                                                             expectedVictoryCardId,
                                                                             expectedPlayer
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
            const ruleMoves = consequences.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move))
                .map(move => move as StartPlayerTurn<number, RuleId>);
            const victoryCardMoves = consequences.filter(move => isCreateItemType<number, MaterialType, LocationType>(MaterialType.VictoryCard)(move))
                .map(move => move as CreateItem<number, MaterialType, LocationType>);
            const leaderTokenMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken)(move))
                .map(move => move as MoveItem<number, MaterialType, LocationType>);

            // Then
            expect(consequences).toHaveLength(3);
            expect(victoryCardMoves).toHaveLength(1);
            expect(leaderTokenMoves).toHaveLength(1);
            expect(ruleMoves).toHaveLength(1);
            expect(victoryCardMoves[0]).toBe(consequences[0]);
            expect(leaderTokenMoves[0]).toBe(consequences[1]);
            expect(ruleMoves[0]).toBe(consequences[2]);
            expect(victoryCardMoves[0].item.id).toEqual(expectedVictoryCardId);
            expect(victoryCardMoves[0].item.location.type).toEqual(LocationType.VictoryCardsSpot);
            expect(leaderTokenMoves[0].location.type).toEqual(LocationType.LeaderTokenSpotOnClanCard);
            expect(leaderTokenMoves[0].location.player).toEqual(expectedPlayer);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupMoveKitsunePawns);
            expect(ruleMoves[0].player).toBe(expectedPlayer);
        });

        test.each([
            {winningTeam: TeamColor.Yako, expectedVictoryCardId: VictoryCard.Yako, expectedPlayer: 2},
            {winningTeam: TeamColor.Zenko, expectedVictoryCardId: VictoryCard.Zenko, expectedPlayer: 1},
        ])('Given loosing team team already has a victory card, onRuleStart() should return an array of move, with the first being ' +
            'a VictoryCard CreateItem, the second one a LeaderToken move the player in the winning team and the ' +
            'last one a rule move to the RoundSetMoveKitsunePawnsRule', ({
                                                                             winningTeam,
                                                                             expectedVictoryCardId,
                                                                             expectedPlayer
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
            const ruleMoves = consequences.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move))
                .map(move => move as StartPlayerTurn<number, RuleId>);
            const victoryCardMoves = consequences.filter(move => isCreateItemType<number, MaterialType, LocationType>(MaterialType.VictoryCard)(move))
                .map(move => move as CreateItem<number, MaterialType, LocationType>);
            const leaderTokenMoves = consequences.filter(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.LeaderToken)(move))
                .map(move => move as MoveItem<number, MaterialType, LocationType>);

            // Then
            expect(consequences).toHaveLength(3);
            expect(victoryCardMoves).toHaveLength(1);
            expect(leaderTokenMoves).toHaveLength(1);
            expect(ruleMoves).toHaveLength(1);
            expect(victoryCardMoves[0]).toBe(consequences[0]);
            expect(leaderTokenMoves[0]).toBe(consequences[1]);
            expect(ruleMoves[0]).toBe(consequences[2]);
            expect(victoryCardMoves[0].item.id).toEqual(expectedVictoryCardId);
            expect(victoryCardMoves[0].item.location.type).toEqual(LocationType.VictoryCardsSpot);
            expect(leaderTokenMoves[0].location.type).toEqual(LocationType.LeaderTokenSpotOnClanCard);
            expect(leaderTokenMoves[0].location.player).toEqual(expectedPlayer);
            expect(ruleMoves[0].id).toBe(RuleId.RoundSetupMoveKitsunePawns);
            expect(ruleMoves[0].player).toBe(expectedPlayer);
        });


    });

});