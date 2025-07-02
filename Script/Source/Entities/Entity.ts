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
        untargetable: boolean,
        move(_friendly: Grid<IEntity>): Promise<void>,
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>,
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        getOwnDamage(): number;
        updateVisuals(_arena: Arena): void;
        registerEventListeners(): void;
        getVisualizer(): VisualizeEntity;
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

        protected visualizer: VisualizeEntity;

        #arena: Arena;
        #triggers: Set<EVENT> = new Set();

        constructor(_entity: EntityData, _vis: IVisualizer, _pos: Position = [0, 0]) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;

            this.updateEntityData(_entity);

            this.visualizer = _vis.getEntity(this);
        }

        public get untargetable() {
            if (this.activeEffects.get(SPELL_TYPE.UNTARGETABLE) > 0) {
                return true;
            }
            return false;
        }

        public get stunned() {
            if (this.activeEffects.get(SPELL_TYPE.STUN) > 0) {
                return true;
            }
            return false;
        }

        updateEntityData(_newData: EntityData) {
            this.id = _newData.id;
            
            let healthDifference = (_newData.health ?? 1) - (this.health ?? 0);
            this.currentHealth = (this.health ?? 0) + healthDifference;
            this.health = _newData.health ?? 1;

            if (_newData.moves) this.moves = "selection" in _newData.moves ? _newData.moves : { options: [_newData.moves], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_newData.spells) this.spells = "selection" in _newData.spells ? _newData.spells : { options: [_newData.spells], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            if (_newData.attacks) this.attacks = "selection" in _newData.attacks ? _newData.attacks : { options: [_newData.attacks], selection: { order: SELECTION_ORDER.ALL, amount: 1 } };
            this.abilities = _newData.abilities;
            this.resistances = _newData.resistances;
            this.resistancesSet = new Set(_newData.resistances);
        }

        getVisualizer(): VisualizeEntity {
            return this.visualizer;
        }

        async damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number> {
            if (this.untargetable) {
                return this.health;
            }
            let wasCrit: boolean = false;
            let amount: number = _amt;

            // mirror
            if (this.activeEffects.has(SPELL_TYPE.MIRROR) && _cause) {
                let mirrors = Math.max(0, this.activeEffects.get(SPELL_TYPE.MIRROR));
                if (mirrors > 0) {
                    _cause.damage(_amt, _critChance, this);
                    mirrors--;
                    this.setEffectLevel(SPELL_TYPE.MIRROR, mirrors);
                    // TODO: Event for mirror effect?
                    return this.currentHealth;
                }
                this.activeEffects.set(SPELL_TYPE.MIRROR, 0);
            }

            // crit
            if (_critChance > Math.random()) {
                amount *= 2;
                wasCrit = true;
            }

            // vulnerable
            if (this.activeEffects.has(SPELL_TYPE.VULNERABLE)) {
                let vulnerable = Math.max(0, this.activeEffects.get(SPELL_TYPE.VULNERABLE));
                if (vulnerable > 0) {
                    amount *= 2;
                    vulnerable--;
                }
                this.setEffectLevel(SPELL_TYPE.VULNERABLE, vulnerable);

            }

            // shields
            if (this.activeEffects.has(SPELL_TYPE.SHIELD)) {
                let shields = Math.max(0, this.activeEffects.get(SPELL_TYPE.SHIELD));
                while (amount > 0 && shields > 0) {
                    amount--; shields--;
                }
                // TODO: Event for breaking shields? Or maybe event for triggering effect in general?
                this.setEffectLevel(SPELL_TYPE.SHIELD, shields);
            }

            // thorns
            if (this.activeEffects.has(SPELL_TYPE.THORNS) && _cause) {
                let thorns = Math.max(0, this.activeEffects.get(SPELL_TYPE.THORNS));
                if (thorns > 0) {
                    _cause.damage(thorns, 0, this);
                }
                this.setEffectLevel(SPELL_TYPE.THORNS, 0);
            }


            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT_BEFORE, target: this, value: amount, cause: _cause });
            this.currentHealth -= amount;
            this.visualizer.hurt(amount, wasCrit);

            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT, target: this, cause: _cause, value: amount });

            if (this.currentHealth <= 0) {
                //this entity died
                await EventBus.dispatchEvent({ type: EVENT.ENTITY_DIES, target: this, cause: _cause, value: amount });

                await EventBus.dispatchEvent({ type: EVENT.ENTITY_DIED, target: this, cause: _cause, value: amount });
            }
            return this.currentHealth;
        }

        async affect(_spell: SpellData, _cause?: IEntity): Promise<number> {
            if (this.untargetable) {
                return undefined;
            }
            if (this.resistancesSet.has(_spell.type)) {
                // resisted this spell
                await this.visualizer.resist();
                return 0;
            }

            const instantEffects: Set<SPELL_TYPE> = new Set([SPELL_TYPE.HEAL]);
            let amount = _spell.level ?? 1;

            await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECT, value: amount, trigger: _spell, target: this, cause: _cause })
            if (!instantEffects.has(_spell.type)) {
                let value = this.activeEffects.get(_spell.type) ?? 0;
                value += amount;
                this.activeEffects.set(_spell.type, value);
                await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECTED, value: amount, trigger: _spell, target: this, cause: _cause })
                return value;
            }

            switch (_spell.type) {
                case SPELL_TYPE.HEAL: {
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_HEAL, value: amount, trigger: _spell, target: this, cause: _cause })
                    // TODO: call Visualizer
                    // TODO: prevent overheal?
                    this.currentHealth += amount;
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_HEALED, value: amount, trigger: _spell, target: this, cause: _cause })
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECTED, value: amount, trigger: _spell, target: this, cause: _cause })
                    break;
                }
            }
            return 0;
        }

        async setEffectLevel(_spell: SPELL_TYPE, value: number) {
            if (value > 0) {
                this.activeEffects.set(_spell, value);
            } else {
                this.activeEffects.delete(_spell);
            }
        }

        async move(): Promise<void> {
            ;
        }
        async useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _spells: SpellData[] = this.select(this.spells, true), _targetsOverride?: IEntity[]): Promise<void> {
            if (!_spells) return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            for (let spell of _spells) {
                let targets = _targetsOverride ?? getTargets(spell.target, _friendly, _opponent, this);
                await this.visualizer.spell(spell, targets);
                for (let target of targets) {
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_SPELL_BEFORE, trigger: spell, cause: this, target })
                    await target.affect(spell, this);
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_SPELL, trigger: spell, cause: this, target })
                }
            }
        }
        async useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _attacks: AttackData[] = this.select(this.attacks, true), _targetsOverride?: IEntity[]): Promise<void> {
            if (!_attacks) return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            for (let attack of _attacks) {
                // get the target(s)
                let targets = _targetsOverride ?? getTargets(attack.target, _friendly, _opponent, this);
                // execute the attacks
                await this.visualizer.attack(attack, targets);
                let attackDmg = this.getDamageOfAttacks([attack], true);
                for (let target of targets) {
                    EventBus.dispatchEvent({ type: EVENT.ENTITY_ATTACK, cause: this, target: this, trigger: attack, value: attackDmg })
                    await target.damage(attackDmg, attack.baseCritChance, this);
                    EventBus.dispatchEvent({ type: EVENT.ENTITY_ATTACKED, cause: this, target: this, trigger: attack, value: attackDmg })
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
                this.setEffectLevel(SPELL_TYPE.WEAKNESS, weaknesses);
                this.setEffectLevel(SPELL_TYPE.STRENGTH, strengths);
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
            this.#triggers = new Set(); // get all triggers first to avoid duplication
            if (this.abilities) {
                for (let ability of this.abilities) {
                    if (Array.isArray(ability.on)) {
                        for (let ev of ability.on) {
                            this.#triggers.add(ev);
                        }
                    } else {
                        this.#triggers.add(ability.on);
                    }
                }
            }
            for (let trigger of this.#triggers.values()) {
                EventBus.addEventListener(trigger, this.abilityEventListener);
            }
            
            // register end of turn effects
            EventBus.addEventListener(EVENT.ROUND_END, this.endOfRoundEventListener);
            // register end of fight effects
            EventBus.addEventListener(EVENT.FIGHT_END, this.endOfFightEventListener);
        }
        
        public removeEventListeners() {
            for (let trigger of this.#triggers.values()) {
                EventBus.removeEventListener(trigger, this.abilityEventListener);
            }

            EventBus.removeEventListener(EVENT.ROUND_END, this.endOfRoundEventListener);
            EventBus.removeEventListener(EVENT.FIGHT_END, this.endOfFightEventListener);
        }

        private abilityEventListener = async (_ev: FightEvent) => {
            // this extra step seems pointless, but this way we can
            // overwrite `runAbility` in a derived class, which we can't do with
            // abilityEventListener.
            await this.runAbility(_ev);
        }

        protected async runAbility(_ev: FightEvent) {
            if (!this.abilities) return;
            for (let ability of this.abilities) {
                executeAbility.call(this, ability, this.#arena, _ev);
            }
        }

        private endOfRoundEventListener = async (_ev: FightEvent) => {
            await this.handleEndOfTurn(_ev);
        }

        protected async handleEndOfTurn(_ev: FightEvent) {
            // take care of DOTs
            const relevantSpells: SPELL_TYPE[] = [SPELL_TYPE.FIRE, SPELL_TYPE.POISON, SPELL_TYPE.STUN, SPELL_TYPE.UNTARGETABLE];
            const damagingSpells: SPELL_TYPE[] = [SPELL_TYPE.FIRE, SPELL_TYPE.POISON];
            for (let spell of relevantSpells) {
                if (!this.activeEffects.has(spell)) continue;
                let value = this.activeEffects.get(spell);
                if (value > 0) {
                    if (damagingSpells.includes(spell)) {
                        this.damage(value, 0);
                    }
                }
                this.setEffectLevel(spell, --value);
            }
        }

        private endOfFightEventListener = async (_ev: FightEvent) => {
            await this.handleEndOfFight(_ev);
        }

        protected async handleEndOfFight(_ev: FightEvent) {
            this.activeEffects.clear();
        }

    }
}