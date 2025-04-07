/** @jsxImportSource @emotion/react */
import { KitsunePawn } from '@gamepark/kitsu/material/KitsunePawn'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { EndOfTrickKitsunePawnMoveRule } from '@gamepark/kitsu/rules/EndOfTrickKitsunePawnMoveRule'
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { TeamColor } from '@gamepark/kitsu/TeamColor'
import { MoveComponentProps, Picture } from '@gamepark/react-game'
import { isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { kitsunePawnLogPictureCss, yakoTextCss, zenkoTextCss } from '../../KitsuTheme'
import { kitsunePawnDescription } from '../../material/KitsunePawnDescription'

export const EndOfTrickWinningTeamLogComponent: FC<MoveComponentProps<MaterialMove<number, MaterialType, LocationType>>> = ({ context }) => {
  const { t } = useTranslation()
  const rule = new EndOfTrickKitsunePawnMoveRule(context.game as MaterialGame<number, MaterialType, LocationType, RuleId>)
  const playedCards = rule.material(MaterialType.KitsuCard).location(LocationType.PlayedKitsuCardSpot)
  const playedTokens = rule.material(MaterialType.PowerToken).location(LocationType.PowerTokenSpotOnKitsuCard)
  const { zenkoScore, yakoScore, winningTeam } = EndOfTrickKitsunePawnMoveRule.getWinningTeamAndScoreDifference(playedCards, playedTokens, true)
  const winningKitsunePawnItemIndex = rule
    .material(MaterialType.KitsunePawn)
    .id<KitsunePawn>(winningTeam === TeamColor.Yako ? KitsunePawn.Yako : KitsunePawn.Zenko)
    .getIndex()
  const kitsunePawnConsequences = context.action.consequences
    .filter(isMoveItemType<number, MaterialType, LocationType>(MaterialType.KitsunePawn))
    .filter((consequence) => consequence.itemIndex === winningKitsunePawnItemIndex && consequence.location.id !== 0)
  const numberOfMoves = kitsunePawnConsequences.length
  const ultimateWisdomReached = kitsunePawnConsequences[kitsunePawnConsequences.length - 1].location.id === 13
  if (ultimateWisdomReached) {
    return (
      <Trans
        defaults="log.endOfTrick.winningTeam.ultimateWisdomReached"
        values={{ zenkoScore: zenkoScore, yakoScore: yakoScore, winningTeamName: winningTeam === TeamColor.Yako ? t('clan.yako') : t('clan.zenko'), numberOfMoves: numberOfMoves }}
        components={{
          blue: <span css={zenkoTextCss} />,
          orange: <span css={yakoTextCss} />,
          winningTeamColor: <span css={winningTeam === TeamColor.Yako ? yakoTextCss : zenkoTextCss} />,
          pawn: (
            <Picture
              src={kitsunePawnDescription.images[winningTeam === TeamColor.Yako ? KitsunePawn.Yako : KitsunePawn.Zenko]}
              css={kitsunePawnLogPictureCss}
            />
          ),
        }}
      />
    )
  }
  return (
    <Trans
      defaults="log.endOfTrick.winningTeam"
      values={{ zenkoScore: zenkoScore, yakoScore: yakoScore, winningTeamName: winningTeam === TeamColor.Yako ? t('clan.yako') : t('clan.zenko'), numberOfMoves: numberOfMoves }}
      components={{
        blue: <span css={zenkoTextCss} />,
        orange: <span css={yakoTextCss} />,
        winningTeamColor: <span css={winningTeam === TeamColor.Yako ? yakoTextCss : zenkoTextCss} />,
        pawn: (
          <Picture src={kitsunePawnDescription.images[winningTeam === TeamColor.Yako ? KitsunePawn.Yako : KitsunePawn.Zenko]} css={kitsunePawnLogPictureCss} />
        ),
      }}
    />
  )
}
