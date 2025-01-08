import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { clanCardDescription } from "./ClanCardDescription";
import { kitsuCardDescription } from "./KitsuCardDescription";
import { kitsunePawnDescription } from "./KitsunePawnDescription";
import { leaderTokenDescription } from "./LeaderTokenDescription";
import { powerTokenDescription } from "./PowerTokenDescription";
import { setupCardDescription } from "./SetupCardDescription";
import { victoryCardDescription } from "./VictoryCardDescription";
import { wisdomBoardDescription } from "./WisdomBoardDescription";

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
    [MaterialType.KitsuCard]: kitsuCardDescription,
    [MaterialType.ClanCard]: clanCardDescription,
    [MaterialType.KitsunePawn]: kitsunePawnDescription,
    [MaterialType.LeaderToken]: leaderTokenDescription,
    [MaterialType.PowerToken]: powerTokenDescription,
    [MaterialType.SetupCard]: setupCardDescription,
    [MaterialType.VictoryCard]: victoryCardDescription,
    [MaterialType.WisdomBoard]: wisdomBoardDescription,
}
