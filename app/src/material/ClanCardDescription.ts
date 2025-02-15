import { ClanCard } from '@gamepark/kitsu/material/ClanCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { Memorize } from '@gamepark/kitsu/Memorize';
import { TeamColor } from '@gamepark/kitsu/TeamColor';
import { CardDescription, MaterialContext } from '@gamepark/react-game';
import { MaterialItem } from '@gamepark/rules-api';
import ClanCardYako2Front from '../images/Cards/ClanCardYako2Front.jpg';
import ClanCardYako4Front from '../images/Cards/ClanCardYako4Front.jpg';
import ClanCardYako6Front from '../images/Cards/ClanCardYako6Front.jpg';
import ClanCardZenko2Front from '../images/Cards/ClanCardZenko2Front.jpg';
import ClanCardZenko4Front from '../images/Cards/ClanCardZenko4Front.jpg';
import ClanCardZenko6Front from '../images/Cards/ClanCardZenko6Front.jpg';

class ClanCardDescription extends CardDescription<number, MaterialType, LocationType, ClanCard> {
    height = 8.80;
    width = 6.30;
    images = {
        [ClanCard.Yako2Players]: ClanCardYako2Front,
        [ClanCard.Yako4Players]: ClanCardYako4Front,
        [ClanCard.Yako6Players]: ClanCardYako6Front,
        [ClanCard.Zenko2Players]: ClanCardZenko2Front,
        [ClanCard.Zenko4Players]: ClanCardZenko4Front,
        [ClanCard.Zenko6Players]: ClanCardZenko6Front,
    };

    getStaticItems(context: MaterialContext<number, MaterialType, LocationType>): MaterialItem<number, LocationType, ClanCard>[] {
        const numberOfPlayers = context.rules.players.length;
        return context.rules.players.map(player => {
            const playerTeam = context.rules.remind<TeamColor>(Memorize.Team, player);
            return {
                id: this.getClanCardIdFromTeamAndNumberOfPlayers(playerTeam, numberOfPlayers),
                location: {
                    type: LocationType.ClanCardSpot,
                    player: player,
                }
            };
        });
    }

    private getClanCardIdFromTeamAndNumberOfPlayers(playerTeam: TeamColor, numberOfPlayers: number): ClanCard {
        switch (numberOfPlayers) {
            case 2:
                return playerTeam === TeamColor.Yako ? ClanCard.Yako2Players : ClanCard.Zenko2Players;
            case 4:
                return playerTeam === TeamColor.Yako ? ClanCard.Yako4Players : ClanCard.Zenko4Players;
            case 6:
                return playerTeam === TeamColor.Yako ? ClanCard.Yako6Players : ClanCard.Zenko6Players;
            default:
                throw new Error('Invalid number of players');
        }
    }
}

export const clanCardDescription = new ClanCardDescription();