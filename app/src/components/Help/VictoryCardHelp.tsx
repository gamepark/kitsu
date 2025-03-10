/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { VictoryCard } from '@gamepark/kitsu/material/VictoryCard'
import { Memorize } from '@gamepark/kitsu/Memorize'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MaterialHelpProps, usePlayerId, useRules } from '@gamepark/react-game'
import { TFunction } from 'i18next'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const getTranslatedClanFromCard = (id: VictoryCard, t: TFunction) => {
  switch (id) {
    case VictoryCard.Yako:
      return t('clan.yako')
    case VictoryCard.Zenko:
      return t('clan.zenko')
  }
}
export const VictoryCardHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({ item }) => {
  const { t } = useTranslation()
  const translatedClan = getTranslatedClanFromCard(item.id, t)
  const me = usePlayerId()
  const rules = useRules<KitsuRules>()
  const myTeam = rules?.remind<TeamColor>(Memorize.Team, me)
  const isCardOfMyTeam = myTeam === TeamColor.Yako ? item.id === VictoryCard.Yako : item.id === VictoryCard.Zenko
  return (
    <>
      <h2>{t('help.victoryCard.title')}</h2>
      <p>
        {isCardOfMyTeam ? t('help.victoryCard.description.self', { clan: translatedClan }) : t('help.victoryCard.description.other', { clan: translatedClan })}
      </p>
    </>
  )
}
