/** @jsxImportSource @emotion/react */
import { KitsuRules } from '@gamepark/kitsu/KitsuRules'
import { getKitsuCardType, isKitsuCardMaterial, KitsuCard, KitsuCardType } from '@gamepark/kitsu/material/KitsuCard'
import { LocationType } from '@gamepark/kitsu/material/LocationType'
import { MaterialType } from '@gamepark/kitsu/material/MaterialType'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { NumericKitsuCardHelp } from './NumericKitsuCardHelp'
import { SpecialKitsuCardHelp } from './SpecialKitsuCardHelp'
import { UnknownKitsuCardHelp } from './UnknownKitsuCardHelp'

export const KitsuCardHelp: FC<MaterialHelpProps<number, MaterialType, LocationType>> = (props) => {
  const rules = useRules<KitsuRules>()
  const isSixPlayersGame = rules?.game.players.length === 6
  const isSpecialCard = getKitsuCardType(props.item.id) === KitsuCardType.Special
  const card = isKitsuCardMaterial(props.item) ? props.item : undefined
  const unknownKitsuCard = props.item as Omit<MaterialItem<number, LocationType, KitsuCard>, 'id'>
  return (
    <>
      {card ? (
        isSpecialCard ? (
          <SpecialKitsuCardHelp item={card} />
        ) : (
          <NumericKitsuCardHelp item={card} isSixPlayersGame={isSixPlayersGame} />
        )
      ) : (
        <UnknownKitsuCardHelp item={unknownKitsuCard} />
      )}
    </>
  )
}
