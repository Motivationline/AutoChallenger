namespace Script {
    type SelectableWithData<T> = Selectable<T> & {
        counter?: number,
    }

    export interface EntityData {
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
        moves?: Selectable<MoveData>,
        spells?: Selectable<SpellData>,
        attacks?: Selectable<AttackData>,
        /** Modifiers to protect against Spells. It's a multiplier.
         * 
         * 0 => no effect
         * 0.5 => half as powerful
         * 1 => normal
         * 2 => twice as powerful
        */
        resistances?: [SPELL_TYPE, number][],
        abilities?: AbilityData[],
    }

    export interface IEntity extends EntityData {
        currentHealth: number,
        position: Position,
        move(_friendly: Grid<IEntity>): Promise<void>,
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        damage(_amt: number): number;
        getOwnDamage(): number;
        updateVisuals(_arena: Arena): void;
    }

    export class Entity implements IEntity {
        currentHealth: number;
        position: Position;
        id: string;
        parent?: string;
        health?: number;
        moves?: Selectable<MoveData>;
        spells?: Selectable<SpellData>;
        attacks?: Selectable<AttackData>;
        abilities?: AbilityData[];
        resistances?: [SPELL_TYPE, number][];
        startDirection?: number;

        protected visualizer: IVisualizeEntity;

        constructor(_entity: EntityData, _vis: IVisualizer) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves) this.moves = "selection" in _entity.moves ? _entity.moves : { options: [_entity.moves], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells) this.spells = "selection" in _entity.spells ? _entity.spells : { options: [_entity.spells], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks) this.attacks = "selection" in _entity.attacks ? _entity.attacks : { options: [_entity.attacks], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };


            this.visualizer = _vis.getEntity(this);
        }
        damage(_amt: number): number {
            throw new Error("Method not implemented.");
        }
        async move(): Promise<void> {
            ;
        }
        async useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void> {
            const spells = this.select(this.spells);
            for (let spell of spells) {
                await this.visualizer.spell(spell);
            }
        }
        async useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void> {
            const attacks = this.select(this.attacks);
            for (let attack of attacks) {
                // get the target(s)
                let target = getTargets(attack.target, _friendly, _opponent);
                // execute the attacks
                await this.visualizer.attack(attack);
            }
        }
        getOwnDamage(): number {
            throw new Error("Method not implemented.");
        }
        updateVisuals(): void {
            // 
        }

        protected select<T extends Object>(_options: SelectableWithData<T>): T[] {
            if(!_options) return [];
            const selection: T[] = [];
            if ("options" in _options) {
                if (!_options.selection.amount) _options.selection.amount = Infinity;
                switch (_options.selection.order) {
                    case SELECTION_ORDER.ALL:
                        _options.counter = 0;
                    case SELECTION_ORDER.SEQUENTIAL:
                        if (!_options.counter) _options.counter = 0;
                        for (let i: number = 0; i < _options.selection.amount && i < _options.options.length; i++) {
                            selection.push(_options.options[(i + _options.counter) % _options.options.length]);
                            _options.counter = (_options.counter + 1) % _options.options.length;
                        }
                        break;
                    case SELECTION_ORDER.RANDOM_EACH_FIGHT:
                    case SELECTION_ORDER.RANDOM_EACH_ROUND:
                }
                return selection;
            }

            return [_options];
        }
    }
}