import { PlayerTurnRule } from "@gamepark/rules-api";
import { MaterialType } from "../material/MaterialType";
import { LocationType } from "../material/LocationType";

export class EndOfTrickDiscardCardsRule extends PlayerTurnRule<number, MaterialType, LocationType> {

}