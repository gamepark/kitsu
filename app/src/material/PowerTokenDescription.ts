import { TokenDescription } from '@gamepark/react-game';
import { PowerToken } from '@gamepark/kitsu/material/PowerToken';
import ColourExchangeToken from '../images/Tokens/PowerColourExchangeToken.png'
import NoAdvanceToken from '../images/Tokens/PowerNoAdvanceToken.png'
import PickDiscardedToken from '../images/Tokens/PowerPickDiscardedToken.png'
import Plus3YakoToken from '../images/Tokens/PowerPlus3YakoToken.png'
import Plus3ZenkoToken from '../images/Tokens/PowerPlus3ZenkoToken.png'
import ProtectionToken from '../images/Tokens/PowerProtectionToken.png'

class PowerTokenDescription extends TokenDescription {
    width = 3.00
    height = 2.94
    images = {
        [PowerToken.ColourExchange]: ColourExchangeToken,
        [PowerToken.NoAdvance]: NoAdvanceToken,
        [PowerToken.PickDiscarded]: PickDiscardedToken,
        [PowerToken.Plus3]: Plus3YakoToken,
        [PowerToken.Protection]: ProtectionToken,
    }
    backImages = {
        [PowerToken.ColourExchange]: ColourExchangeToken,
        [PowerToken.NoAdvance]: NoAdvanceToken,
        [PowerToken.PickDiscarded]: PickDiscardedToken,
        [PowerToken.Plus3]: Plus3ZenkoToken,
        [PowerToken.Protection]: ProtectionToken,
    }
}

export const powerTokenDescription = new PowerTokenDescription()