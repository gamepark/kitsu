import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { CardDescription } from '@gamepark/react-game';
import { VictoryCard } from '@gamepark/kitsu/material/VictoryCard';
import VictoryYako from '../images/Cards/VictoryYako.jpg'
import VictoryZenko from '../images/Cards/VictoryZenko.jpg'

class VictoryCardDescription extends CardDescription<number, MaterialType, LocationType, VictoryCard> {
    width = 6.30
    height = 8.80
    images = {
        [VictoryCard.Yako]: VictoryYako,
        [VictoryCard.Zenko]: VictoryZenko,
    }
}

export const victoryCardDescription = new VictoryCardDescription()