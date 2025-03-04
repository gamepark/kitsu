import { css } from '@emotion/react';
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard';
import { KitsuCardRotation } from '@gamepark/kitsu/material/KitsuCardRotation';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import {
    DropAreaDescription,
    FlexLocator,
    getRelativePlayerIndex,
    ItemContext,
    MaterialContext
} from '@gamepark/react-game';
import { Coordinates, Location, MaterialItem, MaterialMove } from '@gamepark/rules-api';
import GenericCardFront from '../images/Cards/GenericCardFront.jpg';
import { RADIUS } from './Radius';

const LOCATOR_RADIUS = RADIUS - 11;

class PlayedKitsuCardSpotLocationDescription extends DropAreaDescription<number, MaterialType, LocationType, KitsuCard> {
    height = 8.8;
    width = 6.3;
    image = GenericCardFront;
    extraCss = css`
        opacity: 0.5;`;

    public canDrop(_move: MaterialMove<number, number, number>, _location: Location<number, LocationType, number, number>, context: ItemContext<number, MaterialType, LocationType>): boolean {
        return context.rules.game.rule!.id !== RuleId.SelectKatanaTarget;
    }
}

class PlayedKitsuCardSpotLocator extends FlexLocator<number, MaterialType, LocationType> {
    gap = {x: 7};
    maxLines = 1;
    locationDescription = new PlayedKitsuCardSpotLocationDescription();

    public getLineSize(_location: Location<number, LocationType>, context: MaterialContext<number, MaterialType, LocationType>): number {
        return context.rules.game.players.length === 2 ? 2 : 1
    }

    public getLocations(context: MaterialContext<number, MaterialType, LocationType>): Partial<Location<number, LocationType, number, number>>[] {
        return context.rules.players.map(player => ({type: LocationType.PlayedKitsuCardSpot, player: player}));
    }

    public getCoordinates(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): Partial<Coordinates> {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        const playerIndex = (getRelativePlayerIndex(context, location.player) + (context.rules.game.rule?.id === RuleId.SendCardToTeamMember ? 2 : 0)) % numberOfPlayers;
        return {
            x: LOCATOR_RADIUS * Math.sin(-Math.PI * playerIndex / numberOfSectors),
            y: LOCATOR_RADIUS * Math.cos(-Math.PI * playerIndex / numberOfSectors),
        };
    }

    public getRotateZ(location: Location<number, LocationType, number, number>, context: MaterialContext<number, MaterialType, LocationType>): number {
        const numberOfPlayers = context.rules.players.length;
        const numberOfSectors = numberOfPlayers / 2;
        const playerIndex = (getRelativePlayerIndex(context, location.player) + (context.rules.game.rule?.id === RuleId.SendCardToTeamMember ? 2 : 0)) % numberOfPlayers;
        return 180 * playerIndex / numberOfSectors;
    }

    public getItemRotateZ(item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>): number {
        if (item.location.player !== context.player || (context.rules.game.rule?.id && ![RuleId.PlayKitsuCard, RuleId.SelectKatanaTarget, RuleId.EndOfTrickKistunePawnMove].includes(context.rules.game.rule.id))) {
            return super.getItemRotateZ(item, context);
        }
        return item.location.rotation === KitsuCardRotation.FaceDown ? 180 : 0;
    }
}

export const playedKitsuCardSpotLocator = new PlayedKitsuCardSpotLocator();