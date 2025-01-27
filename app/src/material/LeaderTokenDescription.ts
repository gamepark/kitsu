import { TokenDescription } from '@gamepark/react-game'
import FirstPlayerToken from '../images/Tokens/FirstPlayerToken.png'

class LeaderTokenDescription extends TokenDescription {
    width = 3.50
    height = 4.00
    image = FirstPlayerToken
}

export const leaderTokenDescription = new LeaderTokenDescription()
