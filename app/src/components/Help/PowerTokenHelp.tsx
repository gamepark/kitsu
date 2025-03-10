/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerToken } from '@gamepark/kitsu/material/PowerToken'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const PowerTokenHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = ({ item }) => {
  const { t } = useTranslation()
  const rules = useRules<KitsuRules>()
  const isSixPlayersGame = rules?.game.players.length === 6
  switch (item.id as PowerToken) {
    case PowerToken.ColourExchange:
      return (
        <>
          <h2>{t('help.powerToken.title')}</h2>
          <p>{t('help.powerToken.colourExchange.description')}</p>
          {item.location?.type === LocationType.DiscardedPowerTokenAreaOnWisdomBoard && (
            <p>
              <small>
                <em>{t('help.powerToken.unavailableForRound')}</em>
              </small>
            </p>
          )}
        </>
      )
    case PowerToken.NoAdvance:
      return (
        <>
          <h2>{t('help.powerToken.title')}</h2>
          <p>{t('help.powerToken.noAdvance.description')}</p>
          {item.location?.type === LocationType.DiscardedPowerTokenAreaOnWisdomBoard && (
            <p>
              <small>
                <em>{t('help.powerToken.unavailableForRound')}</em>
              </small>
            </p>
          )}
        </>
      )
    case PowerToken.PickDiscarded:
      return (
        <>
          <h2>{t('help.powerToken.title')}</h2>
          <p>{t('help.powerToken.pickDiscarded.description', { numberOfCardsToReveal: isSixPlayersGame ? 6 : 4 })}</p>
          <p>{t('help.powerToken.pickDiscarded.description.clarification')}</p>
          {item.location?.type === LocationType.DiscardedPowerTokenAreaOnWisdomBoard && (
            <p>
              <small>
                <em>{t('help.powerToken.unavailableForRound')}</em>
              </small>
            </p>
          )}
        </>
      )
    case PowerToken.Plus3:
      return (
        <>
          <h2>{t('help.powerToken.title')}</h2>
          <p>{t('help.powerToken.plus3.description')}</p>
          {item.location?.type === LocationType.DiscardedPowerTokenAreaOnWisdomBoard && (
            <p>
              <small>
                <em>{t('help.powerToken.unavailableForRound')}</em>
              </small>
            </p>
          )}
        </>
      )
    case PowerToken.Protection:
      return (
        <>
          <h2>{t('help.powerToken.title')}</h2>
          <p>{t('help.powerToken.protection.description')}</p>
          <p>{t('help.powerToken.protection.description.clarification')}</p>
          {item.location?.type === LocationType.DiscardedPowerTokenAreaOnWisdomBoard && (
            <p>
              <small>
                <em>{t('help.powerToken.unavailableForRound')}</em>
              </small>
            </p>
          )}
        </>
      )
  }
}
