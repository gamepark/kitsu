import { Locator, MaterialContext } from "@gamepark/react-game";
import { Location } from "@gamepark/rules-api";
import { TeamColor } from "@gamepark/kitsu/TeamColor";
import { Memorize } from "@gamepark/kitsu/Memorize";

class SetupCardSpotLocator extends Locator {
    coordinates = { x: 0, y: 0 }
    getRotateZ(_location: Location<number, number>, context: MaterialContext<number, number, number>): number {
        const numberOfPlayers = context.rules.players.length;
        let rotation: number = 0;
        if (numberOfPlayers === 4) {
            const teamPlayer = context.rules.remind<TeamColor>(Memorize.Team, context.player);
            rotation = (teamPlayer === TeamColor.Zenko) ? -45 : 45;
        }
        return rotation;
    }
}

export const setupCardSpotLocator = new SetupCardSpotLocator();