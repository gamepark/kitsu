/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { VictoryCard } from '@gamepark/kitsu/material/VictoryCard'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MoveComponentProps, Picture } from '@gamepark/react-game'
import { CreateItem, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { kitsuCardLogPictureCss, yakoTextCss, zenkoTextCss } from '../../KitsuTheme'
import { victoryCardDescription } from '../../material/VictoryCardDescription'

export const RoundEndVictoryCardCreationLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ move }) => {
  const { t } = useTranslation()
  const createMove = move as CreateItem<number, MaterialType, LocationType>
  const winningTeam = (createMove.item as MaterialItem<number, LocationType, VictoryCard>).id === VictoryCard.Zenko ? TeamColor.Zenko : TeamColor.Yako
  return (
    <Trans
      defaults="log.roundEnd.victoryCardCreation"
      values={{ team: winningTeam === TeamColor.Zenko ? t('clan.zenko') : t('clan.yako') }}
      components={{
        card: <Picture src={victoryCardDescription.images[createMove.item.id as VictoryCard]} css={kitsuCardLogPictureCss} />,
        teamColor: <span css={winningTeam === TeamColor.Yako ? yakoTextCss : zenkoTextCss} />,
      }}
    />
  )
}
