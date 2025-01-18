import { getRelativePlayerIndex, HandLocator, MaterialContext } from "@gamepark/react-game";
import { Coordinates, Location } from "@gamepark/rules-api";
import { RADIUS } from "./Radius";

const LOCATOR_RADIUS = RADIUS + 8;

class PlayerHandLocator extends HandLocator {
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

        return 90 - (180 * getRelativePlayerIndex(context, location.player) / numberOfSectors);
    }
    radius = 100
    baseAngle = 0
    maxAngle = 15
    gapMaxAngle = 3
    clockwise = true
}

export const playerHandLocator = new PlayerHandLocator();