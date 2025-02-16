import {
    isMoveItemType,
    isStartPlayerTurn,
    ItemMoveType,
    MoveItem,
    MoveKind,
    RuleMoveType,
    StartPlayerTurn
} from '@gamepark/rules-api';
import { LocationType } from '../src/material/LocationType';
import { MaterialType } from '../src/material/MaterialType';
import { powerToken, PowerToken } from '../src/material/PowerToken';
import { EndOfTrickPickAvailablePowerToken } from '../src/rules/EndOfTrickPickAvailablePowerToken';
import { RuleId } from '../src/rules/RuleId';
import { create2PlayersGameBuilder } from './utils/MaterialGameTestUtils';

describe('End fo trick - pick available power token tests', () => {
    test('Given team doesn\'t already have a power token, onRuleStart() should return an empty array', () => {
        //Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.setRule(RuleId.EndOfTrickPickAvailablePowerToken, 1);
        const game = gameBuilder.build();
        const rule = new EndOfTrickPickAvailablePowerToken(game);
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartPlayerTurn,
            id: RuleId.EndOfTrickPickAvailablePowerToken,
            player: 2
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);

        //Then
        expect(consequences).toHaveLength(0);
    });

    test.each([
        {
            givenPlayerWithPowerToken: 1 as (1 | 2),
            givenPlayerToken: PowerToken.ColourExchange,
        }, {
            givenPlayerWithPowerToken: 2 as (1 | 2),
            givenPlayerToken: PowerToken.Protection,
        },
    ])('Given team already has a power token, onRuleStart() should return an array containing only a rule move to ' +
        'the EndOfTrickDiscardCards rule', ({givenPlayerWithPowerToken, givenPlayerToken}) => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.setRule(RuleId.EndOfTrickPickAvailablePowerToken, givenPlayerWithPowerToken);
        gameBuilder.material(MaterialType.PowerToken).id<PowerToken>(givenPlayerToken).moveItem({
            type: LocationType.PowerTokenSpotOnClanCard,
            player: givenPlayerWithPowerToken
        });
        const game = gameBuilder.build();
        const rule = new EndOfTrickPickAvailablePowerToken(game);
        const previousRuleMove: StartPlayerTurn<number, RuleId> = {
            kind: MoveKind.RulesMove,
            type: RuleMoveType.StartPlayerTurn,
            id: RuleId.EndOfTrickPickAvailablePowerToken,
            player: givenPlayerWithPowerToken
        };

        // When
        const consequences = rule.onRuleStart(previousRuleMove);
        const ruleMoves = consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>)
            .map(move => move as StartPlayerTurn<number, RuleId>);

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toBe(consequences[0]);
        expect(ruleMoves[0].player).toBe(1);
        expect(ruleMoves[0].id).toEqual(RuleId.EndOfTrickDiscardCards);
    });

    test.each([
        {givenAvailablePowerTokens: powerToken,},
        {givenAvailablePowerTokens: [PowerToken.NoAdvance, PowerToken.Protection, PowerToken.Plus3],},
        {givenAvailablePowerTokens: [PowerToken.Protection, PowerToken.PickDiscarded],},
        {givenAvailablePowerTokens: [PowerToken.ColourExchange],},
    ])('Given the available power tokens, getPlayerMoves() should return an array of move of each player ' +
        'token to each team\'s member clan card', ({givenAvailablePowerTokens}) => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.setRule(RuleId.EndOfTrickPickAvailablePowerToken, 1);
        gameBuilder.material(MaterialType.PowerToken)
            .id<PowerToken>(powerTokenId => !givenAvailablePowerTokens.includes(powerTokenId))
            .moveItems({
                type: LocationType.DiscardedPowerTokenAreaOnWisdomBoard
            });
        const game = gameBuilder.build();
        const rule = new EndOfTrickPickAvailablePowerToken(game);

        // When
        const legalMoves = rule.getPlayerMoves();
        const powerTokenMoves = legalMoves.filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken))
            .map(move => move as MoveItem<number, MaterialType, LocationType>);
        const powerTokenIdFromMoves = powerTokenMoves.map(move => game.items[MaterialType.PowerToken]![move.itemIndex].id);

        // Then
        expect(legalMoves).toHaveLength(givenAvailablePowerTokens.length);
        expect(powerTokenMoves).toHaveLength(givenAvailablePowerTokens.length);
        expect(powerTokenMoves.every(move => move.location.type === LocationType.PowerTokenSpotOnClanCard && move.location.player === 1)).toBe(true);
        expect(powerTokenIdFromMoves).toEqual(expect.arrayContaining(givenAvailablePowerTokens));
    });

    test('Given a power token move to a team member\'s clan card, afterItemMove() should return an array containing ' +
        'only a rule move to the EndOfTrickDiscardCards', () => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.setRule(RuleId.EndOfTrickPickAvailablePowerToken, 2);
        const game = gameBuilder.build();
        const rule = new EndOfTrickPickAvailablePowerToken(game);
        const previousItemMove: MoveItem<number, MaterialType, LocationType> = {
            kind: MoveKind.ItemMove,
            type: ItemMoveType.Move,
            itemType: MaterialType.PowerToken,
            itemIndex: 0,
            location: {
                type: LocationType.PowerTokenSpotOnClanCard,
                player: 2
            }
        };

        // When
        const consequences = rule.afterItemMove(previousItemMove);
        const ruleMoves =  consequences.filter(isStartPlayerTurn<number, MaterialType, LocationType>)
            .map(move => move as StartPlayerTurn<number, RuleId>)

        // Then
        expect(consequences).toHaveLength(1);
        expect(ruleMoves).toHaveLength(1);
        expect(ruleMoves[0]).toBe(consequences[0]);
        expect(ruleMoves[0].id).toEqual(RuleId.EndOfTrickDiscardCards);
        expect(ruleMoves[0].player).toBe(1);
    });

    test('Given an invalid move, afterItemMove() should return an array containing ' +
        'only a rule move to the EndOfTrickDiscardCards', () => {
        // Given
        const gameBuilder = create2PlayersGameBuilder();
        gameBuilder.setRule(RuleId.EndOfTrickPickAvailablePowerToken, 1);
        const game = gameBuilder.build();
        const rule = new EndOfTrickPickAvailablePowerToken(game);
        const previousItemMove: MoveItem<number, MaterialType, LocationType> = {
            kind: MoveKind.ItemMove,
            type: ItemMoveType.Move,
            itemType: MaterialType.PowerToken,
            itemIndex: 0,
            location: {
                type: LocationType.PowerTokenSpotOnClanCard,
                player: 2
            }
        };

        // When
        const consequences = rule.afterItemMove(previousItemMove);

        // Then
        expect(consequences).toHaveLength(0);
    })


});