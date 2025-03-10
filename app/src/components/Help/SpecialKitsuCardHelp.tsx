/** @jsxImportSource @emotion/react */
import { getSpecialCardType, KitsuCard, KitsuCardSpecialType } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialItem } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface SpecialKitsuCardHelpProps {
  item: MaterialItem<number, LocationType, KitsuCard>
}

export const SpecialKitsuCardHelp: FC<SpecialKitsuCardHelpProps> = ({ item }) => {
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('help.kitsuCard.title')}</h2>
      {getSpecialKitsuCardText(item.id, t)}
      <p>{t('help.kitsuCard.quantity', { quantity: 2 })}</p>
    </>
  )
}

const getSpecialKitsuCardText = (itemId: KitsuCard, t: TFunction) => {
  switch (getSpecialCardType(itemId)) {
    case KitsuCardSpecialType.Katana:
      return (
        <>
          <h3>{t('help.kitsuCard.katana.title')}</h3>
          <p>{t('help.kitsuCard.katana.description')}</p>
        </>
      )
    case KitsuCardSpecialType.WhiteKitsune:
      return (
        <>
          <h3>{t('help.kitsuCard.whiteKitsune.title')}</h3>
          <p>{t('help.kitsuCard.whiteKitsune.description')}</p>
        </>
      )
    case KitsuCardSpecialType.BlackKitsune:
      return (
        <>
          <h3>{t('help.kitsuCard.blackKitsune.title')}</h3>
          <p>{t('help.kitsuCard.blackKitsune.description')}</p>
        </>
      )
  }
}
