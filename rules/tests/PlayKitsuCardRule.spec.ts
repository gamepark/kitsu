import {
    isMoveItemType,
    ItemMoveType,
    MaterialGame,
    MoveItem,
    MoveKind,
    RuleMoveType,
    StartPlayerTurn,
} from "@gamepark/rules-api";
import { MaterialType } from "../src/material/MaterialType";
import { LocationType } from "../src/material/LocationType";
import { KitsuCard, kitsuCardIds } from "../src/material/KitsuCard";
import { Memorize } from "../src/Memorize";
import { TeamColor, teamColors } from "../src/TeamColor";
import { RuleId } from "../src/rules/RuleId";
import { PlayKitsuCardRule } from "../src/rules/PlayKitsuCardRule";

const create2PlayersGameState = (): MaterialGame<number, MaterialType, LocationType> => ({
    players: [2, 1],
    memory: {
        [Memorize.Team]: {
            1: TeamColor.Zenko,
            2: TeamColor.Yako,
        },
    },
    items: {
        [MaterialType.KitsuCard]: kitsuCardIds.map((cardId, index) => ({
            id: cardId,
            location: {
                type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
                x: index
            }
        })),
        [MaterialType.KitsunePawn]: teamColors.map((colorId) => ({
            id: colorId,
            location: {
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 0,
            }
        })),
        [MaterialType.LeaderToken]: [{
            location: {
                type: LocationType.LeaderTokenSpotOnClanCard,
                player: 1
            }
        }],
    },
    rule: {
        id: RuleId.PlayKitsuCard,
        player: 1,
    }
})

const create2PlayersGameStateWithCardsInPLayerHand = (player: 1 | 2, cardIds: KitsuCard[]): MaterialGame<number, MaterialType, LocationType> => {
    const game = create2PlayersGameState();
    cardIds.forEach((cardId) => {
        game.items[MaterialType.KitsuCard]!.find(card => card.id === cardId)!.location = {
            type: LocationType.PlayerHand,
            player: player,
        };
    });
    return game;
}

describe('PlayKitsuCardRule tests', () => {
    describe('2 players tests', () => {
        test.each([
            {givenCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1], expectedCardIds: [KitsuCard.Yako1_1, KitsuCard.Zenko2_1, KitsuCard.Zenko4, KitsuCard.WhiteKitsune_1, KitsuCard.Yako3_1, KitsuCard.Zenko1_1], expectedNumberOfMoves: 6},
            {givenCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1], expectedCardIds: [KitsuCard.Yako1_2, KitsuCard.Yako6, KitsuCard.Yako3_1, KitsuCard.Zenko5, KitsuCard.Zenko1_1], expectedNumberOfMoves: 5},
            {givenCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko6, KitsuCard.Zenko4, KitsuCard.Katana_2], expectedCardIds: [KitsuCard.Yako2_1, KitsuCard.Zenko6, KitsuCard.Zenko4, KitsuCard.Katana_2], expectedNumberOfMoves: 4},
            {givenCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Zenko1_1, KitsuCard.Yako3_1], expectedCardIds: [KitsuCard.WhiteKitsune_2, KitsuCard.Zenko1_1, KitsuCard.Yako3_1], expectedNumberOfMoves: 3},
            {givenCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1], expectedCardIds: [KitsuCard.Yako6, KitsuCard.Katana_1], expectedNumberOfMoves: 2},
            {givenCardIds: [KitsuCard.BlackKitsune_1], expectedCardIds: [KitsuCard.BlackKitsune_1], expectedNumberOfMoves: 1},
        ])('getPlayerMoves() should return an array with a move for each card in the player\'s hand to the corresponding PlayerCard location', ({givenCardIds, expectedCardIds, expectedNumberOfMoves}) => {
            // Given
            const game = create2PlayersGameStateWithCardsInPLayerHand(1, givenCardIds);
            const rule = new PlayKitsuCardRule(game);

            // When
            const moves = rule.getPlayerMoves();

            // Then
            expect(moves).toHaveLength(expectedNumberOfMoves);
            expect(moves.every(move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move))).toBe(true);
            expect(moves.every(move => (move as MoveItem<number, MaterialType, LocationType>).location.type === LocationType.PlayedKitsuCardSpot)).toBe(true)
            expect(moves.every(move => (move as MoveItem<number, MaterialType, LocationType>).location.player === 1)).toBe(true);
            expect(moves.map(move => game.items[MaterialType.KitsuCard]![(move as MoveItem<number, MaterialType, LocationType>).itemIndex].id))
                .toEqual(expect.arrayContaining(expectedCardIds));
        });

        test.each([
            {
                alreadyPlayedCards: [{player: 1, cards: [] as KitsuCard[]}, {player: 2, cards: [] as KitsuCard[]}],
                move: {
                    kind: MoveKind.ItemMove,
                    type: ItemMoveType.Move,
                    itemType: MaterialType.KitsuCard,
                    itemIndex: 0,
                    location: {type: LocationType.PlayedKitsuCardSpot, player: 1}
                } as MoveItem<number, MaterialType, LocationType>,
                expectedConsequence: {
                    kind: MoveKind.RulesMove,
                    type: RuleMoveType.StartPlayerTurn,
                    id: RuleId.PlayKitsuCard,
                    player: 2
                } as StartPlayerTurn<number, RuleId>,
            },
            {
                alreadyPlayedCards: [{player: 1, cards: [] as KitsuCard[]}, {player: 2, cards: [KitsuCard.Yako4] as KitsuCard[]}],
                move: {
                    kind: MoveKind.ItemMove,
                    type: ItemMoveType.Move,
                    itemType: MaterialType.KitsuCard,
                    itemIndex: 0,
                    location: {type: LocationType.PlayedKitsuCardSpot, player: 1}
                } as MoveItem<number, MaterialType, LocationType>,
                expectedConsequence: {
                    kind: MoveKind.RulesMove,
                    type: RuleMoveType.StartPlayerTurn,
                    id: RuleId.PlayKitsuCard,
                    player: 2
                } as StartPlayerTurn<number, RuleId>,
            },
            {
                alreadyPlayedCards: [{player: 1, cards: [KitsuCard.Zenko6] as KitsuCard[]}, {player: 2, cards: [KitsuCard.Yako5] as KitsuCard[]}],
                move: {
                    kind: MoveKind.ItemMove,
                    type: ItemMoveType.Move,
                    itemType: MaterialType.KitsuCard,
                    itemIndex: 0,
                    location: {type: LocationType.PlayedKitsuCardSpot, player: 1}
                } as MoveItem<number, MaterialType, LocationType>,
                expectedConsequence: {
                    kind: MoveKind.RulesMove,
                    type: RuleMoveType.StartPlayerTurn,
                    id: RuleId.PlayKitsuCard,
                    player: 2
                } as StartPlayerTurn<number, RuleId>,
            },
        ])('Given 0, 1 or 2 cards already played, afterItemMove() should return consequence containing only a rule move for the next player', ({alreadyPlayedCards, move, expectedConsequence}) => {
            // Given
            const game = create2PlayersGameState();
            alreadyPlayedCards.forEach(item => {
                item.cards.forEach((cardId) => {
                    game.items[MaterialType.KitsuCard]!.find(card => card.id === cardId)!.location = {
                        type: LocationType.PlayedKitsuCardSpot,
                        player: item.player
                    };
                });
            });
            const rule = new PlayKitsuCardRule(game);

            // When
            const consequences = rule.afterItemMove(move);

            // Then
            expect(consequences.length).toHaveLength(1);
            expect(consequences[0]).toBe(expectedConsequence);
        });

        test('Given 3 cards already played, afterItemMove() should return consequences containing only a rule move for the end of trick rule', () => {
            // Given
            const game = create2PlayersGameState();
            [{player: 1, cards: [KitsuCard.Yako5] as KitsuCard[]}, {player: 2, cards: [KitsuCard.Zenko4, KitsuCard.Yako2_1] as KitsuCard[]}].forEach(item => {
                item.cards.forEach((cardId) => {
                    game.items[MaterialType.KitsuCard]!.find(card => card.id === cardId)!.location = {
                        type: LocationType.PlayedKitsuCardSpot,
                        player: item.player
                    };
                });
            });
            const rule = new PlayKitsuCardRule(game);
            const itemMove: MoveItem<number, MaterialType, LocationType> = {
                kind: MoveKind.ItemMove,
                type: ItemMoveType.Move,
                itemType: MaterialType.KitsuCard,
                itemIndex: 0,
                location: {type: LocationType.PlayedKitsuCardSpot, player: 1}
            };

            // When
            const consequences = rule.afterItemMove(itemMove);

            // Then
            expect(consequences.length).toHaveLength(1);
            expect(consequences[0]).toBe({
                kind: MoveKind.RulesMove,
                type: RuleMoveType.StartRule,
                id: RuleId.EndOfTrickDiscardCardsAndMoveKitsunePawn
            });


        });

        test('given an invalid move, afterItemMove() should return an empty array',() => {
            // Given
            const game = create2PlayersGameState();
            const rule = new PlayKitsuCardRule(game);
            const invalidMove: MoveItem<number, MaterialType, LocationType> = {
                kind: MoveKind.ItemMove,
                type: ItemMoveType.Move,
                itemIndex: 0,
                itemType: MaterialType.KitsuCard,
                location: {type: LocationType.PlayerHand, player: 2}
            }

            // When
            const consequences = rule.afterItemMove(invalidMove);

            // Then
            expect(consequences.length).toHaveLength(0);
        });
    });


});