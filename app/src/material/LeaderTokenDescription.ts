import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { TokenDescription } from '@gamepark/react-game'
import { LeaderTokenHelp } from '../components/Help/LeaderTokenHelp'
import FirstPlayerToken from '../images/Tokens/FirstPlayerToken.png'

class LeaderTokenDescription extends TokenDescription<number, MaterialType, LocationType> {
  height = 4.0
  width = 3.5
  image = FirstPlayerToken
  help = LeaderTokenHelp
}

export const leaderTokenDescription = new LeaderTokenDescription()
