namespace Script {

    export interface IEntityData {
        id: string,
        parent?: string,
        /** The amount of health the entity starts with. _Default: 1_ */
        health?: number,
        /** 
         * The direction the entity should be oriented in when spawned.  
         * 0 = 8 = towards opponents, 2 = up, 4 = away from opponents, 6 = down 
         * Default: 0
         */
        startDirection?: number,
        moves?: Moves | Move,
        spells?: Spells | Spell,
        attacks?: Attacks | Attack,
        /** Modifiers to protect against Spells. It's a multiplier.
         * 
         * 0 => no effect
         * 0.5 => half as powerful
         * 1 => normal
         * 2 => twice as powerful
        */
        resistances?: [SPELL_TYPE, number][],
        abilities?: iAbility[],
    }

    export interface iEntity extends IEntityData {
        currentHealth: number,
        position: Position,
        move(): Promise<void>,
        useSpell(_arena: Arena): Promise<void>,
        useAttack(_arena: Arena): Promise<void>,
        getDamage(): number;
        updateVisuals(): void;
    }

    export class Entity implements iEntity {
        currentHealth: number;
        position: Position;
        id: string;
        parent?: string;
        health?: number;
        moves?: Moves;
        spells?: Spells;
        attacks?: Attacks;
        resistances?: [SPELL_TYPE, number][];
        startDirection?: number;

        #visualizer: IVisualizeEntity;

        constructor(_entity: IEntityData, _vis: IVisualizer) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves) this.moves = "moves" in _entity.moves ? _entity.moves : { moves: [_entity.moves], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells) this.spells = "spells" in _entity.spells ? _entity.spells : { spells: [_entity.spells], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks) this.attacks = "attacks" in _entity.attacks ? _entity.attacks : { attacks: [_entity.attacks], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };


            this.#visualizer = _vis.getEntity(this);
        }
        getDamage(): number {
            throw new Error("Method not implemented.");
        }
        useSpell(_arena: Arena): Promise<void> {
            throw new Error("Method not implemented.");
        }
        useAttack(_arena: Arena): Promise<void> {
            throw new Error("Method not implemented.");
        }
        move(): Promise<void> {
            throw new Error("Method not implemented.");
        }
        updateVisuals(): void {
            // 
        }
    }
}