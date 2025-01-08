import { CardDescription } from '@gamepark/react-game';
import { SetupCard } from '@gamepark/kitsu/material/SetupCard';
import SetupCard2 from '../images/Cards/SetupCard2.jpg'
import SetupCard4 from '../images/Cards/SetupCard4.jpg'
import SetupCard6 from '../images/Cards/SetupCard6.jpg'

class SetupCardDescription extends CardDescription {
    width = 6.30
    height = 8.80
    images = {
        [SetupCard.For2Players]: SetupCard2,
        [SetupCard.For4Players]: SetupCard4,
        [SetupCard.For6Players]: SetupCard6,
    }
}

export const setupCardDescription = new SetupCardDescription()