import { CardDescription } from '@gamepark/react-game';
import { VictoryCard } from '@gamepark/kitsu/material/VictoryCard';
import VictoryYako from '../images/Cards/VictoryYako.jpg'
import VictoryZenko from '../images/Cards/VictoryZenko.jpg'

class VictoryCardDescription extends CardDescription {
    width = 6.30
    height = 8.80
    images = {
        [VictoryCard.Yako]: VictoryYako,
        [VictoryCard.Zenko]: VictoryZenko,
    }
}

export const victoryCardDescription = new VictoryCardDescription()