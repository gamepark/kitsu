/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { MoveComponentProps, Picture, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { leaderTokenLogPictureCss } from '../../KitsuTheme'
import { leaderTokenDescription } from '../../material/LeaderTokenDescription'

export const EndOfTrickMoveLeaderTokenLogComponent: FC<MoveComponentProps<MoveItem<number, MaterialType, LocationType>>> = ({ move }) => {
  const me = usePlayerId<number>()
  const newLeader = move.location.player
  const newLeaderName = usePlayerName(newLeader)
  if (me === newLeader) {
    return (
      <Trans
        defaults="log.endOfTrick.leaderTokenMove.self"
        components={{ token: <Picture src={leaderTokenDescription.image} css={leaderTokenLogPictureCss} /> }}
      />
    )
  }
  return (
    <Trans
      defaults="log.endOfTrick.leaderTokenMove.other"
      values={{ player: newLeaderName }}
      components={{ token: <Picture src={leaderTokenDescription.image} css={leaderTokenLogPictureCss} /> }}
    />
  )
}
