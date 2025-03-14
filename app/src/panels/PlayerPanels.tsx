/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { Memorize } from '@gamepark/kitsu/Memorize'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import ScoreIcon from '../images/Icons/Score.png'
import YakoBackground from '../images/PlayerPanels/YakoBackGround.jpg'
import ZenkoBackground from '../images/PlayerPanels/ZenkoBackground.jpg'

export const PlayerPanels = () => {
  const players = usePlayers<number>({ sortFromMe: true })
  const rules = useRules<KitsuRules>()
  const root = document.getElementById('root')
  const playerTeams = players.map((player) => rules?.remind<TeamColor>(Memorize.Team, player.id))
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => (
        <StyledPlayerPanel
          key={player.id}
          player={player}
          backgroundImage={playerTeams[index] === TeamColor.Yako ? YakoBackground : ZenkoBackground}
          color={playerTeams[index] === TeamColor.Yako ? 'orange' : 'blue'}
          css={panelPosition(index, players.length)}
          counters={[{ image: ScoreIcon, value: rules?.getScore(player.id) ?? 0 }]}
        />
      ))}
    </>,
    root,
  )
}

const panelPosition = (index: number, numberOfPlayers: number) => css`
  position: absolute;
  width: 28em;
  top: ${panelPositionTop(index, numberOfPlayers)}em;
  right: ${panelPositionRight(index, numberOfPlayers)}em;
`

const panelPositionTop = (index: number, numberOfPlayers: number): number => {
  switch (numberOfPlayers) {
    case 6:
      return panelPositionTop6Players(index)
    case 4:
      return panelPositionTop4Players(index)
    case 2:
      return panelPositionTop2Players(index)
    default:
      throw new Error(`Invalid number of players ${numberOfPlayers}`)
  }
}

const panelPositionRight = (index: number, numberOfPlayers: number): number => {
  switch (numberOfPlayers) {
    case 6:
      return panelPositionRight6Players(index)
    case 4:
      return panelPositionRight4Players(index)
    case 2:
      return panelPositionRight2Players(index)
    default:
      throw new Error(`Invalid number of players ${numberOfPlayers}`)
  }
}

const panelPositionTop6Players = (index: number) => {
  switch (index) {
    case 0:
      return 92.5
    case 1:
    case 5:
      return 80
    case 2:
    case 3:
      return 8
    case 4:
      return 35
    default:
      throw new Error('Invalid position')
  }
}

const panelPositionRight6Players = (index: number): number => {
  switch (index) {
    case 0:
    case 3:
      return 40
    case 1:
    case 2:
      return 127.5
    case 4:
      return 15
    case 5:
      return 20
    default:
      throw new Error('Invalid position')
  }
}

const panelPositionTop4Players = (index: number): number => {
  switch (index) {
    case 0:
      return 90
    case 1:
      return 77.5
    case 2:
      return 8
    case 3:
      return 25
    default:
      throw new Error('Invalid position')
  }
}

const panelPositionRight4Players = (_index: number): number => {
  switch (_index) {
    case 0:
    case 2:
      return 40
    case 1:
      return 110
    case 3:
      return 20
    default:
      throw new Error('Invalid position')
  }
}

const panelPositionTop2Players = (_index: number): number => {
  switch (_index) {
    case 0:
      return 90
    case 1:
      return 8
    default:
      throw new Error('Invalid position')
  }
}

const panelPositionRight2Players = (_index: number): number => {
  return 40
}
