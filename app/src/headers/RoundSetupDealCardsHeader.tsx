/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const RoundSetupDealCardsHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.roundSetupDealCards')}</>
}
