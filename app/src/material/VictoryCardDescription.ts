import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { VictoryCard } from '@gamepark/kitsu/material/VictoryCard';
import { CardDescription } from '@gamepark/react-game';
import VictoryYako from '../images/Cards/VictoryYako.jpg';
import VictoryZenko from '../images/Cards/VictoryZenko.jpg';

class VictoryCardDescription extends CardDescription<number, MaterialType, LocationType, VictoryCard> {
    height = 8.80;
    width = 6.30;
    images = {
        [VictoryCard.Yako]: VictoryYako,
        [VictoryCard.Zenko]: VictoryZenko,
    };
}

export const victoryCardDescription = new VictoryCardDescription();