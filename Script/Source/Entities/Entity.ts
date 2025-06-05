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
        damage(_amt: number, _critChance: number): number;
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
        activeEffects = new Map<SPELL_TYPE, number>();

        protected visualizer: IVisualizeEntity;

        constructor(_entity: EntityData, _vis: IVisualizer, _pos: Position = [0,0]) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves) this.moves = "selection" in _entity.moves ? _entity.moves : { options: [_entity.moves], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells) this.spells = "selection" in _entity.spells ? _entity.spells : { options: [_entity.spells], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks) this.attacks = "selection" in _entity.attacks ? _entity.attacks : { options: [_entity.attacks], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };


            this.visualizer = _vis.getEntity(this);
        }
        damage(_amt: number, _critChance: number): number {
            let wasCrit: boolean = false;
            if (_critChance > Math.random()) {
                _amt *= 2;
                wasCrit = true;
            }
            this.currentHealth -= _amt;
            this.visualizer.hurt(_amt, wasCrit);
            //TODO add Event
            if (this.currentHealth <= 0) {
                //TODO this entity died, handle that.
            }
            return this.currentHealth;
        }
        async move(): Promise<void> {
            ;
        }
        async useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void> {
            const spells = this.select(this.spells, true);
            for (let spell of spells) {
                await this.visualizer.spell(spell);
            }
        }
        async useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void> {
            const attacks = this.select(this.attacks, true);
            for (let attack of attacks) {
                // get the target(s)
                let targets = getTargets(attack.target, _friendly, _opponent, this);
                // execute the attacks
                await this.visualizer.attack(attack, targets);
                let attackDmg = this.getDamageOfAttacks([attack], true);
                targets.forEach((target) => { target.damage(attackDmg, attack.baseCritChance) });
            }
        }
        getOwnDamage(): number {
            const attacks = this.select(this.attacks, false);
            let total: number = this.getDamageOfAttacks(attacks, false);
            return total;
        }

        updateVisuals(): void {
            this.visualizer.updateVisuals();
        }

        protected select<T extends Object>(_options: SelectableWithData<T>, _use: boolean): T[] {
            if (!_options) return [];
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

        protected getDamageOfAttacks(_attacks: Readonly<AttackDataNoTarget[]>, _consumeEffects: boolean): number {
            let weaknesses: number = this.activeEffects.get(SPELL_TYPE.WEAKNESS) ?? 0;
            let strengths: number = this.activeEffects.get(SPELL_TYPE.STRENGTH) ?? 0;
            let totalDamage: number = 0;

            for (let atk of _attacks) {
                let atkDmg = atk.baseDamage;
                if (strengths > 0) {
                    atkDmg *= 2;
                    strengths--;
                }
                if (weaknesses > 0) {
                    atkDmg = 0;
                    weaknesses--;
                }
                totalDamage += atkDmg;
            }

            if (_consumeEffects) {
                this.activeEffects.set(SPELL_TYPE.WEAKNESS, weaknesses);
                this.activeEffects.set(SPELL_TYPE.STRENGTH, strengths);
            }

            return totalDamage;
        }
    }
}