/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { isSetupCardMaterial, SetupCard } from '@gamepark/kitsu/material/SetupCard'
import { MaterialHelpProps } from '@gamepark/react-game'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const getNumberOfPlayersFromCardId = (id: SetupCard): number => {
  switch (id) {
    case SetupCard.For2Players:
      return 2
    case SetupCard.For4Players:
      return 4
    case SetupCard.For6Players:
      return 6
  }
}
export const SetupCardHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({ item }) => {
  const { t } = useTranslation()
  const setupCard = isSetupCardMaterial(item) ? item : undefined
  if (setupCard === undefined) {
    throw Error('Unknown setup card')
  }
  const numberOfPlayers = getNumberOfPlayersFromCardId(setupCard.id)
  return (
    <>
      <h2>{t('help.setupCard.title')}</h2>
      <p>{t('help.setupCard.description', { numberOfPlayers })}</p>
    </>
  )
}
