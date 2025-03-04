/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next';

export const EndOfTrickDiscardCardsHeader = () => {
    const { t } = useTranslation();
    return <>{t('header.endOfTrickDiscardCards')}</>;
};
