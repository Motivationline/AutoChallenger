namespace Script {
    //#region Definitions

    export enum SELECTION_ORDER {
        /** Selects options in order, loops around when found */
        SEQUENTIAL = "sequential",
        /** Chooses random options for the entire fight */
        RANDOM_EACH_FIGHT = "randomEachFight",
        /** Chooses random options for each round */
        RANDOM_EACH_ROUND = "randomEachRound",
        /** Chooses all options, always starting from the first */
        ALL = "all",
    }

    export interface Selection {
        order: SELECTION_ORDER,
        /** how many should be selected. Leave blank or 0 to select all. */
        amount?: number,
    }

    export type Selectable<T> = T | {
        options: T[],
        selection: Selection,
    }

    //#region Area
    export enum AREA_SHAPE_PATTERN {
        /** Choose your own pattern */
        PATTERN = "pattern",
    }
    export enum AREA_SHAPE_OTHERS {
        /** Target a single Slot */
        SINGLE = "single",
        /** Target an entire row */
        ROW = "row",
        /** Target an entire column */
        COLUMN = "column",
        /** Target enemies in a plus shape, so basically column + row */
        PLUS = "plus",
        /** Target enemies in an X shape, so all the corners but not the center */
        DIAGONALS = "diagonals",
        /** Target all enemies except in the center position */
        SQUARE = "square",
    }

    export const AREA_SHAPE = Object.assign({}, AREA_SHAPE_PATTERN, AREA_SHAPE_OTHERS);


    export enum AREA_POSITION_ABSOLUTE {
        /** Choose a fixed position */
        ABSOLUTE = "absolute",
    }
    export enum AREA_POSITION_RELATIVE {
        /** Selects first (from center) in the same row */
        RELATIVE_FIRST_IN_ROW = "relativeFirstInRow",
        /** Selects last (from center) in the same row */
        RELATIVE_LAST_IN_ROW = "relativeLastInRow",
        /** Selects the same spot, so top left -> top left */
        RELATIVE_SAME = "relativeSame",
        /** Selects the same spot but mirrored, so top left -> top right*/
        RELATIVE_MIRRORED = "relativeMirrored",
    }

    export const AREA_POSITION = Object.assign({}, AREA_POSITION_ABSOLUTE, AREA_POSITION_RELATIVE);

    type AreaRelative = {
        /** ## Option 1: Choose a position relative to the executors position */
        position: AREA_POSITION_RELATIVE,
    }

    type AreaAbsolute = {
        /** ## Option 2: Choose a fixed position  
         * **requires `absolutePosition` attribute**
         */
        position: AREA_POSITION_ABSOLUTE,
        /** zero-indexed position in the grid to place the **center** of the targeting. */
        absolutePosition: Position,
    }

    type AreaPositioned = (AreaRelative | AreaAbsolute);

    type AreaTargetPattern = {
        /** ### Option 2: Choose your own pattern.  
         * **requires `pattern` attribute.** */
        shape: AREA_SHAPE_PATTERN,
        /** Draw your own pattern. Needs to be 3x3 and filled like this:
         * - falsy for "no attack" (e.g. `0`, `false`, `""`, `null`, `undefined` or just empty)
         * - truthy for "attack" (e.g. `1`, `true`, `"X"`)
         * 
         * ### examples
         * ```
         * [[0, 1, 0],
         *   [1, 0, 1],
         *   [0, 1, 0]]
         * [["", "X", ""],
         *   ["X", "", "X"],
         *   ["", "X", ""]]
         * [[false, true, false],
         *   [true, false, true],
         *   [false, true, false]]
         * // you can mix and match
         * [[0, 1, 0],
         *   ["X", "", "X"],
         *   [false, true, false]]
         * // undefined aka leaving empty is also valid (though notice the extra , at the end)
         * [[,1,,], // => [undefined, 1, undefined,]
         *   [1,,1], // => [1, undefined, 1]
         *   [,1,,]] // => [undefined, 1, undefined,]
         * // smallest valid empty pattern
         * [[,,,],[,,,],[,,,]]
         * ```
         */
        pattern: GridData<any>,
    }

    type AreaTargetOthers = {
        /** ### Option 1: Choose one of the predefined shapes */
        shape: AREA_SHAPE_OTHERS,
    }

    type AreaTarget = AreaTargetOthers | AreaTargetPattern;

    /**
     * Defines the area that something is supposed to happen in. Requires the following attributes:
     * 
     * - position: AREA_POSITION
     *   - absolutePosition: Position _only if `position === ABSOLUTE`_
     * - shape **or** shape**s**
     *   - shape: AREA_SHAPE
     *     - pattern: string[][] _only if `target === PATTERN`_ 
     *   - shape**s**: Array of target Objects
     *     - order: AREA_SHAPE_ORDER
     */
    type Area = AreaTarget & AreaPositioned;
    //#endregion

    //#region Target

    export enum TARGET_SIDE {
        /** Your own side */
        ALLY = "ally",
        /** Your opponents side */
        OPPONENT = "opponent",
    }

    type TargetBase = {
        /** Which side to target on, your own or the opponents */
        side: TARGET_SIDE,
        /** Whether to exclude yourself from the targeting options. _default: `false`_ */
        excludeSelf?: boolean,
    }

    type TargetArea = {
        /** What area of the selected side should be targeted */
        area: Area;
    }

    export enum TARGET_SORT {
        /** Whatever order they happen to be in memory in */
        ARBITRARY = "arbitrary",
        /** randomize order */
        RANDOM = "random",
        /** order by attack / damage (highest first) */
        STRONGEST = "strongest",
        /** order by health (highest first) */
        HEALTHIEST = "healthiest",
    }

    type TargetEntity = {
        /** Select an entity from the chosen side */
        entity: {
            /** In which order should the entities be processed? 
             * 
             * - `arbitrary` (default): Whatever order they happen to be in memory in  
             * - `random`: randomize their order
             * - `strongest`: order by attack / damage (highest first)
             * - `healthiest`: order by health (highest first)
            */
            sortBy?: TARGET_SORT,
            /** If true, reverses the selection order */
            reverse?: boolean,
            /** How many targets should at most be targeted? Leave empty for "all" */
            maxNumTargets?: number,
        }
    }

    export type TargetTarget = TargetArea | TargetEntity;

    export type Target = TargetBase & TargetTarget;

    export namespace TARGET {
        export const SELF: Readonly<Target> = { area: { position: AREA_POSITION.RELATIVE_MIRRORED, shape: AREA_SHAPE.SINGLE }, side: TARGET_SIDE.ALLY };
        export const FIRST_ENEMY_SAME_ROW: Readonly<Target> = { area: { position: AREA_POSITION.RELATIVE_FIRST_IN_ROW, shape: AREA_SHAPE.SINGLE }, side: TARGET_SIDE.OPPONENT };
        export const RANDOM_ENEMY: Readonly<Target> = { entity: { sortBy: TARGET_SORT.RANDOM, maxNumTargets: 1 }, side: TARGET_SIDE.OPPONENT };
        export const RANDOM_ALLY: Readonly<Target> = { entity: { sortBy: TARGET_SORT.RANDOM, maxNumTargets: 1 }, side: TARGET_SIDE.ALLY, excludeSelf: true };
    }
    //#endregion
    //#endregion

    //#region Implementation

    export function getTargets(_target: Target, _allies: Grid<IEntity>, _opponents: Grid<IEntity>, _self: IEntity): IEntity[] {
        if (!_target) return [];
        const targets: IEntity[] = [];
        const side: Grid<IEntity> = _target.side === TARGET_SIDE.ALLY ? _allies : _opponents;

        // entity selector
        if ("entity" in _target) {
            side.forEachElement((entity) => {
                if (!entity) return;
                if (entity.untargetable) return;
                if (_target.excludeSelf && entity === _self) return;
                targets.push(entity);
            })

            switch (_target.entity.sortBy) {
                case "random": {
                    targets.sort(() => Math.random() - 0.5);
                    break;
                }
                case "strongest": {
                    targets.sort((a, b) => a.getOwnDamage() - b.getOwnDamage());
                    break;
                }
                case "healthiest": {
                    targets.sort((a, b) => a.currentHealth - b.currentHealth);
                    break;
                }
                case "arbitrary":
                default: {
                    break;
                }
            }

            if (_target.entity.reverse) {
                targets.reverse();
            }

            if (_target.entity.maxNumTargets !== undefined && targets.length > _target.entity.maxNumTargets) {
                targets.length = _target.entity.maxNumTargets;
            }

            return targets;
        }


        // area selector
        else if ("area" in _target) {
            const pattern = getTargetPositions(_target, _self, side);

            // get the actual entities in these areas now
            side.forEachElement((el, pos) => {
                if (el.untargetable) return;
                if (pattern.get(pos))
                    targets.push(el);
            });

            return targets;
        }

        return targets;
    }

    export function getTargetPositions(_target: TargetArea, _self: IEntity, _side: Grid<IEntity>): Grid<boolean> {
        let pattern: Grid<boolean> = new Grid();
        let pos: Position;

        if (_target.area.position !== AREA_POSITION_ABSOLUTE.ABSOLUTE && !_self) return pattern;
        switch (_target.area.position) {
            case AREA_POSITION.RELATIVE_FIRST_IN_ROW: {
                for (let i: number = 0; i < 3; i++) {
                    if (_side.get([i, _self.position[1]])) {
                        pos = [i, _self.position[1]]
                        break;
                    }
                }
                break;
            }
            case AREA_POSITION.RELATIVE_LAST_IN_ROW: {
                for (let i: number = 2; i >= 0; i--) {
                    if (_side.get([i, _self.position[1]])) {
                        pos = [i, _self.position[1]]
                        break;
                    }
                }
                break;
            }
            case AREA_POSITION.RELATIVE_SAME: {
                // intuitively for the designer "same" means "the same spot on the opposite side".
                // But because the own side is mirrored internally, "SAME" internally means mirrored and vice versa
                pos = [2 - _self.position[0], _self.position[1]];
                break;
            }
            case AREA_POSITION.RELATIVE_MIRRORED: {
                pos = [_self.position[0], _self.position[1]];
                break;
            }
            case AREA_POSITION.ABSOLUTE: {
                pos = _target.area.absolutePosition;
                break;
            }
        }
        if (!pos) return pattern;

        let patternIsRelative: boolean = true;
        switch (_target.area.shape) {
            case AREA_SHAPE.SINGLE:
                pattern.set(pos, true);
                patternIsRelative = false;
                break;
            case AREA_SHAPE.ROW:
                pattern.set([0, pos[1]], true);
                pattern.set([1, pos[1]], true);
                pattern.set([2, pos[1]], true);
                patternIsRelative = false;
                break;
            case AREA_SHAPE.COLUMN:
                pattern.set([pos[0], 0], true);
                pattern.set([pos[0], 1], true);
                pattern.set([pos[0], 2], true);
                patternIsRelative = false;
                break;
            case AREA_SHAPE.PLUS:
                pattern.set([1, 0], true);
                pattern.set([0, 1], true);
                pattern.set([1, 1], true);
                pattern.set([2, 1], true);
                pattern.set([1, 2], true);
                break;
            case AREA_SHAPE.DIAGONALS:
                pattern.set([0, 0], true);
                pattern.set([2, 0], true);
                pattern.set([0, 2], true);
                pattern.set([2, 2], true);
                break;
            case AREA_SHAPE.SQUARE:
                pattern = new Grid([[true, true, true], [true, false, true], [true, true, true]]);
                break;
            case AREA_SHAPE.PATTERN: {
                if (_target.area.shape === AREA_SHAPE.PATTERN) { // only so that TS doesn't complain.
                    new Grid(_target.area.pattern).forEachPosition((element, pos) => {
                        pattern.set(pos, !!element);
                    });
                }
            }

        }
        if (patternIsRelative && (pos[0] !== 1 || pos[1] !== 1)) {
            // 1, 1 is the center, so the difference to that is how much the pattern is supposed to be moved
            let delta: Position = [pos[0] - 1, pos[1] - 1];
            let movedPattern: Grid<boolean> = new Grid();
            pattern.forEachPosition((el, pos) => {
                let newPos: Position = [pos[0] + delta[0], pos[1] + delta[1]];

                movedPattern.set(newPos, !!el);
            });
            pattern = movedPattern;
        }
        return pattern;
    }

    //#endregion

}