import { MaterialGame, MaterialItem } from '@gamepark/rules-api'
import { KitsuCard, kitsuCardIds } from '../../src/material/KitsuCard'
import { LocationType } from '../../src/material/LocationType'
import { MaterialType } from '../../src/material/MaterialType'
import { powerToken } from '../../src/material/PowerToken'
import { Memorize } from '../../src/Memorize'
import { RuleId } from '../../src/rules/RuleId'
import { TeamColor, teamColors } from '../../src/TeamColor'
import { MaterialGameBuilder } from './MaterialGameBuilder'

export const createKitsuCardItems = (playersNumber: 2 | 4 | 6): MaterialItem<number, LocationType, KitsuCard>[] =>
  kitsuCardIds.slice(0, playersNumber === 6 ? 30 : 24).map((id, index) => ({
    id: id,
    location: {
      type: LocationType.KitsuCardDeckSpotOnWisdomBoard,
      x: index,
    },
  }))

export const create2PlayersGameBuilder = (): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  const players = [
    { id: 1, team: TeamColor.Zenko },
    { id: 2, team: TeamColor.Yako },
  ]
  const builder = new MaterialGameBuilder<number, MaterialType, LocationType, RuleId>()
  builder.setPlayers(players.map((player) => player.id))
  players.forEach((playerInfo) => {
    builder.memorize<TeamColor>(Memorize.Team, playerInfo.team, playerInfo.id)
  })
  builder.material(MaterialType.KitsuCard).createItems(createKitsuCardItems(2))
  builder.material(MaterialType.LeaderToken).createItem({
    location: {
      type: LocationType.LeaderTokenSpotOnClanCard,
      player: 1,
    },
  })
  builder.material(MaterialType.KitsunePawn).createItems(
    teamColors.map((color) => ({
      id: color,
      location: {
        type: LocationType.KitsunePawnSpotOnWisdomBoard,
        id: 0,
      },
    })),
  )
  builder.material(MaterialType.PowerToken).createItems(
    powerToken.map((powerTokenId) => ({
      id: powerTokenId,
      location: {
        type: LocationType.PowerTokenSpotOnWisdomBoard,
      },
    })),
  )
  return builder
}

export const create2PlayersGameState = (): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilder().build()
}

export const create2PlayersGameBuilderWithCardsInPlayerHand = (
  player: 1 | 2,
  cardIds: KitsuCard[],
): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  const builder = create2PlayersGameBuilder()
  builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) =>
    cardIds.includes(kitsuCard.id)
      ? {
          type: LocationType.PlayerHand,
          player: player,
        }
      : kitsuCard.location,
  )
  return builder
}

export const create2PlayersGameStateWithCardsInPlayerHand = (player: 1 | 2, cardIds: KitsuCard[]): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithCardsInPlayerHand(player, cardIds).build()
}

export const create2PlayersGameBuilderWithCardsInPlayersHands = (
  playerHands: {
    player: 1 | 2
    cardIds: KitsuCard[]
  }[],
): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  const builder = create2PlayersGameBuilder()
  playerHands.forEach((hand) => {
    builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) =>
      hand.cardIds.includes(kitsuCard.id)
        ? {
            type: LocationType.PlayerHand,
            player: hand.player,
          }
        : kitsuCard.location,
    )
  })
  return builder
}

export const create2PlayersGameStateWithCardsInPlayersHands = (
  playerHands: {
    player: 1 | 2
    cardIds: KitsuCard[]
  }[],
): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithCardsInPlayersHands(playerHands).build()
}

export const create2PlayersGameBuilderWithCardsInPlayersHandsAndPlayedCards = (
  playersCards: {
    player: 1 | 2
    handCardIds: KitsuCard[]
    playedCardIds: KitsuCard[]
  }[],
): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  const builder = create2PlayersGameBuilder()
  playersCards.forEach((playerCard) => {
    builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) => {
      if (playerCard.playedCardIds.includes(kitsuCard.id)) {
        return {
          type: LocationType.PlayedKitsuCardSpot,
          player: playerCard.player,
        }
      } else if (playerCard.handCardIds.includes(kitsuCard.id)) {
        return {
          type: LocationType.PlayerHand,
          player: playerCard.player,
        }
      } else {
        return kitsuCard.location
      }
    })
  })
  return builder
}

export const create2PlayersGameStateWithCardsInPlayersHandsAndPlayedCards = (
  playersCards: {
    player: 1 | 2
    handCardIds: KitsuCard[]
    playedCardIds: KitsuCard[]
  }[],
): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithCardsInPlayersHandsAndPlayedCards(playersCards).build()
}

export const create2PlayersGameBuilderWithPlayedCards = (
  playersPlayeddCards: {
    player: 1 | 2
    playedCardIds: KitsuCard[]
  }[],
): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  const builder = create2PlayersGameBuilder()
  playersPlayeddCards.forEach((playerPlayedCards) => {
    builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) =>
      playerPlayedCards.playedCardIds.includes(kitsuCard.id)
        ? {
            type: LocationType.PlayedKitsuCardSpot,
            player: playerPlayedCards.player,
          }
        : kitsuCard.location,
    )
  })
  return builder
}

export const create2PlayersGameStateWithPlayedCards = (
  playersPlayeddCards: {
    player: 1 | 2
    playedCardIds: KitsuCard[]
  }[],
): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithPlayedCards(playersPlayeddCards).build()
}

export const create2PlayersGameBuilderWithDiscardedCards = (discardedCardIds: KitsuCard[]): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  let discardIndex = 0
  const builder = create2PlayersGameBuilder()
  builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) =>
    discardedCardIds.includes(kitsuCard.id)
      ? {
          type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
          x: discardIndex++,
        }
      : kitsuCard.location,
  )
  return builder
}

export const create2PlayersGameStateWithDiscardedCards = (discardedCardIds: KitsuCard[]): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithDiscardedCards(discardedCardIds).build()
}

export const create2PlayersGameBuilderWithDiscardedCardsAndCardsInPlayersHands = (
  discardedCardIds: KitsuCard[],
  playerHands: {
    player: 1 | 2
    cardIds: KitsuCard[]
  }[],
): MaterialGameBuilder<number, MaterialType, LocationType, RuleId> => {
  let discardIndex = 0
  const builder = create2PlayersGameBuilderWithCardsInPlayersHands(playerHands)
  builder.material(MaterialType.KitsuCard).moveItems((kitsuCard) =>
    discardedCardIds.includes(kitsuCard.id)
      ? {
          type: LocationType.KitsuCardDiscardSpotOnWisdomBoard,
          x: discardIndex++,
        }
      : kitsuCard.location,
  )
  return builder
}

export const create2PlayersGameStateWithDiscardedCardsAndCardsInPlayersHands = (
  discardedCardIds: KitsuCard[],
  playerHands: {
    player: 1 | 2
    cardIds: KitsuCard[]
  }[],
): MaterialGame<number, MaterialType, LocationType> => {
  return create2PlayersGameBuilderWithDiscardedCardsAndCardsInPlayersHands(discardedCardIds, playerHands).build()
}
