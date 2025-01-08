import { BoardDescription } from '@gamepark/react-game'
import WisdomBoard from '../images/Board/WisdomBoard.jpg'

class WisdomBoardDescription extends BoardDescription {
    width = 28.61
    height = 10.10
    image = WisdomBoard
}

export const wisdomBoardDescription = new WisdomBoardDescription()