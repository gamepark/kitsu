/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next';

export const EndOfTrickPickCardsHeader = () => {
    const { t } = useTranslation();
    return <>{t('header.endOfTrickPickCards')}</>;
};
