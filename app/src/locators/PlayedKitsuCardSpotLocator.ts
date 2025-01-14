import { getRelativePlayerIndex, Locator, MaterialContext } from "@gamepark/react-game";
import { GameTableRadius } from "./ClanCardSpotLocator";
import { Coordinates, Location } from "@gamepark/rules-api";

class PlayedKitsuCardSpotLocator extends Locator {
    getCoordinates(location: Location<number, number>, context: MaterialContext<number, number, number>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        return {
            x: (GameTableRadius+4) * Math.sin(- Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
            y: (GameTableRadius+4) * Math.cos(- Math.PI * getRelativePlayerIndex(context, location.player) / numberOfSectors),
        };
    }
    getRotateZ(location: Location<number, number>, context: MaterialContext<number, number, number>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;

        return 90 - (180 * getRelativePlayerIndex(context, location.player) / numberOfSectors);
    }
}

export const playedKitsuCardSpotLocator = new PlayedKitsuCardSpotLocator();