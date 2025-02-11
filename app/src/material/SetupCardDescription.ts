import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { CardDescription, MaterialContext } from '@gamepark/react-game';
import { SetupCard } from '@gamepark/kitsu/material/SetupCard';
import SetupCard2 from '../images/Cards/SetupCard2.jpg';
import SetupCard4 from '../images/Cards/SetupCard4.jpg';
import SetupCard6 from '../images/Cards/SetupCard6.jpg';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialItem } from '@gamepark/rules-api';


class SetupCardDescription extends CardDescription<number, MaterialType, LocationType, SetupCard> {
    width = 8.00;
    height = 12.00;
    images = {
        [SetupCard.For2Players]: SetupCard2,
        [SetupCard.For4Players]: SetupCard4,
        [SetupCard.For6Players]: SetupCard6,
    };

    getStaticItems(context: MaterialContext<number, MaterialType, LocationType>): MaterialItem<number, LocationType, SetupCard>[] {
        const numberOfPlayers: number = context.rules.players.length;
        return [{
            id: this.getSetupCardIdFromNumberOfPlayers(numberOfPlayers),
            location: {
                type: LocationType.SetupCardSpot,
            }
        }];
    }

    private getSetupCardIdFromNumberOfPlayers(numberOfPlayers: number): SetupCard {
        switch (numberOfPlayers) {
            case 2:
                return SetupCard.For2Players;
            case 4:
                return SetupCard.For4Players;
            case 6:
                return SetupCard.For6Players;
            default:
                throw new Error('Invalid number of players');
        }
    }
}

export const setupCardDescription = new SetupCardDescription();