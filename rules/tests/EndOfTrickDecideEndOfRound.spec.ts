import { isStartPlayerTurn, MoveKind, RuleMoveType, StartPlayerTurn } from '@gamepark/rules-api';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { EndOfTrickDecideEndOfRoundRule } from '../src/rules/EndOfTrickDecideEndOfRoundRule';
import { RuleId } from '../src/rules/RuleId';
import { TeamColor, teamColors } from '../src/TeamColor';
import { create2PlayersGameBuilder } from './utils/MaterialGameTestUtils';

describe('End of trick - decide end of round tests', () => {
    test.each([
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 0, [TeamColor.Yako]: 0}},
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 2, [TeamColor.Yako]: 5}},
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 3, [TeamColor.Yako]: 3}},
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 12, [TeamColor.Yako]: 11}},
    ])('Given no Kitsune Pawn on the Ultimate Wisdom spot, onRuleStart() shoudl return an array consisting of one ' +
        'rule move to start the EndOfTrickDiscardCards rule', ({givenKitsunePawnSpots}) => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.material(MaterialType.KitsunePawn).moveItems(pawn => ({
            ...pawn.location,
            id: pawn.id === 1 ? givenKitsunePawnSpots[TeamColor.Zenko] : givenKitsunePawnSpots[TeamColor.Yako]
        }));
        const game = gameBuilder.build();
        const rule = new EndOfTrickDecideEndOfRoundRule(game);
        const previousRuleMove: StartPlayerTurn = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartPlayerTurn,
            id: RuleId.EndOfTrickDecideEndOfRound,
            player: 1
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move))
            .map(move => move as StartPlayerTurn<number, RuleId>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0].id).toBe(RuleId.EndOfTrickDiscardCards);
    });

    test.each([
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 5, [TeamColor.Yako]: 13}},
        {givenKitsunePawnSpots: {[TeamColor.Zenko]: 13, [TeamColor.Yako]: 10}},
    ])('onRuleStart() should return an array consisting of one rule move to start RoundEnd rule', ({givenKitsunePawnSpots}) => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.material(MaterialType.KitsunePawn).moveItems(pawn => ({
            ...pawn.location,
            id: pawn.id === 1 ? givenKitsunePawnSpots[TeamColor.Zenko] : givenKitsunePawnSpots[TeamColor.Yako]
        }));
        const game = gameBuilder.build();
        teamColors.forEach(color => game.items[color]!.find(pawn => pawn.id === color)!.location = {
            type: LocationType.KitsunePawnSpotOnWisdomBoard,
            id: givenKitsunePawnSpots[color],
        });
        const rule = new EndOfTrickDecideEndOfRoundRule(game);
        const previousRuleMove: StartPlayerTurn = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartPlayerTurn,
            id: RuleId.EndOfTrickDecideEndOfRound,
            player: 1
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(move => isStartPlayerTurn<number, MaterialType, LocationType>(move))
            .map(move => move as StartPlayerTurn<number, RuleId>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0].id).toBe(RuleId.RoundEnd);
    });
});