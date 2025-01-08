import { TokenDescription } from '@gamepark/react-game';
import YakoPawn from '../images/Tokens/YakoKitsuneToken.png';
import ZenkoPawn from '../images/Tokens/ZenkoKitsuneToken.png';
import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn';

class KitsunePawnDescription extends TokenDescription {
    width = 2.25
    height = 2.64
    images = {
        [KitsunePawn.Yako]: YakoPawn,
        [KitsunePawn.Zenko]: ZenkoPawn,
    }
}

export const kitsunePawnDescription = new KitsunePawnDescription()