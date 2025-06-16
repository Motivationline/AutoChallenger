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
        /** If it's in this list, this kind of spell is ignored by the entity.*/
        resistances?: SPELL_TYPE[],
        abilities?: AbilityData[],
    }

    export interface IEntity extends EntityData {
        currentHealth: number,
        position: Position,
        move(_friendly: Grid<IEntity>): Promise<void>,
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        getOwnDamage(): number;
        updateVisuals(_arena: Arena): void;
        registerEventListeners(): void;
        getVisualizer(): Readonly<IVisualizeEntity>;
        setGrids(_home: Grid<IEntity>, _away: Grid<IEntity>): void;
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
        resistances?: SPELL_TYPE[];
        resistancesSet? = new Set<SPELL_TYPE>();
        startDirection?: number;
        activeEffects = new Map<SPELL_TYPE, number>();

        protected visualizer: IVisualizeEntity;

        #arena: Arena;

        constructor(_entity: EntityData, _vis: IVisualizer, _pos: Position = [0, 0]) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves) this.moves = "selection" in _entity.moves ? _entity.moves : { options: [_entity.moves], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells) this.spells = "selection" in _entity.spells ? _entity.spells : { options: [_entity.spells], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks) this.attacks = "selection" in _entity.attacks ? _entity.attacks : { options: [_entity.attacks], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            this.abilities = _entity.abilities;
            this.resistances = _entity.resistances;
            this.resistancesSet = new Set(_entity.resistances);


            this.visualizer = _vis.getEntity(this);
        }
        getVisualizer(): Readonly<IVisualizeEntity> {
            return this.visualizer;
        }

        async damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number> {
            let wasCrit: boolean = false;
            if (_critChance > Math.random()) {
                _amt *= 2;
                wasCrit = true;
            }
            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT_BEFORE, target: this, value: _amt, cause: _cause });
            this.currentHealth -= _amt;
            this.visualizer.hurt(_amt, wasCrit);

            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT, target: this, cause: _cause });

            if (this.currentHealth <= 0) {
                //TODO this entity died, handle that.
            }
            return this.currentHealth;
        }

        async affect(_spell: SpellData, _cause?: IEntity): Promise<number> {
            if (this.resistancesSet.has(_spell.type)) {
                // resisted this spell
                await this.visualizer.resist();
                return 0;
            }
            let value = this.activeEffects.get(_spell.type) ?? 0;
            value += _spell.level ?? 1;
            this.activeEffects.set(_spell.type, value);
            return value;
        }

        async move(): Promise<void> {
            ;
        }
        async useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _spells: SpellData[] = this.select(this.spells, true), _targetsOverride?: IEntity[]): Promise<void> {
            for (let spell of _spells) {
                let targets = _targetsOverride ?? getTargets(spell.target, _friendly, _opponent, this);
                await this.visualizer.spell(spell, targets);
                for (let target of targets) {
                    await target.affect(spell, this);
                }
            }
        }
        async useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _attacks: AttackData[] = this.select(this.attacks, true), _targetsOverride?: IEntity[]): Promise<void> {
            for (let attack of _attacks) {
                // get the target(s)
                let targets = _targetsOverride ?? getTargets(attack.target, _friendly, _opponent, this);
                // execute the attacks
                await this.visualizer.attack(attack, targets);
                let attackDmg = this.getDamageOfAttacks([attack], true);
                for (let target of targets) {
                    await target.damage(attackDmg, attack.baseCritChance, this);
                }
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

        updateUI(_round: number): void {
            this.visualizer.updateUI(_round);
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


        setGrids(_home: Grid<Entity>, _away: Grid<Entity>): void {
            this.#arena = {
                home: _home,
                away: _away,
            };
        }

        public registerEventListeners() {
            // register abilities
            let triggers: Set<EVENT> = new Set(); // get all triggers first to avoid duplication
            if (this.abilities) {
                for (let ability of this.abilities) {
                    if (Array.isArray(ability.on)) {
                        for (let ev of ability.on) {
                            triggers.add(ev);
                        }
                    } else {
                        triggers.add(ability.on);
                    }
                }
            }
            for (let trigger of triggers.values()) {
                EventBus.addEventListener(trigger, this.abilityEventListener);
            }

            // register end of turn effects
            EventBus.addEventListener(EVENT.ROUND_END, this.endOfRoundEventListener);
        }

        private abilityEventListener = async (_ev: FightEvent) => {
            // this extra step seems pointless, but this way we can
            // overwrite `runAbility` in a derived class, which we can't do with
            // abilityEventListener.
            await this.runAbility(_ev);
        }

        protected async runAbility(_ev: FightEvent) {
            if (!this.abilities) return;
            nextAbility: for (let ability of this.abilities) {
                // correct type of event
                if (Array.isArray(ability.on)) {
                    if (!ability.on.includes(_ev.type)) continue;
                } else {
                    if (ability.on !== _ev.type) continue;
                }

                // are conditions met?
                if (ability.conditions) {
                    let conditions = Array.isArray(ability.conditions) ? ability.conditions : [ability.conditions];
                    for (let condition of conditions) {
                        if (condition.target && this.#arena && _ev.target) {
                            let validTargets = getTargets(condition.target, this.#arena.home, this.#arena.away, this);
                            if (!validTargets.includes(_ev.target)) continue nextAbility;
                        }
                        if (condition.cause && this.#arena && _ev.cause) {
                            let validTargets = getTargets(condition.cause, this.#arena.home, this.#arena.away, this);
                            if (!validTargets.includes(_ev.cause)) continue nextAbility;
                        }
                        if (condition.value && _ev.value !== undefined) {
                            if (typeof condition.value === "number") {
                                if (condition.value !== _ev.value) continue nextAbility;
                            } else {
                                let min = condition.value.min ?? -Infinity;
                                let max = condition.value.max ?? Infinity;
                                if (min > _ev.value || max < _ev.value) continue nextAbility;
                            }
                        }
                    }
                }

                // if we get here, we're ready to do the ability
                let targets: IEntity[] = undefined;
                if (ability.target === "cause") {
                    if (_ev.cause)
                        targets = [_ev.cause]
                }
                else if (ability.target === "target") {
                    if (_ev.target)
                        targets = [_ev.target]
                }
                else {
                    targets = getTargets(ability.target, this.#arena.home, this.#arena.away);
                }

                // no targets found, no need to do the ability
                if (!targets) continue nextAbility;

                if (ability.attack) {
                    await this.useAttack(this.#arena.home, this.#arena.away, [{ target: undefined, ...ability.attack }], targets);
                }

                if (ability.spell) {
                    await this.useSpell(this.#arena.home, this.#arena.away, [{ target: undefined, ...ability.spell }], targets);
                }

            }
        }

        private endOfRoundEventListener = async (_ev: FightEvent) => {
            await this.handleEndOfTurn(_ev);
        }

        protected async handleEndOfTurn(_ev: FightEvent) {
            // take care of DOTs
            const relevantSpells: SPELL_TYPE[] = [SPELL_TYPE.FIRE, SPELL_TYPE.POISON];
            for (let spell of relevantSpells) {
                if (!this.activeEffects.has(spell)) continue;
                let value = this.activeEffects.get(spell);
                if (value <= 0) continue;
                this.damage(value, 0);
                this.activeEffects.set(spell, --value);
            }
        }


    }
}