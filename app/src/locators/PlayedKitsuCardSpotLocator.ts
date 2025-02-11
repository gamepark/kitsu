import { css } from '@emotion/react';
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import {
    DropAreaDescription,
    getRelativePlayerIndex,
    ItemContext,
    ListLocator,
    MaterialContext
} from '@gamepark/react-game';
import { Coordinates, Location, MaterialMove } from '@gamepark/rules-api';
import GenericCardFront from '../images/Cards/GenericCardFront.jpg';
import { RADIUS } from './Radius';

const LOCATOR_RADIUS = RADIUS - 11;

class PlayedKitsuCardSpotLocationDescription extends DropAreaDescription<number, MaterialType, LocationType, KitsuCard> {
    width = 6.3;
    height = 8.8;
    image = GenericCardFront;
    extraCss = css`
        opacity: 0.5;`;

    public canDrop(_move: MaterialMove<number, number, number>, _location: Location<number, LocationType, number, number>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        return context.rules.game.rule!.id !== RuleId.SelectKatanaTarget;
    }
}

class PlayedKitsuCardSpotLocator extends ListLocator<number, MaterialType, LocationType> {
    getCoordinates(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        return {
            x: LOCATOR_RADIUS * Math.sin(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
            y: LOCATOR_RADIUS * Math.cos(-Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
        };
    }

    getRotateZ(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;

        return 180 * getRelativePlayerIndex(context, location.player) / numberOfSectors;
    }

    getLocations(context: MaterialContext<number, MaterialType, LocationType>): Partial<Location<number, LocationType, number, number>>[] {
        return context.rules.players.map(player => ({type: LocationType.PlayedKitsuCardSpot, player: player}));
    }

    locationDescription = new PlayedKitsuCardSpotLocationDescription();
    gap = {x: 7};
}

export const playedKitsuCardSpotLocator = new PlayedKitsuCardSpotLocator();