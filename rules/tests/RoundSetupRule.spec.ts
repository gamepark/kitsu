import { TeamColor, teamColors } from "../src/TeamColor";
import { RoundSetupRule } from "../src/rules/RoundSetupRule";
import {
    isMoveItemType,
    isShuffleItemType,
    isStartPlayerTurn,
    MaterialGame,
    MaterialItem,
    MoveItem,
    MoveKind,
    RuleMoveType,
    Shuffle,
    StartPlayerTurn,
} from "@gamepark/rules-api";
import { RuleId } from "../src/rules/RuleId";
import { MaterialType } from "../src/material/MaterialType";
import { LocationType } from "../src/material/LocationType";
import { Memorize } from "../src/Memorize";
import { KitsuCard, kitsuCardIds } from "../src/material/KitsuCard";

const createKitsuCardItems = (playersNumber: 2 | 4 | 6): MaterialItem<number, LocationType, KitsuCard>[] => kitsuCardIds.slice(0, playersNumber === 6 ? 30 : 24).map((id, index) => ({
    id: id,
    location: {
        type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
        x: index
    },
}));

const create2PlayersGameState = (): MaterialGame<number, MaterialType, LocationType> => ({
    players: [1, 2],
    memory: {
        [Memorize.Team]: {
            1: TeamColor.Yako,
            2: TeamColor.Zenko,
        }
    },
    items: {
        [MaterialType.KitsuCard]: createKitsuCardItems(2),
        [MaterialType.LeaderToken]: [{
            location: {
                type: LocationType.LeaderTokenSpotOnClanCard,
                player: 1
            }
        }],
        [MaterialType.KitsunePawn]: teamColors.map(kitsunePawnId => ({
            id: kitsunePawnId,
            location: {
                type: LocationType.KitsunePawnSpotOnWisdomBoard,
                id: 0
            }
        })),
    },
    rule: {
        id: RuleId.RoundSetup,
        player: 1,
    }
});



describe('Round setup rule tests', () => {
    describe('Given a game with 2 players', () => {
        test('onRuleStart() should return an array of moves with the first item being a shuffle move of 24 cards', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetup, kind: MoveKind.RulesMove});
            const shuffleMove = moves[0];

            // Then
            expect(isShuffleItemType(MaterialType.KitsuCard)(shuffleMove)).toBe(true);
            expect((shuffleMove as Shuffle).indexes).toHaveLength(24);
        });

        test('onRuleStart() should return an array of moves containing two moves of KitsuneToken to LocationType.KistunePawnSpotOnWisdomBoard and id 0', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetup, kind: MoveKind.RulesMove})
            const kitsuneTokenMoves = moves.filter(move => isMoveItemType(MaterialType.KitsunePawn)(move))
                .map(move => move as MoveItem);

            // Then
            expect(kitsuneTokenMoves).toHaveLength(2);
            expect(kitsuneTokenMoves.every(move => move.location.type === LocationType.KitsunePawnSpotOnWisdomBoard && move.location.id === 0)).toBe(true);
        });

        test('onRuleStart() should return an array of moves containing 12 deal KitsuCard moves, 6 for each player, each player being alternated', () => {
            // Given
            const gameState = create2PlayersGameState();
            const roundSetupRule = new RoundSetupRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetup, kind: MoveKind.RulesMove})
            const dealCardMoves = moves.filter(move => isMoveItemType(MaterialType.KitsuCard)(move)
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
            const roundSetupRule = new RoundSetupRule(gameState);

            // When
            const moves = roundSetupRule.onRuleStart({type: RuleMoveType.StartPlayerTurn, player: 1, id: RuleId.RoundSetup, kind: MoveKind.RulesMove})
            const ruleMoves = moves.filter(move => isStartPlayerTurn(move)).map(move => move as StartPlayerTurn);

            // Expect
            expect(ruleMoves).toHaveLength(1);
            expect(moves.indexOf(ruleMoves[0])).toBe(moves.length - 1);
            expect(ruleMoves[0].id).toBe(RuleId.PlayKitsuCard);
            expect(ruleMoves[0].player).toBe(1);
        });
    });
});