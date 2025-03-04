/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next';

export const EndOfTrickDecideEndOfRoundHeader = () => {
    const { t } = useTranslation();
    return <>{t('header.endOfTrickDecideEndOfRound')}</>;
};
