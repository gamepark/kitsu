import { ItemMove, Material, MaterialGame, MaterialMutator, RuleStep } from '@gamepark/rules-api';
export class MaterialGameBuilder<Player extends number, MaterialType extends number, LocationType extends number, RuleId extends number> {
    private game: MaterialGame<Player, MaterialType, LocationType>;

    private mutators: Record<MaterialType, MaterialMutator<Player, MaterialType, LocationType>>;

    constructor() {
        this.game = {
            players: [],
            memory: {},
            rule: {} as RuleStep<Player, RuleId>,
            items: {},
        } as MaterialGame<Player, MaterialType, LocationType>;
        this.mutators = {} as Record<MaterialType, MaterialMutator<Player, MaterialType, LocationType>>;
    }

    reset(): void {
        this.game = {
            players: [],
            memory: {},
            rule: {} as RuleStep<Player, RuleId>,
            items: {},
        } as MaterialGame<Player, MaterialType, LocationType>;
    }

    material(materialType: MaterialType): Material<Player, MaterialType, LocationType> {
        if (this.game.items[materialType] === undefined) {
            this.game.items[materialType] = [];
        }
        return new Material<Player, MaterialType, LocationType>(materialType, this.game.items[materialType], (move: ItemMove<Player, MaterialType, LocationType>) => {
            if (this.mutators[materialType] === undefined) {
                this.mutators[materialType] = new MaterialMutator<Player, MaterialType, LocationType>(materialType, this.game.items[materialType]!);
            }
            this.mutators[materialType].applyMove(move);
        });
    }

    setPlayers(players: Player[]) {
        this.game.players = players;
    }

    memorize<T = any>(key: keyof any, value: T | ((lastValue: T) => T), player?: Player) {
        if (this.game.memory[key] === undefined) {
            this.game.memory[key] = {};
        }
        if (player)
        {
            this.game.memory[key][player] = typeof value === 'function' ? (value as (lastValue: T) => T)(this.game.memory[key][player] ?? {}) : value;
        } else {
            this.game.memory[key] = typeof value === 'function' ? (value as (lastValue: T) => T)(this.game.memory[key] ?? {}) : value;
        }
    }

    setRule(ruleId: RuleId, player?: Player, players?: Player[]) {
        this.game.rule!.id = ruleId;
        if (player)
        {
            this.game.rule!.player = player;
        } else if (players)
        {
            this.game.rule!.players = players;
        }
    }

    build(): MaterialGame<Player, MaterialType, LocationType> {
        const gameObject = this.game;
        this.reset();
        return gameObject;
    }


}