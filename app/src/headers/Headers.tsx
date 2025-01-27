/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/kitsu/rules/RuleId'
import { ComponentType } from 'react'
import { RoundSetupHeader } from './RoundSetupHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.RoundSetup]: RoundSetupHeader
}