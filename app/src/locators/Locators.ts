import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { kitsuCardDiscardSpotOnWisdomBoardLocator } from './KitsuCardDiscardSpotOnWisdomBoardLocator';
import { wisdomBoardSpotLocator } from "./WisdomBoardSpotLocator";
import { clanCardSpotLocator } from "./ClanCardSpotLocator";
import { setupCardSpotLocator } from "./SetupCardSpotLocator";
import { playerHandLocator } from "./PlayerHandLocator";
import { kitsuCardDeckSpotOnWisdomBoardLocator } from "./KitsuCardDeckSpotOnWisdomBoardLocator";
import { kitsunePawnSpotOnWisdomBoardLocator } from "./KitsunePawnSpotOnWisdomBoardLocator";
import { leaderTokenSpotOnClanCardLocator } from "./LeaderTokenSpotOnClanCardLocator";
import { powerTokenSpotOnClanCardLocator } from "./PowerTokenSpotOnClanCardLocator";
import { powerTokenSpotOnWisdomBoardLocator } from "./PowerTokenSpotOnWisdomBoardLocator";
import { discardedPowerTokenAreaOnWisdomBoardLocator } from "./DiscardedPowerTokenAreaOnWisdomBoardLocator";
import { playedKitsuCardSpotLocator } from "./PlayedKitsuCardSpotLocator";
import { victoryCardSpotLocator } from "./VictoyCardSpotLocator";

export const Locators: Partial<Record<LocationType, Locator<number, MaterialType, LocationType>>> = {
    [LocationType.WisdomBoardSpot]: wisdomBoardSpotLocator,
    [LocationType.ClanCardSpot]: clanCardSpotLocator,
    [LocationType.SetupCardSpot] : setupCardSpotLocator,
    [LocationType.PlayerHand]: playerHandLocator,
    [LocationType.KitsuCardDeckSpotOnWisdomBoard]: kitsuCardDeckSpotOnWisdomBoardLocator,
    [LocationType.KitsuCardDiscardSpotOnWisdomBoard]: kitsuCardDiscardSpotOnWisdomBoardLocator,
    [LocationType.KitsunePawnSpotOnWisdomBoard]: kitsunePawnSpotOnWisdomBoardLocator,
    [LocationType.LeaderTokenSpotOnClanCard]: leaderTokenSpotOnClanCardLocator,
    [LocationType.PowerTokenSpotOnClanCard]: powerTokenSpotOnClanCardLocator,
    [LocationType.PowerTokenSpotOnWisdomBoard]: powerTokenSpotOnWisdomBoardLocator,
    [LocationType.DiscardedPowerTokenAreaOnWisdomBoard]: discardedPowerTokenAreaOnWisdomBoardLocator,
    [LocationType.PlayedKitsuCardSpot]: playedKitsuCardSpotLocator,
    [LocationType.VictoryCardsSpot]: victoryCardSpotLocator,
}
