/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { Memorize } from '@gamepark/kitsu/Memorize'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MaterialHelpProps, usePlayerId, useRules } from '@gamepark/react-game'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const KitsunePawnHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({ item }) => {
  const { t } = useTranslation()
  const me = usePlayerId()
  const rules = useRules<KitsuRules>()
  const myTeam = rules?.remind<TeamColor>(Memorize.Team, me)
  const isPawnOfMyTeam = myTeam === TeamColor.Yako ? item.id === KitsunePawn.Yako : item.id === KitsunePawn.Zenko
  return (
    <>
      <h2>{t('help.kitsunePawn.title')}</h2>
      <p>{isPawnOfMyTeam ? t('help.kitsunePawn.description.myTeam') : t('help.kistunePawn.description.otherTeam')}</p>
    </>
  )
}
