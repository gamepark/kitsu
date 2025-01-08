import { CardDescription } from '@gamepark/react-game';
import ClanCardYako2Front from '../images/Cards/ClanCardYako2Front.jpg';
import ClanCardYako4Front from '../images/Cards/ClanCardYako4Front.jpg';
import ClanCardYako6Front from '../images/Cards/ClanCardYako6Front.jpg';
import ClanCardZenko2Front from '../images/Cards/ClanCardZenko2Front.jpg';
import ClanCardZenko4Front from '../images/Cards/ClanCardZenko4Front.jpg';
import ClanCardZenko6Front from '../images/Cards/ClanCardZenko6Front.jpg';
import { ClanCard } from "@gamepark/kitsu/material/ClanCard";

class ClanCardDescription extends CardDescription {
    width = 6.30
    height = 8.80
    images = {
        [ClanCard.Yako2Players]: ClanCardYako2Front,
        [ClanCard.Yako4Players]: ClanCardYako4Front,
        [ClanCard.Yako6Players]: ClanCardYako6Front,
        [ClanCard.Zenko2Players]: ClanCardZenko2Front,
        [ClanCard.Zenko4Players]: ClanCardZenko4Front,
        [ClanCard.Zenko6Players]: ClanCardZenko6Front,
    }
}

export const clanCardDescription = new ClanCardDescription()