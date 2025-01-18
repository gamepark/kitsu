import { Locator, MaterialContext } from "@gamepark/react-game";
import { Location } from "@gamepark/rules-api";
import { TeamColor } from "@gamepark/kitsu/TeamColor";
import { Memorize } from "@gamepark/kitsu/Memorize";

class SetupCardSpotLocator extends Locator {
    coordinates = { x: 0, y: 0 }
    getRotateZ(_location: Location<number, number>, context: MaterialContext<number, number, number>): number {
        const numberOfPlayers = context.rules.players.length;
        const playerPointOfView = (context.player === undefined) ? 1 : context.player;
        const teamPlayer = context.rules.remind<TeamColor>(Memorize.Team, playerPointOfView);
        let rotation: number = 0;
        if (numberOfPlayers === 4) {
            rotation += (teamPlayer === TeamColor.Zenko) ? 45 : -45;
        } else {
            rotation += (teamPlayer === TeamColor.Zenko) ? 0 : 180;
        }
        return rotation;
    }
}

export const setupCardSpotLocator = new SetupCardSpotLocator();