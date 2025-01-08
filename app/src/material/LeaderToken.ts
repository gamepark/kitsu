import { TokenDescription } from '@gamepark/react-game'
import FirstPlayerToken from '../images/Tokens/FirstPlayerToken.png'

class LeaderToken extends TokenDescription {
    width = 21.26
    height = 22.29
    image = FirstPlayerToken
}

export const leaderTokenDescription = new LeaderToken()
