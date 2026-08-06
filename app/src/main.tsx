import { KitsuOptionsSpecV2 } from '@gamepark/kitsu/KitsuOptions'
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { KitsuSetup } from '@gamepark/kitsu/KitsuSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { KitsuHistory } from './history/KitsuHistory'
import { KitsuTheme } from './KitsuTheme'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import { KitsuTutorial } from './tutorial/KitsuTutorial'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="kitsu"
      Rules={KitsuRules}
      optionsSpec={KitsuOptionsSpecV2}
      GameSetup={KitsuSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      tutorial={new KitsuTutorial()}
      logs={new KitsuHistory()}
      theme={KitsuTheme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
