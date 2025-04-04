/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const PickCardInDiscardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<KitsuRules>()
  const me = usePlayerId<number>()
  const activePlayer = rules?.getActivePlayer()
  const player = usePlayerName(activePlayer)
  if (activePlayer === me) {
    return <>{t('header.pickCardInDiscard.active')}</>
  }
  return <>{t('header.pickCardInDiscard.other', { name: player })}</>
}
