import { hideToTOthersWhenRotatedFaceDown } from '../src/material/HideToTOthersWhenRotatedFaceDown';
import { KitsuCard } from '../src/material/KitsuCard';
import { KitsuCardRotation } from '../src/material/KitsuCardRotation';
import { LocationType } from '../src/material/LocationType';

describe('HideToOthersWhenRotatedFaceDown strategy tests', () => {
    test.each([
        {
            givenItem: {
                id: KitsuCard.Yako3_1,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 1,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 1
        }, {
            givenItem: {
                id: KitsuCard.Yako1_2,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 2,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 2
        }, {
            givenItem: {
                id: KitsuCard.Zenko4,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 1,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 1
        },
    ])('given a face down Kitsu card owned by the player, hideToOthersWhenRotatedFaceDown should return an empty array', ({
                                                                                                                    givenItem,
                                                                                                                    givenPlayer
                                                                                                                }) => {
        // When
        const hiddenProperties = hideToTOthersWhenRotatedFaceDown(givenItem, givenPlayer);

        // Then
        expect(hiddenProperties).toHaveLength(0);
    });

    test.each([
        {
            givenItem: {
                id: KitsuCard.Yako3_1,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 2,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 1
        }, {
            givenItem: {
                id: KitsuCard.Yako1_2,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 2,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 1
        }, {
            givenItem: {
                id: KitsuCard.Zenko4,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 1,
                    rotation: KitsuCardRotation.FaceDown
                },
            }, givenPlayer: 2
        },
    ])("Given a face down Kitsu card owner by another player, hideToToOthersWhenRotatedFaceDown should return an array containing only the 'id' string", ({givenItem, givenPlayer}) => {
        // When
        const hiddenProperties = hideToTOthersWhenRotatedFaceDown(givenItem, givenPlayer);

        // Then
        expect(hiddenProperties).toHaveLength(1);
        expect(hiddenProperties).toContain('id');
    });

    test.each([
        {
            givenItem: {
                id: KitsuCard.Yako3_1,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 2,
                    rotation: KitsuCardRotation.FaceUp
                },
            }, givenPlayer: 1
        }, {
            givenItem: {
                id: KitsuCard.Yako1_2,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 2,
                    rotation: KitsuCardRotation.FaceUp
                },
            }, givenPlayer: 2
        }, {
            givenItem: {
                id: KitsuCard.Zenko4,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 1,
                    rotation: KitsuCardRotation.FaceUp
                },
            }, givenPlayer: 2
        }, {
            givenItem: {
                id: KitsuCard.Zenko4,
                location: {
                    type: LocationType.PlayedKitsuCardSpot,
                    player: 1,
                    rotation: KitsuCardRotation.FaceUp
                },
            }, givenPlayer: 1
        },
    ])("Given a face up Kitsu card owned by anyone, hideToOthersWhenRotatedFaceDown should return an empty array", ({givenItem, givenPlayer}) => {
        // When
        const hiddenProperties = hideToTOthersWhenRotatedFaceDown(givenItem, givenPlayer);

        // Then
        expect(hiddenProperties).toHaveLength(0);
    })
});