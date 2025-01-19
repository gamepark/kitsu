import { KitsuSetup } from "../src";
import { TeamColor } from "../src/TeamColor";
import { MaterialType } from "../src/material/MaterialType";
import { LocationType } from "../src/material/LocationType";
import { getEnumValues } from "@gamepark/rules-api";
import { KitsuCard, last24PlayersKitsuCardId } from "../src/material/KitsuCard";
import { KitsunePawn } from "../src/material/KitsunePawn";

describe('Setup tests', () => {
    describe('Given a 2-player setup', () => {
        test.each([
            {options: {players: [{team: TeamColor.Zenko, id: 1}, {team: TeamColor.Yako, id: 2}]}, expected: [1, 2]},
            {options: {players: [{team: TeamColor.Zenko, id: 2}, {team: TeamColor.Yako, id: 1}]}, expected: [2, 1]},
            {options: {players: [{team: TeamColor.Yako, id: 1}, {team: TeamColor.Zenko, id: 2}]}, expected: [1, 2]},
            {options: {players: [{team: TeamColor.Yako, id: 2},  {team: TeamColor.Zenko, id: 1}]}, expected: [2, 1]},
        ])('KistuSetup.setupNewMaterial({players: [$options.players.0, $options.players.1}) should reorder the players according to teams : $expected', ({options, expected}) => {
            // Given
            const setup = new KitsuSetup();

            // When
            setup.setupMaterial(options);

            // Then
            expect(setup.players).toHaveLength(2);
            expect(setup.players).toEqual(expected);
        });

        test('KitsuSetup.setupNewMaterial() should create one Kitsune Pawn for each team and place them on the first spot of the wisdom track', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Zenko, id: 1},
                    {team: TeamColor.Yako, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const kitsunePawns = setup.material(MaterialType.KitsunePawn).location(LocationType.KitsunePawnSpotOnWisdomBoard).getItems();

            // Then
            expect(kitsunePawns).toHaveLength(2);
            expect(kitsunePawns.every((pawn) => pawn.location.id === 0)).toEqual(true);
            expect(kitsunePawns.map(pawn => pawn.id)).toEqual(expect.arrayContaining(getEnumValues(KitsunePawn)));
        });

        test('KitsuSetup.setupMaterial() should create the 24 Kitsu cards in the Deck location', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Zenko, id: 1},
                    {team: TeamColor.Yako, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const kitsuCardItems = setup.material(MaterialType.KitsuCard).getItems();
            const kitsuCardIds = kitsuCardItems.map(kitsuCard => kitsuCard.id);

            // Then
            expect(kitsuCardItems).toHaveLength(24);
            expect(kitsuCardItems.every(item => item.location.type === LocationType.KitsuCardDeckSpotOnWisdomBoard)).toBe(true);
            expect(kitsuCardIds).toEqual(getEnumValues(KitsuCard).slice(0, last24PlayersKitsuCardId));
        });

        test('KitsuSetup.setupMaterial() should create the 5 power tokens and place them in the corresponding spots', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Zenko, id: 1},
                    {team: TeamColor.Yako, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const powerTokens = setup.material(MaterialType.PowerToken).getItems();

            // Then
            expect(powerTokens).toHaveLength(5);
            expect(powerTokens.every(powerToken => powerToken.location.type === LocationType.PowerTokenSpotOnWisdomBoard && powerToken.id === powerToken.location.id)).toBe(true);
        });
    });

    describe('Given a 4-player setup', () => {
        test.each([
            {options: {players: [
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Yako, id: 3},
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Zenko, id: 2}
                    ]}, expected: [1, 4, 3, 2]},
            {options: {players: [
                        {team: TeamColor.Yako, id: 3},
                        {team: TeamColor.Zenko, id: 1},
                        {team: TeamColor.Yako, id: 4},
                        {team: TeamColor.Zenko, id: 2}
                    ]}, expected: [3, 1, 4, 2]},
            {options: {players: [
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Zenko, id: 2},
                        {team: TeamColor.Yako, id: 4}
                    ]}, expected: [1, 3, 4, 2]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 2},
                        {team: TeamColor.Yako, id: 4},
                        {team: TeamColor.Zenko, id: 1},
                        {team: TeamColor.Yako, id: 3}
                    ]}, expected: [2, 4, 1, 3]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Yako, id: 4},
                        {team: TeamColor.Zenko, id: 2}
                    ]}, expected: [3, 1, 2, 4]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Zenko, id: 1},
                        {team: TeamColor.Yako, id: 3},
                        {team: TeamColor.Yako, id: 2}
                    ]}, expected: [4, 3, 1, 2]},
        ])('KistuSetup.setupNewMaterial({players: [$options.players.0, $options.players.1, $options.players.2, $options.players.3}) should reorder the players according to teams : $expected', ({options, expected}) => {
            // Given
            const setup = new KitsuSetup();

            // When
            setup.setupMaterial(options);

            // Then
            expect(setup.players).toHaveLength(4);
            expect(setup.players).toEqual(expected);
        });

        test('KitsuSetup.setupNewMaterial() should create one Kitsune Pawn for each team and place them on the first spot of the wisdom track', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Yako, id: 1},
                    {team: TeamColor.Yako, id: 3},
                    {team: TeamColor.Zenko, id: 4},
                    {team: TeamColor.Zenko, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const kitsunePawns = setup.material(MaterialType.KitsunePawn).location(LocationType.KitsunePawnSpotOnWisdomBoard).getItems();

            // Then
            expect(kitsunePawns).toHaveLength(2);
            expect(kitsunePawns.every((pawn) => pawn.location.id === 0)).toEqual(true);
            expect(kitsunePawns.map(pawn => pawn.id)).toEqual(expect.arrayContaining(getEnumValues(KitsunePawn)));
        });

        test('KitsuSetup.setupMaterial() should create the 24 Kitsu cards in the Deck location', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Yako, id: 1},
                    {team: TeamColor.Yako, id: 3},
                    {team: TeamColor.Zenko, id: 4},
                    {team: TeamColor.Zenko, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const kitsuCardItems = setup.material(MaterialType.KitsuCard).getItems();
            const kitsuCardIds = kitsuCardItems.map(kitsuCard => kitsuCard.id);

            // Then
            expect(kitsuCardItems).toHaveLength(24);
            expect(kitsuCardItems.every(item => item.location.type === LocationType.KitsuCardDeckSpotOnWisdomBoard)).toBe(true);
            expect(kitsuCardIds).toEqual(getEnumValues(KitsuCard).slice(0, last24PlayersKitsuCardId));
        });

        test('KitsuSetup.setupMaterial() should create the 5 power tokens and place them in the corresponding spots', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Yako, id: 1},
                    {team: TeamColor.Yako, id: 3},
                    {team: TeamColor.Zenko, id: 4},
                    {team: TeamColor.Zenko, id: 2}
                ]
            };

            // When
            setup.setupMaterial(options);
            const powerTokens = setup.material(MaterialType.PowerToken).getItems();

            // Then
            expect(powerTokens).toHaveLength(5);
            expect(powerTokens.every(powerToken => powerToken.location.type === LocationType.PowerTokenSpotOnWisdomBoard && powerToken.id === powerToken.location.id)).toBe(true);
        });
    });

    describe('Given a 6-player setup', () => {
        test.each([
            {options: {players: [
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Yako, id: 4},
                        {team: TeamColor.Yako, id: 2},
                        {team: TeamColor.Zenko, id: 5},
                        {team: TeamColor.Zenko, id: 6}
                    ]}, expected: [3, 1, 5, 4, 6, 2]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 5},
                        {team: TeamColor.Zenko, id: 1},
                        {team: TeamColor.Yako, id: 3},
                        {team: TeamColor.Yako, id: 2},
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Yako, id: 6}
                    ]}, expected: [5, 3, 1, 2, 4, 6]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 1},
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Yako, id: 6},
                        {team: TeamColor.Yako, id: 2},
                        {team: TeamColor.Yako, id: 5}
                    ]}, expected: [1, 6, 4, 2, 3, 5]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 2},
                        {team: TeamColor.Yako, id: 5},
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Zenko, id: 6},
                        {team: TeamColor.Yako, id: 4}
                    ]}, expected: [2, 5, 3, 1, 6, 4]},
            {options: {players: [
                        {team: TeamColor.Yako, id: 3},
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Yako, id: 2},
                        {team: TeamColor.Zenko, id: 5},
                        {team: TeamColor.Zenko, id: 6}
                    ]}, expected: [3, 4, 1, 5, 2, 6]},
            {options: {players: [
                        {team: TeamColor.Zenko, id: 3},
                        {team: TeamColor.Yako, id: 1},
                        {team: TeamColor.Zenko, id: 4},
                        {team: TeamColor.Yako, id: 2},
                        {team: TeamColor.Yako, id: 5},
                        {team: TeamColor.Zenko, id: 6}
                    ]}, expected: [3, 1, 4, 2, 6, 5]},
        ])('KistuSetup.setupNewMaterial({players: [$options.players.0, $options.players.1, $options.players.2, $options.players.3, $options.players.4, $options.players.5}) should reorder the players according to teams : $expected', ({options, expected}) => {
            // Given
            const setup = new KitsuSetup();

            // When
            setup.setupMaterial(options);

            // Then
            expect(setup.players).toHaveLength(6);
            expect(setup.players).toEqual(expected);
        });

        test('KitsuSetup.setupMaterial() should create the 30 Kitsu cards in the Deck location', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Zenko, id: 3},
                    {team: TeamColor.Yako, id: 1},
                    {team: TeamColor.Yako, id: 4},
                    {team: TeamColor.Yako, id: 2},
                    {team: TeamColor.Zenko, id: 5},
                    {team: TeamColor.Zenko, id: 6}
                ]
            };

            // When
            setup.setupMaterial(options);
            const kitsuCardItems = setup.material(MaterialType.KitsuCard).getItems();
            const kitsuCardIds = kitsuCardItems.map(kitsuCard => kitsuCard.id);

            // Then
            expect(kitsuCardItems).toHaveLength(30);
            expect(kitsuCardItems.every(item => item.location.type === LocationType.KitsuCardDeckSpotOnWisdomBoard)).toBe(true);
            expect(kitsuCardIds).toEqual(getEnumValues(KitsuCard));
        });

        test('KitsuSetup.setupMaterial() should create the 5 power tokens and place them in the corresponding spots', () => {
            // Given
            const setup = new KitsuSetup();
            const options = {
                players : [
                    {team: TeamColor.Zenko, id: 3},
                    {team: TeamColor.Yako, id: 1},
                    {team: TeamColor.Yako, id: 4},
                    {team: TeamColor.Yako, id: 2},
                    {team: TeamColor.Zenko, id: 5},
                    {team: TeamColor.Zenko, id: 6}
                ]
            };

            // When
            setup.setupMaterial(options);
            const powerTokens = setup.material(MaterialType.PowerToken).getItems();

            // Then
            expect(powerTokens).toHaveLength(5);
            expect(powerTokens.every(powerToken => powerToken.location.type === LocationType.PowerTokenSpotOnWisdomBoard && powerToken.id === powerToken.location.id)).toBe(true);
        });
    });
});