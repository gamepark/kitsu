import { KitsuOptions } from '@gamepark/kitsu/KitsuOptions';
import { KitsuSetup } from '@gamepark/kitsu/KitsuSetup';
import { KitsuCard } from '@gamepark/kitsu/material/KitsuCard';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';

export const me = 1;

export const opponent = 2;

export class KitsuTutorialSetup extends KitsuSetup {

    public setupMaterial(options: KitsuOptions): void {
        super.setupMaterial(options);
        this.setupPlayerHand();
        this.setupOpponentHand();
        const deck = this.material(MaterialType.KitsuCard).location(LocationType.KitsuCardDeckSpotOnWisdomBoard).deck();
        deck.shuffle();
        this.material(MaterialType.KitsuCard)
            .id<KitsuCard>(KitsuCard.WhiteKitsune_1)
            .moveItem({
                type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
                x: 3
            });
        this.material(MaterialType.KitsuCard)
            .id<KitsuCard>(KitsuCard.WhiteKitsune_2)
            .moveItem({
                type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
                x: 2
            });
    }

    public start(): void {
        this.startPlayerTurn(RuleId.PlayKitsuCard, this.players[0]);
    }

    private setupPlayerHand(): void {
        this.material(MaterialType.KitsuCard)
            .id<KitsuCard>(id => [KitsuCard.Zenko2_1, KitsuCard.Zenko3_1, KitsuCard.Katana_1, KitsuCard.Yako4, KitsuCard.Zenko1_1, KitsuCard.Zenko1_2].includes(id))
            .moveItems({
                type: LocationType.PlayerHand,
                player: me
            });
    }

    private setupOpponentHand(): void {
        this.material(MaterialType.KitsuCard)
            .id<KitsuCard>(id => [KitsuCard.Yako3_1, KitsuCard.Yako5, KitsuCard.Yako6, KitsuCard.BlackKitsune_1, KitsuCard.Yako2_1, KitsuCard.Yako1_1].includes(id))
            .moveItems({
                type: LocationType.PlayerHand,
                player: opponent
            });
    }
}