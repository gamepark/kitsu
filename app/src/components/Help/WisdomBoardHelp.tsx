/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const WisdomBoardHelp: FC = () => {
    const {t} = useTranslation();
    return (<>
        <h2>{t('help.wisdomBoard.title')}</h2>
        <p>{t('help.wisdomBoard.description.deck')}</p>
        <p>{t('help.wisdomBoard.description.discard')}</p>
        <p>{t('help.wisdomBoard.description.wisdomTrack')}</p>
    </>);
}