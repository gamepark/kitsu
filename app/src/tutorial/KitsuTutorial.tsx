import { getKitsuCardType, KitsuCard, KitsuCardType } from '@gamepark/kitsu/material/KitsuCard';
import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn';
import { LocationType } from '@gamepark/kitsu/material/LocationType';
import { MaterialType } from '@gamepark/kitsu/material/MaterialType';
import { PowerToken } from '@gamepark/kitsu/material/PowerToken';
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side';
import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { TeamColor } from '@gamepark/kitsu/TeamColor';
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game';
import { isMoveItemType, isStartPlayerTurn, MaterialGame, MaterialMove } from '@gamepark/rules-api';
import { Trans } from 'react-i18next';
import { clanCardDescription } from '../material/ClanCardDescription';
import { wisdomBoardDescription } from '../material/WisdomBoardDescription';
import { KitsuTutorialSetup, me, opponent } from './KitsuTutorialSetup';

export class KitsuTutorial extends MaterialTutorial<number, MaterialType, LocationType> {
    version = 1;
    options = {
        players: [{id: me, team: TeamColor.Zenko}, {id: opponent, team: TeamColor.Yako}],
    };
    players = [
        {id: me}, {id: opponent}
    ];
    //@ts-ignore
    setup = new KitsuTutorialSetup();
    steps: TutorialStep<number, MaterialType, LocationType>[] = [
        {
            popup: {
                text: () => <Trans defaults="tuto.welcome" components={{bold: <strong/>}}/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.players"/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.teams" components={{bold: <strong/>}}/>
            },
            focus: (_game, context) => ({
                staticItems: {
                    [MaterialType.ClanCard]: clanCardDescription.getStaticItems(context),
                }
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.board" components={{bold: <strong/>}}/>
            },
            focus: (game) => ({
                staticItems: {
                    [MaterialType.WisdomBoard]: [wisdomBoardDescription.staticItem]
                },
                materials: [
                    this.material(game, MaterialType.KitsunePawn).id(KitsunePawn.Zenko),
                    this.material(game, MaterialType.KitsunePawn).id(KitsunePawn.Yako)
                ],
                scale: 1
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.cards" components={{bold: <strong/>}}/>
            },
            focus: (game) => ({
                materials: [this.material(game, MaterialType.KitsuCard).location(LocationType.PlayerHand)],
                locations: [{type: LocationType.PlayerHand, player: me}]
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.cards.numeral"/>
            },
            focus: (game) => ({
                materials: [
                    this.material(game, MaterialType.KitsuCard)
                        .location(LocationType.PlayerHand)
                        .id<KitsuCard>(id => getKitsuCardType(id) !== KitsuCardType.Special)
                ],
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.cards.special"/>
            },
            focus: (game) => ({
                materials: [
                    this.material(game, MaterialType.KitsuCard)
                        .location(LocationType.PlayerHand)
                        .id<KitsuCard>(id => getKitsuCardType(id) === KitsuCardType.Special)
                ],
                scale: 1
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.cards.numberPerTrick" components={{italic: <em/>}}/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.card1"/>
            },
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko2_1, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.card"/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.card1"/>
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako3_1, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.card2"/>
            },
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko3_1, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.card2"/>
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako5, move, game),
                interrupt: (move) => isStartPlayerTurn<number, MaterialType, LocationType>(move) && move.id === RuleId.EndOfTrickKistunePawnMove
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.interrupt.endOfTrick" components={{bold: <strong/>}}/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.interrupt.endOfTrick.kitsunePawnAdvance"
                                   components={{
                                       bold: <strong/>,
                                       blue: <span style={{color: 'blue'}}/>,
                                       orange: <span style={{color: 'orange'}}/>
                                   }}/>
            },
            move: {}
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.card3" />
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako6, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.bestCard" />
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.katana" />
            },
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Katana_1, move, game)
            }
        },
        {
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako6, move, game)
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.BlackKitsune_1, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.opponent.blackKitsune" components={{bold: <strong/>}}/>
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.card4" />
            },
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako4, move, game),
                interrupt: move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.interrupt.endOfTrick2" components={{bold: <strong/>}} />
            },
            move: {}
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.pickPlus3Token" components={{italic: <em/>}}/>
            },
            move: {
                filter: (move, game) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move)
                    && this.material(game, MaterialType.PowerToken).getItem<PowerToken>(move.itemIndex).id === PowerToken.Plus3
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.card5" />
            },
            move: {
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko1_1, move, game)
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako2_1, move, game)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.play.me.card6PlusToken" />
            },
            move: {
                filter: (move, game) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move)
                    && this.material(game, MaterialType.PowerToken).getItem<PowerToken>(move.itemIndex).id === PowerToken.Plus3
                    && this.material(game, MaterialType.KitsuCard).getItem<KitsuCard>(move.location.parent!).id === KitsuCard.Zenko1_2
                    && move.location.rotation === PowerTokenPlus3Side.Zenko
            }
        },
        {
            move: {
                player: opponent,
                filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako1_1, move, game),
                interrupt: move => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move)
            }
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.game.interrupt.endOfTrick3" />
            },
            move: {}
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.card.whiteKitsune" components={{bold: <strong/>}} />
            },
            focus: (game) => ({
                materials: [
                    this.material(game, MaterialType.KitsuCard).id<KitsuCard>(KitsuCard.WhiteKitsune_1)
                ]
            })
        },
        {
            popup: {
                text: () => <Trans defaults="tuto.end" />
            }
        }
    ];

    private isMoveForKitsuCard(cardId: KitsuCard, move: MaterialMove<number, MaterialType, LocationType>, game: MaterialGame<number, MaterialType, LocationType>) {
        return isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move)
            && this.material(game, MaterialType.KitsuCard).getItem<KitsuCard>(move.itemIndex).id === cardId;
    }
}