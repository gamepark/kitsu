import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { TokenDescription } from '@gamepark/react-game';
import FirstPlayerToken from '../images/Tokens/FirstPlayerToken.png';

class LeaderTokenDescription extends TokenDescription<number, MaterialType, LocationType> {
    height = 4.00;
    width = 3.50;
    image = FirstPlayerToken;
}

export const leaderTokenDescription = new LeaderTokenDescription();
