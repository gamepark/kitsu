import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { SetupCard } from '@gamepark/kitsu/material/SetupCard'
import { CardDescription, MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { SetupCardHelp } from '../components/Help/SetupCardHelp'
import SetupCard2 from '../images/Cards/SetupCard2.jpg'
import SetupCard4 from '../images/Cards/SetupCard4.jpg'
import SetupCard6 from '../images/Cards/SetupCard6.jpg'

class SetupCardDescription extends CardDescription<number, MaterialType, LocationType, SetupCard> {
  height = 12.0
  width = 8.0
  images = {
    [SetupCard.For2Players]: SetupCard2,
    [SetupCard.For4Players]: SetupCard4,
    [SetupCard.For6Players]: SetupCard6,
  }
  help = SetupCardHelp

  getStaticItems(context: MaterialContext<number, MaterialType, LocationType>): MaterialItem<number, LocationType, SetupCard>[] {
    const numberOfPlayers: number = context.rules.players.length
    return [
      {
        id: this.getSetupCardIdFromNumberOfPlayers(numberOfPlayers),
        location: {
          type: LocationType.SetupCardSpot,
        },
      },
    ]
  }

  private getSetupCardIdFromNumberOfPlayers(numberOfPlayers: number): SetupCard {
    switch (numberOfPlayers) {
      case 2:
        return SetupCard.For2Players
      case 4:
        return SetupCard.For4Players
      case 6:
        return SetupCard.For6Players
      default:
        throw new Error('Invalid number of players')
    }
  }
}

export const setupCardDescription = new SetupCardDescription()
