import { RoundTokenDescription } from '@gamepark/react-game'
import FirstPlayerToken from '../images/Tokens/FirstPlayerToken.png'

class LeaderTokenDescription extends RoundTokenDescription {
    diameter = 4.6
    image = FirstPlayerToken
}

export const leaderTokenDescription = new LeaderTokenDescription()
