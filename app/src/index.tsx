/** @jsxImportSource @emotion/react */
import { KitsuOptionsSpec } from '@gamepark/kitsu/KitsuOptions'
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsuSetup } from '@gamepark/kitsu/KitsuSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="kitsu"
      Rules={KitsuRules}
      optionsSpec={KitsuOptionsSpec}
      GameSetup={KitsuSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
