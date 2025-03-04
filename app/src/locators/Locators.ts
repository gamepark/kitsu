import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { Locator } from '@gamepark/react-game';
import { clanCardSpotLocator } from './ClanCardSpotLocator';
import { discardedCardsToPickSpotLocator } from './DiscardedCardsToPickSpotLocator';
import { discardedPowerTokenAreaOnWisdomBoardLocator } from './DiscardedPowerTokenAreaOnWisdomBoardLocator';
import { kitsuCardDeckSpotOnWisdomBoardLocator } from './KitsuCardDeckSpotOnWisdomBoardLocator';
import { kitsuCardDiscardSpotOnWisdomBoardLocator } from './KitsuCardDiscardSpotOnWisdomBoardLocator';
import { kitsunePawnSpotOnWisdomBoardLocator } from './KitsunePawnSpotOnWisdomBoardLocator';
import { leaderTokenSpotOnClanCardLocator } from './LeaderTokenSpotOnClanCardLocator';
import { playedKitsuCardSpotLocator } from './PlayedKitsuCardSpotLocator';
import { playerHandLocator } from './PlayerHandLocator';
import { powerTokenSpotOnClanCardLocator } from './PowerTokenSpotOnClanCardLocator';
import { powerTokenSpotOnKitsuCardLocator } from './PowerTokenSpotOnKitsuCardLocator';
import { powerTokenSpotOnWisdomBoardLocator } from './PowerTokenSpotOnWisdomBoardLocator';
import { setupCardSpotLocator } from './SetupCardSpotLocator';
import { victoryCardSpotLocator } from './VictoyCardSpotLocator';
import { wisdomBoardSpotLocator } from './WisdomBoardSpotLocator';

export const Locators: Partial<Record<LocationType, Locator<number, MaterialType, LocationType>>> = {
    [LocationType.WisdomBoardSpot]: wisdomBoardSpotLocator,
    [LocationType.ClanCardSpot]: clanCardSpotLocator,
    [LocationType.SetupCardSpot]: setupCardSpotLocator,
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
    [LocationType.PowerTokenSpotOnKitsuCard]: powerTokenSpotOnKitsuCardLocator,
    [LocationType.DiscardedCardsToPickSpot]: discardedCardsToPickSpotLocator,
};
