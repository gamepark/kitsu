/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const RoundEndHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.roundEndHeader')}</>
}
