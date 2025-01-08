import { CardDescription } from '@gamepark/react-game';
import { KitsuCard } from "@gamepark/kitsu/material/KitsuCard";
import KitsuCardBack from '../images/Cards/KitsuCardBack.jpg';
import KitsuCardZenko1Front from '../images/Cards/KitsuCardZenko1Front.jpg';
import KitsuCardZenko2Front from '../images/Cards/KitsuCardZenko2Front.jpg';
import KitsuCardZenko3Front from '../images/Cards/KitsuCardZenko3Front.jpg';
import KitsuCardZenko4Front from '../images/Cards/KitsuCardZenko4Front.jpg';
import KitsuCardZenko5Front from '../images/Cards/KitsuCardZenko5Front.jpg';
import KitsuCardZenko6Front from '../images/Cards/KitsuCardZenko6Front.jpg';
import KitsuCardYako1Front from '../images/Cards/KitsuCardYako1Front.jpg';
import KitsuCardYako2Front from '../images/Cards/KitsuCardYako2Front.jpg';
import KitsuCardYako3Front from '../images/Cards/KitsuCardYako3Front.jpg';
import KitsuCardYako4Front from '../images/Cards/KitsuCardYako4Front.jpg';
import KitsuCardYako5Front from '../images/Cards/KitsuCardYako5Front.jpg';
import KitsuCardYako6Front from '../images/Cards/KitsuCardYako6Front.jpg';
import KitsuCardKatanaFront from '../images/Cards/KitsuCardKatanaFront.jpg';
import KitsuCardWhiteKistsuneFront from '../images/Cards/KitsuCardWhiteKitsuneFront.jpg';
import KitsuCardBlackKistsuneFront from '../images/Cards/KitsuCardBlackKitsuneFront.jpg';

class KitsuCardDescription extends CardDescription {
    width = 6.30;
    height = 8.80;
    backImage = KitsuCardBack;
    images = {
        [KitsuCard.Yako1_1]: KitsuCardYako1Front,
        [KitsuCard.Yako1_2]: KitsuCardYako1Front,
        [KitsuCard.Yako1_3]: KitsuCardYako1Front,
        [KitsuCard.Yako1_4]: KitsuCardYako1Front,
        [KitsuCard.Yako2_1]: KitsuCardYako2Front,
        [KitsuCard.Yako2_2]: KitsuCardYako2Front,
        [KitsuCard.Yako2_3]: KitsuCardYako2Front,
        [KitsuCard.Yako3_1]: KitsuCardYako3Front,
        [KitsuCard.Yako3_2]: KitsuCardYako3Front,
        [KitsuCard.Yako4]: KitsuCardYako4Front,
        [KitsuCard.Yako5]: KitsuCardYako5Front,
        [KitsuCard.Yako6]: KitsuCardYako6Front,
        [KitsuCard.Zenko1_1]: KitsuCardZenko1Front,
        [KitsuCard.Zenko1_2]: KitsuCardZenko1Front,
        [KitsuCard.Zenko1_3]: KitsuCardZenko1Front,
        [KitsuCard.Zenko1_4]: KitsuCardZenko1Front,
        [KitsuCard.Zenko2_1]: KitsuCardZenko2Front,
        [KitsuCard.Zenko2_2]: KitsuCardZenko2Front,
        [KitsuCard.Zenko2_3]: KitsuCardZenko2Front,
        [KitsuCard.Zenko3_1]: KitsuCardZenko3Front,
        [KitsuCard.Zenko3_2]: KitsuCardZenko3Front,
        [KitsuCard.Zenko4]: KitsuCardZenko4Front,
        [KitsuCard.Zenko5]: KitsuCardZenko5Front,
        [KitsuCard.Zenko6]: KitsuCardZenko6Front,
        [KitsuCard.WhiteKitsune_1]: KitsuCardWhiteKistsuneFront,
        [KitsuCard.WhiteKitsune_2]: KitsuCardWhiteKistsuneFront,
        [KitsuCard.BlackKitsune_1]: KitsuCardBlackKistsuneFront,
        [KitsuCard.BlackKitsune_2]: KitsuCardBlackKistsuneFront,
        [KitsuCard.Katana_1]: KitsuCardKatanaFront,
        [KitsuCard.Katana_2]: KitsuCardKatanaFront,
    }
}

export const kitsuCardDescription = new KitsuCardDescription()