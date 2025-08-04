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
        //moved: boolean,// TODO: passt das so?
        //currentDirection: Position;
    }

    export interface IEntity extends EntityData {
        currentHealth: number,
        position: Position,
        untargetable: boolean,
        move(): Promise<void>,
        //move(_friendly: Grid<IEntity>): Promise<void>, //TODO: warum friendly?
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
        moved: boolean;
        // @Björn ich denke es wäre einfacher / besser die aktuelle rotation zu speichern
        currentDirection: Position;//TODO add this to Entity Data, that they have the correct move data 

        #arena: Arena;
        #triggers: Set<EVENT> = new Set();

        constructor(_entity: EntityData, _pos: Position = [0, 0]) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;

            //move stuff
            this.moved = false;
            this.currentDirection = [-1,0]; //facing towards player Side

            this.updateEntityData(_entity);

            EventBus.dispatchEvent({ type: EVENT.ENTITY_CREATE, target: this });
            EventBus.dispatchEvent({ type: EVENT.ENTITY_CREATED, target: this });

            this.registerEventListeners();
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
            //this.moves?; //move data of the entity

            //let occupiedSpots: Position[];
            //newGrid.forEachElement((el) => (occupiedSpots.push(el.position)));//get the positions from entities in the Grid

            //let newPos: Position = this.moveMePls(move, this.position, occupiedSpots);
            //this.position = newPos;

        }

        tryToMove(_grid: Grid<Entity>, maxAlternatives: number): boolean {
            //let grid: Grid<Entity> = _grid;
            //check if the Entity has move data
            let moveData: MoveData;
            moveData = this.select(this.moves, true)[0];//TODO: funktioniert das???? // @Björn das sucht dir alle moves raus die es machen soll - du nimmst aber nur den ersten. Im Moment geht das weil da immer nur einer zurück kommt.
            if (this.moves) { // @Björn hier ggf besser auf moveData testen
                for (let i = 0; i <= maxAlternatives && i <= moveData.blocked.attempts; i++) {
                    // @Björn hier fehlt noch die aktuelle rotation - die wird aktuell noch in nextPositionBasedOnThisRotation einberechnet, aber siehe meinen Kommentar dort
                    // Außerdem solltest du nicht mit blocked.attempts multiplizieren sondern blocked.rotateBy
                    let rotateBy: number = moveData.rotateBy + i * moveData.blocked.attempts; 
                    let nextTransform: Position[] = this.nextPositionBasedOnThisRotation(rotateBy);
                    let nextPosition: Position = nextTransform[0];
                    let nextRotation: Position = nextTransform[1];
                    //check if the position is occupied or out of bounds
                    if (grid.get(nextPosition) || Grid.outOfBounds(nextPosition)) {
                        // @Björn hier nicht komplett abbrechen, nur zur for schleife zurück springen ("continue")
                        // sonst wird immer nur die standard variante getestet, nie die alternativen.
                        return false
                    } else if (grid.get(nextPosition) == undefined) { //spot is free
                        // @Björn hier noch den optionalen dritten parameter auf true setzen damit die entity nicht zweimal im grid ist
                        grid.set(nextPosition, this);
                        this.position = nextPosition;
                        this.currentDirection = nextRotation;
                        // @Björn hier wäre der richtige Zeitpunkt für das EntityMove Event
                        // und auch das EntityMoved event, eines nach dem anderen. Ähnlich wie bei EntityDies / -Died
                        // denk daran die entsprechenden infos dem Event mitzugeben, also welche Entity sich bewegt und von wo nach wo usw.
                        // dann sollte das mit den abilities auch keine Fehler mehr schmeißen.
                        //dispatchEvent(EVENT.ENTITY_MOVED);
                        this.moved = true;
                        return true;
                    }
                }
            } else {// if the entity has no move data we just pretend it already moved
                this.moved = true;
                return true;
            }
            // @Björn denk an default return
        }

        /* @Björn okay, ich glaube ich verstehe wo du damit hin wolltest, ich glaube aber dass es sinnvoller
        wäre das wie folgt aufzuteilen:

        - eine Funktion um auf Basis einer Rotation die richtige direction zu bekommen
        - eine Funktion um auf Basis einer (aktuellen) position, rotation und Schrittlänge die nächste Position zurück zu geben, welche die erste Funktion nutzt

        Dann ist es auch nicht mehr Entity spezifisch und kann allgemeiner angewandt werden.
        Man könnte das in die Move.ts machen und dann hier aufrufen wo man es braucht.
        Außerdem sollte das so deutlich lesbarer und nachvollziehbarer werden denke ich.
        */
        nextPositionBasedOnThisRotation(rotateBy: number): Position[] {
            // curentDirection + nextRotation;
            let directions: Position[] = [
                [1, 0],    // East
                [1, 1],    // North-East
                [0, 1],    // North
                [-1, 1],   // North-West
                [-1, 0],   // West
                [-1, -1],  // South-West
                [0, -1],   // South
                [1, -1]    // South-East
            ];
            let i: number = directions.findIndex(dir => dir[0] === this.currentDirection[0] && dir[1] === this.currentDirection[1]);
            let selector: number = (i + rotateBy) % 8;
            console.log("ID: ", this.id);
            console.log("Position before: ", this.position);
            console.log("Direction before: ", this.currentDirection);
            let pos: Position = [this.position[0] + directions[selector][0], this.position[1] + directions[selector][1]]
            console.log("Position after: ", pos);
            console.log("Direction after: ", directions[selector]);
            return [pos, directions[selector]];
        }

        /* trys to move in a random direction, if it fails it goes through all neighboring spots and takes the first one thats free.
        If all spots are occupied it stays at the same spot*/
        // moveMePls(_move: MoveData, position: Position, _occupiedSpots: Position[]): Position {

        //     let trymove: Position = this.makeAMove(_move, position, _occupiedSpots)
        //     if (trymove == null) {
        //         this.tryAllMoves(_move, _occupiedSpots)
        //     }
        //     return trymove;
        // }

        // makeAMove(_move: MoveData, position: Position, _occupiedSpots: Position[]): Position {
        //     let outOfBounds: boolean = false;
        //     let posX: number = position[0];
        //     let posY: number = position[1];
        //     //move in a passed rotation
        //     switch (_move.rotateBy) {
        //         case 0:
        //             //E
        //             //x + 1
        //             //check out of bounds
        //             if (posX == 2) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX + 1, posY]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 1:
        //             //SE
        //             //x,y + 1
        //             //check out of bounds
        //             if (posX == 2 || posY == 2) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX + 1, posY + 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 2:
        //             //S
        //             //y + 1
        //             //check out of bounds
        //             if (posY == 2) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX, posY + 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 3:
        //             //SW
        //             //y + 1, x - 1
        //             //check out of bounds
        //             if (posX == 0 || posY == 2) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX - 1, posY + 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 4:
        //             //W
        //             //x - 1
        //             //check out of bounds
        //             if (posX == 0) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX - 1, posY]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 5:
        //             //NW
        //             //x - 1, y - 1
        //             //check out of bounds
        //             if (posX == 0 || posY == 0) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX - 1, posY - 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 6:
        //             //N
        //             //y - 1
        //             //check out of bounds
        //             if (posY == 0) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX, posY - 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //         case 7:
        //             //NE
        //             //y - 1, x + 1
        //             //check out of bounds
        //             if (posX == 2 || posY == 0) {
        //                 //out of bounds -> try again
        //                 outOfBounds = true;
        //                 return null;
        //             } else {
        //                 let pos: Position = [posX + 1, posY - 1]
        //                 //check if the position is occupied
        //                 if (this.checkPosOccupied(pos[0], pos[1], _occupiedSpots)) {
        //                     //position is valid
        //                     outOfBounds = false;
        //                     //write to the occupied spots
        //                     _occupiedSpots.push(pos);
        //                     return pos;
        //                 } else {
        //                     //spot is occupied -> try again
        //                     outOfBounds = true;
        //                     return null;
        //                 }
        //             }
        //     }
        //     return null;
        // }
        //TODO: check if this works
        // checkPosOccupied(_posX: number, _posY: number, _occupiedSpots: Position[]): boolean {
        //     let pos: Position = [_posX, _posY]
        //     //check if the position is occupied
        //     if (!_occupiedSpots.some(spot => spot[0] === pos[0] && spot[1] === pos[1])) {
        //         //position is valid
        //         return true;
        //     } else {
        //         //spot is occupied -> try again
        //         return false;
        //     }
        // }

        //iterates through moves until one is valid - used when blocked
        // tryAllMoves(_move: MoveData, _occupiedSpots: Position[]) {
        //     let prevPos: Position = this.position;
        //     //try all moves
        //     for (let _try: number; _try = _move.blocked.attempts; _try++) {
        //         let newPos: Position = this.makeAMove(_move, this.position, _occupiedSpots);
        //         if (newPos != null) {
        //             this.position = newPos;
        //         }
        //     }
        //     if (prevPos == this.position) {
        //         //no free spots avalable

        //     }
        // }

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

        selections = new Map<SelectableWithData<any>, any[]>(); // not sure how to make this type-safe
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
                    case SELECTION_ORDER.RANDOM_EACH_ROUND:
                        this.selections.delete(_options);
                    case SELECTION_ORDER.RANDOM_EACH_FIGHT:
                        let existingSelection = this.selections.get(_options);
                        if (!existingSelection) {
                            existingSelection = chooseRandomElementsFromArray(_options.options, _options.selection.amount);
                            this.selections.set(_options, existingSelection);
                        }
                        selection.push(...existingSelection);
                        break;
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
            this.selections.clear();
            this.removeEventListeners();
        }

    }
}