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
        registerEventListeners(): void;
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

        #arena: Arena;
        #triggers: Set<EVENT> = new Set();

        constructor(_entity: EntityData, _pos: Position = [0, 0]) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;

            this.updateEntityData(_entity);
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
                    await _cause.damage(_amt, _critChance, this);
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
                    await _cause.damage(thorns, 0, this);
                }
                this.setEffectLevel(SPELL_TYPE.THORNS, 0);
            }


            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT_BEFORE, target: this, detail: { amount, crit: wasCrit }, cause: _cause });
            this.currentHealth -= amount;

            await EventBus.dispatchEvent({ type: EVENT.ENTITY_HURT, target: this, cause: _cause, detail: { amount, crit: wasCrit } });

            if (this.currentHealth <= 0) {
                //this entity died
                await EventBus.dispatchEvent({ type: EVENT.ENTITY_DIES, target: this, cause: _cause, detail: { amount } });

                await EventBus.dispatchEvent({ type: EVENT.ENTITY_DIED, target: this, cause: _cause, detail: { amount } });
            }
            return this.currentHealth;
        }

        async affect(_spell: SpellData, _cause?: IEntity): Promise<number> {
            if (this.untargetable) {
                return undefined;
            }
            if (this.resistancesSet.has(_spell.type)) {
                // resisted this spell
                // TODO: dispatch event
                return 0;
            }

            const instantEffects: Set<SPELL_TYPE> = new Set([SPELL_TYPE.HEAL]);
            let amount = _spell.level ?? 1;

            await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECT, detail: { level: amount }, trigger: _spell, target: this, cause: _cause })
            if (!instantEffects.has(_spell.type)) {
                let value = this.activeEffects.get(_spell.type) ?? 0;
                value += amount;
                this.activeEffects.set(_spell.type, value);
                await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECTED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause })
                return value;
            }

            switch (_spell.type) {
                case SPELL_TYPE.HEAL: {
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_HEAL, detail: { level: amount }, trigger: _spell, target: this, cause: _cause })
                    // TODO: call Visualizer
                    // TODO: prevent overheal?
                    this.currentHealth += amount;
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_HEALED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause })
                    await EventBus.dispatchEvent({ type: EVENT.ENTITY_AFFECTED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause })
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
            let move: MoveData = {
                rotateBy: Math.floor(Math.random() * 8),
                //direction: DIRECTION_RELATIVE,
                distance: 1,
                /** If this unit is blocked from moving in the desired direction, what should it do? */
                blocked: {
                    /** how many increments of 45° should it rotate _(clockwise)_ to try again? */
                    rotateBy: 1,
                    /** How many attempts should it make to rotate and move again? default: 1, max 8 */
                    attempts: 8,
                }
            };

            //TODO: calculate new position from data here
            this.position = [this.position[0], this.position[1]]
            //TODO: get the entities grid side
            let side = "home";
            let OldGrid = new Grid<Entity>;//TODO: get the correct Grid 
            //create new grid and place entities in it
            let NewGrid = new Grid<Entity>//TODO: replace old Grid
            //get the occupied Spots position data
            let pos: Position;
            let occupiedSpots: Position[];
            OldGrid.forEachElement((el) => (occupiedSpots.push(el.position)));//get the positions from entities in the Grid

            let offset: Position = this.getOffsetPositionByMoveData(move, this.position, side, occupiedSpots);

        }

        getOffsetPositionByMoveData(_move: MoveData, position: Position, _side: string, _occupiedSpots: Position[]): Position {
            let posX: number = position[0];
            let posY: number = position[1];
            let outOfBounds: boolean = false;
            //repeat until not out of bounds
            while (!outOfBounds) {
                switch (_move.rotateBy) {
                    case 0:
                        //E
                        //x + 1
                        //check out of bounds
                        if (posX == 2) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            let pos: Position = [posX + 1, posY]
                            //TODO: fix this, position array
                            if (_occupiedSpots.find(pos) == undefined) {
                                outOfBounds = false;
                                //calculate position
                                posX += 1;
                            }
                        }
                    case 1:
                        //SE
                        //x,y + 1
                        //check out of bounds
                        if (posX == 2 || posY == 2) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posX += 1;
                            posY += 1;
                        }
                    case 2:
                        //S
                        //y + 1
                        //check out of bounds
                        if (posY == 2) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posY += 1;
                        }
                    case 3:
                        //SW
                        //y + 1, x - 1
                        //check out of bounds
                        if (posX == 0 || posY == 2) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posX -= 1;
                            posY += 1;
                        }
                    case 4:
                        //W
                        //x - 1
                        //check out of bounds
                        if (posX == 0) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posX -= 1;
                        }
                    case 5:
                        //NW
                        //x - 1, y - 1
                        //check out of bounds
                        if (posX == 0 || posY == 0) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posX -= 1;
                            posY -= 1;
                        }
                    case 6:
                        //N
                        //y - 1
                        //check out of bounds
                        if (posY == 0) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posY -= 1;
                        }
                    case 7:
                        //NE
                        //y - 1, x + 1
                        //check out of bounds
                        if (posX == 2 || posY == 0) {
                            //out of bounds -> try again
                            outOfBounds = true;
                            break;
                        } else {
                            outOfBounds = false;
                            //calculate position
                            posX += 1;
                            posY -= 1;
                        }
                }
            }

            return [posX, posY];
        }


        async useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _spells: SpellData[] = this.select(this.spells, true), _targetsOverride?: IEntity[]): Promise<void> {
            if (!_spells) return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            await executeSpell.call(this, _spells, _friendly, _opponent, _targetsOverride);
        }
        async useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _attacks: AttackData[] = this.select(this.attacks, true), _targetsOverride?: IEntity[]): Promise<void> {
            if (!_attacks || _attacks.length === 0) return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            await executeAttack.call(this, _attacks, _friendly, _opponent, _targetsOverride);
        }

        getOwnDamage(): number {
            const attacks = this.select(this.attacks, false);
            let total: number = this.getDamageOfAttacks(attacks, false);
            return total;
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
            // TODO: should abilities be blocked by stun?
            for (let ability of this.abilities) {
                await executeAbility.call(this, ability, this.#arena, _ev);
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
                        await this.damage(value, 0);
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
            this.removeEventListeners();
        }

    }
}