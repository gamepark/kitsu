import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { TokenDescription } from '@gamepark/react-game';
import YakoPawn from '../images/Tokens/YakoKitsuneToken.png';
import ZenkoPawn from '../images/Tokens/ZenkoKitsuneToken.png';

class KitsunePawnDescription extends TokenDescription<number, MaterialType, LocationType, KitsunePawn> {
    height = 2.54;
    width = 2.16;
    images = {
        [KitsunePawn.Yako]: YakoPawn,
        [KitsunePawn.Zenko]: ZenkoPawn,
    };
}

export const kitsunePawnDescription = new KitsunePawnDescription();