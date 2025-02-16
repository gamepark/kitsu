import {
    isMoveItemType,
    isStartPlayerTurn,
    ItemMoveType,
    MoveItem,
    MoveKind,
    RuleMoveType,
    StartRule
} from '@gamepark/rules-api';
import { KitsuCard } from '../src/material/KitsuCard';
import { KitsuCardRotation } from '../src/material/KitsuCardRotation';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { RuleId } from '../src/rules/RuleId';
import { SelectKatanaTargetRule } from '../src/rules/SelectKatanaTargetRule';
import { create2PlayersGameBuilderWithPlayedCards } from './utils/MaterialGameTestUtils';

describe('SelectKatanaTarget rule tests', () => {

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Katana_1]
            }],
            givenActivePlayer: 2,
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1]
            }],
            givenActivePlayer: 1,
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: []
            }],
            givenActivePlayer: 1,
        },
    ])('Given no numeral cards already played and not all cards in trick have been played, onRuleStart() should ' +
        'return an array consisting only of a start player turn rule move', ({
                                                                                 givenPlayedCards,
                                                                                 givenActivePlayer
                                                                             }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);
        const previousRuleMove: StartRule<RuleId> = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartRule,
            id: RuleId.SelectKatanaTarget
        };
        const nextPlayer = givenActivePlayer === 1 ? 2 : 1;

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toEqual(consequences[0]);
        expect(ruleMoves[0].id).toEqual(RuleId.PlayKitsuCard);
        expect(ruleMoves[0].player).toEqual(nextPlayer);
    });

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Katana_1, KitsuCard.WhiteKitsune_2]
            }],
            givenActivePlayer: 2,
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.WhiteKitsune_1, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1, KitsuCard.Katana_1]
            }],
            givenActivePlayer: 1,
        },
    ])('Given no numeral cards already played and all cards in trick have been played, onRuleStart() should ' +
        'return an array consisting only of a start EndOfTrickMoveKitsunePawn rule move for the next player', ({
                                                                                                                   givenPlayedCards,
                                                                                                                   givenActivePlayer
                                                                                                               }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);
        const previousRuleMove: StartRule<RuleId> = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartRule,
            id: RuleId.SelectKatanaTarget
        };
        const nextPlayer = givenActivePlayer === 1 ? 2 : 1;

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toEqual(consequences[0]);
        expect(ruleMoves[0].id).toEqual(RuleId.EndOfTrickKistunePawnMove);
        expect(ruleMoves[0].player).toEqual(nextPlayer);
    });

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Yako6]
            }],
            givenActivePlayer: 1,
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko4]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Katana_1]
            }],
            givenActivePlayer: 2,
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko6, KitsuCard.Zenko5]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Yako4, KitsuCard.Katana_2]
            }],
            givenActivePlayer: 1,
        },
    ])('Given numeral cards already played, onRuleStart() should return an empty array ', ({
                                                                                               givenPlayedCards,
                                                                                               givenActivePlayer
                                                                                           }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);
        const previousRuleMove: StartRule<RuleId> = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartRule,
            id: RuleId.SelectKatanaTarget
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);

        // Then
        expect(consequences).toHaveLength(0);
    });

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko4, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Yako2_2, KitsuCard.Yako5]
            }],
            givenActivePlayer: 1,
            expectedCardIds: [KitsuCard.Yako2_2, KitsuCard.Yako5]
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Katana_1]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1, KitsuCard.Zenko2_2]
            }],
            givenActivePlayer: 1,
            expectedCardIds: [KitsuCard.Zenko2_2]
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko4]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.WhiteKitsune_1]
            }],
            givenActivePlayer: 2,
            expectedCardIds: [KitsuCard.Zenko4]
        },
    ])('getPlayerMoves() should return an array of moves with all the numeral cards already in the PlayedKitsuCard' +
        ' location, changing their location to KistuCardRotation.FaceDown', ({
                                                                                 givenPlayedCards,
                                                                                 givenActivePlayer,
                                                                                 expectedCardIds
                                                                             }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);

        // When
        const allowedMoves = rule.getPlayerMoves();
        const allowedCardIds = allowedMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard))
            .map(move => {
                const cardIndex = move.itemIndex;
                return game.items[MaterialType.KitsuCard]![cardIndex].id;
            });

        // Then
        expect(allowedMoves).toHaveLength(expectedCardIds.length);
        expect(allowedCardIds).toEqual(expect.arrayContaining(expectedCardIds));
    });

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko2_2, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Yako6]
            }],
            givenActivePlayer: 1,
            givenRotatedCardId: KitsuCard.Yako6
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko4]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Katana_1]
            }],
            givenActivePlayer: 2,
            givenRotatedCardId: KitsuCard.Zenko4
        },
    ])('Given a move to rotate face down one of the played cards and not all cards played, afterItemMove() should' +
        ' return an array containing only a rule move to start the PlayKitsuCard rule for the next player', ({
                                                                                                                 givenPlayedCards,
                                                                                                                 givenActivePlayer,
                                                                                                                 givenRotatedCardId
                                                                                                             }) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);
        const itemMove: MoveItem<number, MaterialType, LocationType> = {
            kind: MoveKind.ItemMove,
            type: ItemMoveType.Move,
            itemType: MaterialType.KitsuCard,
            itemIndex: game.items[MaterialType.KitsuCard]!.findIndex(card => card.id === givenRotatedCardId),
            location: {
                type: LocationType.PlayedKitsuCardSpot,
                player: givenActivePlayer,
                rotation: KitsuCardRotation.FaceDown
            }
        };

        // When
        const consequences = rule.afterItemMove(itemMove);
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toEqual(consequences[0]);
        expect(ruleMoves[0].id).toEqual(RuleId.PlayKitsuCard);
        expect(ruleMoves[0].player).toEqual(givenActivePlayer === 1 ? 2 : 1);
    });

    test.each([
        {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Zenko4, KitsuCard.Katana_2]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.Yako2_2, KitsuCard.Yako5]
            }],
            givenActivePlayer: 1,
            givenRotatedCardId: KitsuCard.Zenko4
        }, {
            givenPlayedCards: [{
                player: 1 as 1 | 2,
                playedCardIds: [KitsuCard.Yako3_1, KitsuCard.Katana_1]
            }, {
                player: 2 as 1 | 2,
                playedCardIds: [KitsuCard.BlackKitsune_1, KitsuCard.Zenko2_2]
            }],
            givenActivePlayer: 1,
            givenRotatedCardId: KitsuCard.Zenko2_3
        }
    ])('Given a move to rotate face down one of the played cards played and players all played their cards for the ' +
        'trick, afterItemMove() should return an array containing only a rule move to start the EndOfTrickKitsunePawnMove' +
        ' rule for the next player', ({givenPlayedCards, givenActivePlayer, givenRotatedCardId}) => {
        // Given
        const gameBuilder = create2PlayersGameBuilderWithPlayedCards(givenPlayedCards);
        gameBuilder.setRule(RuleId.SelectKatanaTarget, givenActivePlayer);
        const game = gameBuilder.build();
        const rule = new SelectKatanaTargetRule(game);
        const itemMove: MoveItem<number, MaterialType, LocationType> = {
            kind: MoveKind.ItemMove,
            type: ItemMoveType.Move,
            itemType: MaterialType.KitsuCard,
            itemIndex: game.items[MaterialType.KitsuCard]!.findIndex(card => card.id === givenRotatedCardId),
            location: {
                type: LocationType.PlayedKitsuCardSpot,
                player: givenActivePlayer,
                rotation: KitsuCardRotation.FaceDown
            }
        };

        // When
        const consequences = rule.afterItemMove(itemMove);
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toEqual(consequences[0]);
        expect(ruleMoves[0].id).toEqual(RuleId.EndOfTrickKistunePawnMove);
        expect(ruleMoves[0].player).toEqual(givenActivePlayer === 1 ? 2 : 1);
    });
});