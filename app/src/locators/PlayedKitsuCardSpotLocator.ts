import {
    DropAreaDescription,
    getRelativePlayerIndex,
    ListLocator,
    MaterialContext
} from "@gamepark/react-game";
import { Coordinates, Location } from "@gamepark/rules-api";
import { RADIUS } from "./Radius";
import GenericCardFront from "../images/Cards/GenericCardFront.jpg"
import { css } from "@emotion/react";
import { LocationType } from "@gamepark/kitsu/material/LocationType";

const LOCATOR_RADIUS = RADIUS - 11;

class PlayedKitsuCardSpotLocationDescription extends DropAreaDescription {
    width = 6.3
    height = 8.8
    image = GenericCardFront
    extraCss = css`
        opacity: 0.5;`
}

class PlayedKitsuCardSpotLocator extends ListLocator {
    getCoordinates(location: Location<number, number>, context: MaterialContext<number, number, number>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        return {
            x: LOCATOR_RADIUS * Math.sin(- Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
            y: LOCATOR_RADIUS * Math.cos(- Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
        };
    }

    getRotateZ(location: Location<number, number>, context: MaterialContext<number, number, number>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;

        return 180 * getRelativePlayerIndex(context, location.player) / numberOfSectors;
    }

    getLocations(context: MaterialContext<number, number, number>): Partial<Location<number, number>>[] {
        return context.rules.players.map(player => ({type: LocationType.PlayedKitsuCardSpot, player: player}))
    }

    locationDescription = new PlayedKitsuCardSpotLocationDescription()
    gap = { x: 7 }
}

export const playedKitsuCardSpotLocator = new PlayedKitsuCardSpotLocator();