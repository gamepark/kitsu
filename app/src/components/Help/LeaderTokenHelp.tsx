/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { MaterialHelpProps, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const LeaderTokenHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({ item }) => {
  const { t } = useTranslation()
  const me = usePlayerId<number>()
  const tokenOwnerId = item.location?.player
  const tokenOwner = usePlayerName(tokenOwnerId)
  return (
    <>
      <h2>{t('help.leaderToken.title')}</h2>
      <p>{me === tokenOwnerId ? t('help.leaderToken.description.self') : t('help.leaderToken.description.player', { playerName: tokenOwner })}</p>
    </>
  )
}
