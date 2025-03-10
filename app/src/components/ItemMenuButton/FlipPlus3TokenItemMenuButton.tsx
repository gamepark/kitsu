/** @jsxImportSource @emotion/react */
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { PowerTokenPlus3Side } from '@gamepark/kitsu/material/PowerTokenPlus3Side'
import { ItemMenuButton } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface FlipPlus3TokenItemMenuButtonProps {
  move: MaterialMove<number, MaterialType, LocationType>
  rotation: PowerTokenPlus3Side
}

const getClanCorrespondingToPlus3Side = (rotation: PowerTokenPlus3Side, t: TFunction) => {
  switch (rotation) {
    case PowerTokenPlus3Side.Yako:
      return t('clan.yako')
    case PowerTokenPlus3Side.Zenko:
      return t('clan.zenko')
  }
}
export const FlipPlus3TokenItemMenuButton: FC<FlipPlus3TokenItemMenuButtonProps> = ({ move, rotation }) => {
  const { t } = useTranslation()
  const translatedClan = getClanCorrespondingToPlus3Side(rotation, t)
  return (
    <ItemMenuButton
      move={move}
      options={{ transient: true }}
      radius={3.5}
      angle={0}
      label={<Trans defaults="button.powerToken.plus3.flip" values={{ clan: translatedClan }} />}
    >
      <span className="fa-flip-vertical">
        <FontAwesomeIcon icon={faArrowRotateRight} rotation={90} size="lg" />
      </span>
    </ItemMenuButton>
  )
}
