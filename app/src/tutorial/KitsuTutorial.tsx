import { ClotheType, EyebrowType, EyeType, FacialHairType, MouthType, TopType } from '@gamepark/avataaars'
import SkinColor from '@gamepark/avataaars/dist/avatar/SkinColor'
import HairColorName from '@gamepark/avataaars/dist/avatar/top/HairColorName'
import { getKitsuCardType, KitsuCard, KitsuCardType } from '@gamepark/kitsu/material/KitsuCard'
import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { clanCardDescription } from '../material/ClanCardDescription'
import { wisdomBoardDescription } from '../material/WisdomBoardDescription'
import { KitsuTutorialSetup, me, opponent } from './KitsuTutorialSetup'

export class KitsuTutorial extends MaterialTutorial<number, MaterialType, LocationType> {
  version = 1
  options = {
    players: [
      { id: me, team: TeamColor.Zenko },
      { id: opponent, team: TeamColor.Yako },
    ],
  }
  players = [
    { id: me },
    {
      id: opponent,
      name: 'Thomas',
      avatar: {
        topType: TopType.LongHairBun,
        hairColor: HairColorName.Blonde,
        facialHairType: FacialHairType.BeardLight,
        facialHairColor: HairColorName.Blonde,
        clotheType: ClotheType.BlazerShirt,
        eyeType: EyeType.Default,
        eyebrowType: EyebrowType.DefaultNatural,
        mouthType: MouthType.Smile,
        skinColor: SkinColor.Pale,
      },
    },
  ]
  setup = new KitsuTutorialSetup()
  steps: TutorialStep<number, MaterialType, LocationType>[] = [
    {
      popup: {
        text: () => <Trans defaults="tuto.welcome" components={{ bold: <strong /> }} />,
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.players" />,
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.teams" components={{ bold: <strong /> }} />,
      },
      focus: (_game, context) => ({
        staticItems: {
          [MaterialType.ClanCard]: clanCardDescription.getStaticItems(context),
        },
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.board" components={{ bold: <strong /> }} />,
        position: { x: 30 },
      },
      focus: (game) => ({
        staticItems: {
          [MaterialType.WisdomBoard]: [wisdomBoardDescription.staticItem],
        },
        materials: [this.material(game, MaterialType.KitsunePawn).id(KitsunePawn.Zenko), this.material(game, MaterialType.KitsunePawn).id(KitsunePawn.Yako)],
        margin: { top: 1, right: 30, bottom: 1, left: 0 },
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.cards" components={{ bold: <strong /> }} />,
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.KitsuCard).location(LocationType.PlayerHand).player(me)],
        scale: 0.25,
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.cards.numeral" />,
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.KitsuCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .id<KitsuCard>((id) => getKitsuCardType(id) !== KitsuCardType.Special),
        ],
        scale: 0.25,
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.cards.special" />,
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.KitsuCard)
            .location(LocationType.PlayerHand)
            .id<KitsuCard>((id) => getKitsuCardType(id) === KitsuCardType.Special),
        ],
        scale: 0.25,
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.cards.numberPerTrick" components={{ italic: <em /> }} />,
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.card1" />,
      },
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko2_1, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.card" />,
        position: { x: 50 },
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako3_1, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.card1" />,
        position: { x: 50 },
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.card2" />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko3_1, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.card2" />,
        position: { x: 50 },
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako5, move, game),
        interrupt: (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.interrupt.endOfTrick" components={{ bold: <strong /> }} />,
        position: { x: 50 },
      },
    },
    {
      popup: {
        text: () => (
          <Trans
            defaults="tuto.game.interrupt.endOfTrick.kitsunePawnAdvance"
            components={{
              bold: <strong />,
              blue: <span style={{ color: 'blue' }} />,
              orange: <span style={{ color: 'orange' }} />,
            }}
          />
        ),
        position: { x: 50 },
      },
      move: {},
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.card3" />,
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako6, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.bestCard" />,
        position: { x: 50 },
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.katana" components={{ bold: <strong /> }} />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Katana_1, move, game),
      },
    },
    {
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako6, move, game),
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.BlackKitsune_1, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.opponent.blackKitsune" components={{ bold: <strong /> }} />,
        position: { x: 50 },
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.card4" />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako4, move, game),
        interrupt: (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.interrupt.endOfTrick2" components={{ bold: <strong /> }} />,
        position: { x: 50 },
      },
      move: {},
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.pickPlus3Token" components={{ italic: <em /> }} />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) =>
          isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) &&
          this.material(game, MaterialType.PowerToken).getItem<PowerToken>(move.itemIndex).id === PowerToken.Plus3,
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.card5" />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Zenko1_1, move, game),
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako2_1, move, game),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.play.me.card6PlusToken" />,
        position: { x: 50 },
      },
      move: {
        filter: (move, game) =>
          isMoveItemType<number, MaterialType, LocationType>(MaterialType.PowerToken)(move) &&
          this.material(game, MaterialType.PowerToken).getItem<PowerToken>(move.itemIndex).id === PowerToken.Plus3 &&
          this.material(game, MaterialType.KitsuCard).getItem<KitsuCard>(move.location.parent ?? -1).id === KitsuCard.Zenko1_2 &&
          move.location.rotation === PowerTokenPlus3Side.Zenko,
      },
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => this.isMoveForKitsuCard(KitsuCard.Yako1_1, move, game),
        interrupt: (move) => isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn)(move),
      },
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.game.interrupt.endOfTrick3" />,
        position: { x: 50 },
      },
      move: {},
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.card.whiteKitsune" components={{ bold: <strong /> }} />,
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.KitsuCard).id<KitsuCard>(KitsuCard.WhiteKitsune_1)],
        scale: 0.25,
      }),
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.end" />,
      },
    },
  ]

  private isMoveForKitsuCard(
    cardId: KitsuCard,
    move: MaterialMove<number, MaterialType, LocationType>,
    game: MaterialGame<number, MaterialType, LocationType>,
  ) {
    return (
      isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsuCard)(move) &&
      this.material(game, MaterialType.KitsuCard).getItem<KitsuCard>(move.itemIndex).id === cardId
    )
  }
}
