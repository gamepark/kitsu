import { css } from '@emotion/react'
import { defaultTheme } from '@gamepark/react-game'
import blackBackground from './images/Backgrounds/BlackBackground.jpg'
import logBlackBackground from './images/Backgrounds/LogBlackBackground.jpg'
import yakoBackground from './images/PlayerPanels/YakoBackGround.jpg'
import zenkoBackground from './images/PlayerPanels/ZenkoBackground.jpg'

export const KitsuTheme = {
  root: {
    background: {
      image: blackBackground,
      overlay: 'rgba(0, 0, 0, 0.3)',
    },
    fontFamily: defaultTheme.root.fontFamily,
  },
  logBlack: {
    backgroundImage: logBlackBackground,
  },
  logYako: {
    backgroundImage: yakoBackground,
  },
  logZenko: {
    backgroundImage: zenkoBackground,
  },
}

export const kitsuCardLogPictureCss = css`
  height: 3em;

  > picture {
    margin: 0;
  }
`

export const powerTokenLogPictureCss = css`
  height: 2.5em;
  position: relative;

  > picture {
    margin: 0;
  }
`

export const kitsunePawnLogPictureCss = css`
  height: 1.5em;
  position: relative;

  > picture {
    margin: 0;
  }
`

export const leaderTokenLogPictureCss = css`
  height: 2em;
  position: relative;

  > picture {
    margin: 0;
  }
`

export const zenkoTextCss = css`
  color: dodgerblue;
  font-weight: bold;
  // background-color: #dddddd88;
  padding: 2px;
`

export const yakoTextCss = css`
  color: darkorange;
  font-weight: bold;
  padding: 2px;
`
