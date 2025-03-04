/** @jsxImportSource @emotion/react */

import { RuleId } from '@gamepark/kitsu/rules/RuleId';
import { ComponentType } from 'react';
import { EndOfTrickDecideEndOfRoundHeader } from './EndOfTrickDecideEndOfRoundHeader';
import { EndOfTrickDiscardCardsHeader } from './EndOfTrickDiscardCardsHeader';
import { EndOfTrickKitsunePawnMoveHeader } from './EndOfTrickKitsunePawnMoveHeader';
import { EndOfTrickMoveLeaderTokenHeader } from './EndOfTrickMoveLeaderTokenHeader';
import { EndOfTrickPickAvailablePowerTokenHeader } from './EndOfTrickPickAvailablePowerTokenHeader';
import { EndOfTrickPickCardsHeader } from './EndOfTrickPickCardsHeader';
import { PlayKitsuCardHeader } from './PlayKitsuCardHeader';
import { RoundEndHeader } from './RoundEndHeader';
import { RoundSetupMoveKitsunePawnsHeader } from './RoundSetupMoveKitsunePawnsHeader';
import { SelectKatanaTargetHeader } from './SelectKatanaTargetHeader';
import { SendCardToTeamMemberHeader } from './SendCardToTeamMemberHeader';

export const Headers: Partial<Record<RuleId, ComponentType>> = {
    [RuleId.RoundSetupMoveKitsunePawns]: RoundSetupMoveKitsunePawnsHeader,
    [RuleId.RoundSetupDealCards]: RoundSetupMoveKitsunePawnsHeader,
    [RuleId.PlayKitsuCard]: PlayKitsuCardHeader,
    [RuleId.SendCardToTeamMember]: SendCardToTeamMemberHeader,
    [RuleId.SelectKatanaTarget]: SelectKatanaTargetHeader,
    [RuleId.EndOfTrickKistunePawnMove]: EndOfTrickKitsunePawnMoveHeader,
    [RuleId.EndOfTrickPickAvailablePowerToken]: EndOfTrickPickAvailablePowerTokenHeader,
    [RuleId.EndOfTrickDiscardCards]: EndOfTrickDiscardCardsHeader,
    [RuleId.EndOfTrickDecideEndOfRound]: EndOfTrickDecideEndOfRoundHeader,
    [RuleId.EndOfTrickMoveLeaderToken]: EndOfTrickMoveLeaderTokenHeader,
    [RuleId.EndOfTrickPickCards]: EndOfTrickPickCardsHeader,
    [RuleId.RoundEnd]: RoundEndHeader
};