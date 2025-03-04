/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next';

export const EndOfTrickMoveLeaderTokenHeader = () => {
    const { t } = useTranslation();
    return <>{t('header.endOfTrickMoveLeaderToken')}</>;
};
