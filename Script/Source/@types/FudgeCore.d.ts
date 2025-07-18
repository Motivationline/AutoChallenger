/// <reference path="OimoPhysics.d.ts" />
/// <reference types="webxr" />
declare namespace FudgeCore {
    interface PerformanceMeasurement {
        start?: number;
        frameTimeMin: number;
        frameTimeMax: number;
        frameTimeAvg: number;
        callsPerFrame: number;
        time: number;
        calls: number;
    }
    class PerformanceMonitor {
        #private;
        static canvas: HTMLCanvasElement;
        static context: CanvasRenderingContext2D;
        static measurements: {
            [key: string]: PerformanceMeasurement;
        };
        static startMeasure(_label: string): void;
        static endMeasure(_label: string): number;
        static startFrame(): void;
        static endFrame(): void;
        private static resize;
    }
}
declare namespace FudgeCore {
    /**
     * Base class for the different DebugTargets, mainly for technical purpose of inheritance
     */
    abstract class DebugTarget {
        delegates: MapDebugFilterToDelegate;
        /**
         * Merge the given message and arguments into a single string, separated by ', '
         */
        static mergeArguments(_message: Object, ..._args: Object[]): string;
    }
}
declare namespace FudgeCore {
    /**
     * The filters corresponding to debug activities, more to come
     */
    enum DEBUG_FILTER {
        NONE = 0,
        INFO = 1,
        LOG = 2,
        WARN = 4,
        ERROR = 8,
        FUDGE = 16,
        CLEAR = 256,
        GROUP = 257,
        GROUPCOLLAPSED = 258,
        GROUPEND = 260,
        SOURCE = 512,
        MESSAGES = 31,
        FORMAT = 263,
        ALL = 287
    }
    const DEBUG_SYMBOL: {
        [filter: number]: string;
    };
    type MapDebugTargetToDelegate = Map<DebugTarget, Function>;
    interface MapDebugFilterToDelegate {
        [filter: number]: Function;
    }
}
declare namespace FudgeCore {
    /**
     * Routing to the standard-console
     */
    class DebugConsole extends DebugTarget {
        static delegates: MapDebugFilterToDelegate;
        /**
         * Should be used to display uncritical state information of FUDGE, only visible in browser's verbose mode
         */
        static fudge(_message: Object, ..._args: Object[]): void;
        /**
         * Displays an extra line with information about the source of the debug message
         */
        static source(_message: Object, ..._args: Object[]): void;
    }
}
declare namespace FudgeCore {
    /**
     * The Debug-Class offers functions known from the console-object and additions,
     * routing the information to various {@link DebugTarget}s that can be easily defined by the developers and registerd by users
     * Override functions in subclasses of {@link DebugTarget} and register them as their delegates
     */
    class Debug {
        /**
         * For each set filter, this associative array keeps references to the registered delegate functions of the chosen {@link DebugTarget}s
         */
        private static delegates;
        /**
         * De- / Activate a filter for the given DebugTarget.
         */
        static setFilter(_target: DebugTarget, _filter: DEBUG_FILTER): void;
        /**
         * Get the filter(s) for the given DebugTarget.
         */
        static getFilter(_target: DebugTarget): DEBUG_FILTER;
        /**
         * Add a filter to the given DebugTarget.
         */
        static addFilter(_target: DebugTarget, _filter: DEBUG_FILTER): void;
        /**
         * Remove a filter from the given DebugTarget.
         */
        static removeFilter(_target: DebugTarget, _filter: DEBUG_FILTER): void;
        /**
         * Info(...) displays additional information with low priority
         */
        static info(_message: unknown, ..._args: unknown[]): void;
        /**
         * Displays information with medium priority
         */
        static log(_message: unknown, ..._args: unknown[]): void;
        /**
         * Displays information about non-conformities in usage, which is emphasized e.g. by color
         */
        static warn(_message: unknown, ..._args: unknown[]): void;
        /**
         * Displays critical information about failures, which is emphasized e.g. by color
         */
        static error(_message: unknown, ..._args: unknown[]): void;
        /**
         * Displays messages from FUDGE
         */
        static fudge(_message: unknown, ..._args: unknown[]): void;
        /**
         * Clears the output and removes previous messages if possible
         */
        static clear(): void;
        /**
         * Opens a new group for messages
         */
        static group(_name: string): void;
        /**
         * Opens a new group for messages that is collapsed at first
         */
        static groupCollapsed(_name: string): void;
        /**
         * Closes the youngest group
         */
        static groupEnd(): void;
        /**
         * Log a branch of the node hierarchy
         */
        static branch(_branch: Node): void;
        /**
         * Displays messages about the source of the debug call
         */
        static source(_message: unknown, ..._args: unknown[]): void;
        /**
         * Lookup all delegates registered to the filter and call them using the given arguments
         */
        private static delegate;
        /**
         * setup routing to standard console
         */
        private static setupConsole;
    }
}
declare namespace FudgeCore {
    interface ArrayConvertible {
        readonly isArrayConvertible: true;
        /**
         * Set the values of this object from the given array starting at the given offset.
         * @param _array - The array to read the values from.
         * @param _offset - (optional) The offset to start reading from.
         * @returns A reference to this instance.
         */
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        /**
         * Copy the values of this object into the given array starting at the given offset. Creates a new array if none is provided.
         * @param _out - (optional) The receiving array.
         * @param _offset - (optional) The offset to start writing to.
         * @returns `_out` or a new array if none is provided.
         */
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
    }
}
declare namespace FudgeCore {
    interface MapEventTypeToListeners {
        [eventType: string]: Set<EventListenerUnified>;
    }
    /**
     * Types of events specific to FUDGE, in addition to the standard DOM/Browser-Types and custom strings
     */
    const enum EVENT {
        /** dispatched to targets registered at {@link Loop}, when requested animation frame starts */
        LOOP_FRAME = "loopFrame",
        /** dispatched to a {@link Component} when its being added to a {@link Node} */
        COMPONENT_ADD = "componentAdd",
        /** dispatched to a {@link Component} when its being removed from a {@link Node} */
        COMPONENT_REMOVE = "componentRemove",
        /** dispatched to a {@link Component} when its being activated */
        COMPONENT_ACTIVATE = "componentActivate",
        /** dispatched to a {@link Component} when its being deactivated */
        COMPONENT_DEACTIVATE = "componentDeactivate",
        /** dispatched to a {@link Node}, it's successors and ancestors when its being activated */
        NODE_ACTIVATE = "nodeActivate",
        /** dispatched to a {@link Node}, it's successors and ancestors when its being deactivated */
        NODE_DEACTIVATE = "nodeDeactivate",
        /** dispatched to a child {@link Node} and its ancestors after it was appended to a parent */
        CHILD_APPEND = "childAppend",
        /** dispatched to a child {@link Node} and its ancestors just before its being removed from its parent */
        CHILD_REMOVE = "childRemove",
        /** dispatched to a {@link Mutable} when it mutates */
        MUTATE = "mutate",
        /** dispatched by a {@link Graph} when it mutates, {@link GraphInstance}s connected to the graph listen */
        MUTATE_GRAPH = "mutateGraph",
        /** dispatched by a {@link GraphInstance} when it reflected the mutation of the {@link Graph} it's connected to */
        MUTATE_INSTANCE = "mutateGraphDone",
        /** dispatched to {@link Viewport} when it gets the focus to receive keyboard input */
        FOCUS_IN = "focusin",
        /** dispatched to {@link Viewport} when it loses the focus to receive keyboard input */
        FOCUS_OUT = "focusout",
        /** dispatched to {@link Node} when it's done serializing */
        NODE_SERIALIZED = "nodeSerialized",
        /** dispatched to {@link Node} and all its {@link Component}s when it's done deserializing, so all components, children and attributes are available */
        NODE_DESERIALIZED = "nodeDeserialized",
        /** broadcast from a {@link GraphInstance} to all its descendants when it's content is set according to a serialization of a {@link Graph}. Broadcasted, so needs to be caught in capture. */
        GRAPH_INSTANTIATED = "graphInstantiated",
        /** broadcast from a {@link Graph} to all its descendants when it's finished deserializing. Broadcasted, so needs to be caught in capture. */
        GRAPH_DESERIALIZED = "graphDeserialized",
        /** dispatched by a {@link Graph} when it and its connected instances have finished mutating  */
        GRAPH_MUTATED = "graphMutated",
        /** dispatched to {@link Time} when it's scaling changed  */
        TIME_SCALED = "timeScaled",
        /** dispatched to {@link FileIoBrowserLocal} when a list of files has been loaded  */
        FILE_LOADED = "fileLoaded",
        /** dispatched to {@link FileIoBrowserLocal} when a list of files has been saved */
        FILE_SAVED = "fileSaved",
        /** dispatched to {@link Node} when recalculating transforms for render */
        RENDER_PREPARE = "renderPrepare",
        /** dispatched to {@link Viewport} and {@link Node} when recalculation of the branch to render starts. */
        RENDER_PREPARE_START = "renderPrepareStart",
        /** dispatched to {@link Viewport} and {@link Node} when recalculation of the branch to render ends. The branch dispatches before the lights are transmitted to the shaders  */
        RENDER_PREPARE_END = "renderPrepareEnd",
        /** dispatched to {@link Viewport} at the end of a rendered frame right before it gets displayed. At this point {@link Gizmos} can still be drawn. */
        RENDER_END = "renderEnd",
        /** dispatched to {@link Joint}-Components in order to disconnect */
        DISCONNECT_JOINT = "disconnectJoint",
        /** dispatched to {@link Node} when it gets attached to a viewport for rendering. Broadcasted, so needs to be caught in capture. */
        ATTACH_BRANCH = "attachBranch",
        /** dispatched to {@link Project} when it's done loading resources from a url */
        RESOURCES_LOADED = "resourcesLoaded",
        /** dispatched to {@link ComponentWalker} and {@link ComponentWaypoint} when a {@link ComponentWalker} reaches a {@link Waypoint} or {@link ComponentWaypoint} */
        WAYPOINT_REACHED = "waypointReached",
        /** dispatched to {@link ComponentWalker} when the final {@link Waypoint} in the current path has been reached */
        PATHING_CONCLUDED = "pathingConcluded"
    }
    /** Union type of other event types serving as annotation for listeners and handlers */
    type EventUnified = Event | CustomEvent | EventPhysics;
    /** Unified listener type extending EventListener and EventListenerObject for CustomEvent and others */
    type EventListenerUnified = ((_event: Event) => void) | ((_event: CustomEvent) => void) | ((_event: EventPhysics) => void) | ((_event: EventTimer) => void) | EventListener | EventListenerOrEventListenerObject;
    /** Extends EventTarget to work with {@link EventListenerUnified} and {@link EventUnified} */
    class EventTargetUnified extends EventTarget {
        /**
         * See {@link EventTarget.addEventListener} for reference. Works with {@link EventListenerUnified} and {@link EventUnified}
         */
        addEventListener(_type: string, _handler: EventListenerUnified, _options?: boolean | AddEventListenerOptions): void;
        /**
         * See {@link EventTarget.removeEventListener} for reference. Works with {@link EventListenerUnified} and {@link EventUnified}
         */
        removeEventListener(_type: string, _handler: EventListenerUnified, _options?: boolean | AddEventListenerOptions): void;
        /**
         * See {@link EventTarget.dispatchEvent} for reference. Works with with {@link EventUnified}
         */
        dispatchEvent(_event: EventUnified): boolean;
    }
    /**
     * Base class for EventTarget singletons, which are fixed entities in the structure of FUDGE, such as the core loop
     */
    class EventTargetStatic extends EventTargetUnified {
        protected static targetStatic: EventTargetStatic;
        protected constructor();
        /**
         * Add an event listener to {@link targetStatic}.
         */
        static addEventListener(_type: string, _handler: EventListener, _options?: boolean | AddEventListenerOptions): void;
        /**
         * Remove an event listener from {@link targetStatic}.
         */
        static removeEventListener(_type: string, _handler: EventListener, _options?: boolean | AddEventListenerOptions): void;
        /**
         * Dispatch an event on {@link targetStatic}.
         */
        static dispatchEvent(_event: Event): boolean;
    }
}
declare namespace FudgeCore {
    /**
     * A subclass of {@link Event} that can be (re)used via {@link RecyclableEvent.get} and {@link RecyclableEvent.store} to avoid garbage collection.
     * If dispatched repeatedly without recycling through get/store, call {@link recycle} manually before each dispatch.
     * Exposes some readonly properties of the event class as writable properties for the event system.
     *
     * **Example get/store**:
     * ```typescript
     * import f = FudgeCore;
     * const node: f.Node = new f.Node("Node");
     * const event: f.RecyclableEvent = f.RecyclableEvent.get("myevent", true); // get event from depot
     * node.dispatchEvent(event);
     * f.RecyclableEvent.store(event); // store event in depot for reuse
     * ```
     *
     * **Example manual recycle**:
     * ```typescript
     * import f = FudgeCore;
     * const node: f.Node = new f.Node("Node");
     * const event: f.RecyclableEvent = f.RecyclableEvent.get("myevent", true); // get event and cache it
     *
     * // called repeatedly, e.g. in a loop
     * function update(): void {
     *   node.dispatchEvent(event.recycle()); // recycle the event before each dispatch
     * }
     * ```
     * @author Jonas Plotzky, HFU, 2025
     */
    class RecyclableEvent extends Event {
        #private;
        readonly path: EventTarget[];
        constructor(_type: string, _bubbles?: boolean, _cancelable?: boolean);
        /**
         * Fetches an event of the requested type and initialization from the depot. If the depot for the requested type is empty it returns a new instance.
         * Use {@link RecyclableEvent.store} after dispatching the event to store it for reuse.
         */
        static get(_type: string, _bubbles?: boolean, _cancelable?: boolean): RecyclableEvent;
        /**
         * Stores the event in the depot for later reuse.
         */
        static store(_event: RecyclableEvent): void;
        /**
         * Emptys the depot of a given type, leaving the events for the garbage collector.
         */
        static dump(_type: string, _bubbles?: boolean, _cancelable?: boolean): void;
        /**
         * Emptys all depots, leaving all events to the garbage collector.
         */
        static dumpAll(): void;
        static [Symbol.hasInstance](_instance: unknown): boolean;
        /**
         * Flag for fast type checking.
         */
        get isRecyclableEvent(): boolean;
        get target(): EventTarget;
        get currentTarget(): EventTarget;
        get eventPhase(): Event["eventPhase"];
        /**
         * Set the target of the event. Used by the event system.
         * @returns A reference to this event.
         */
        setTarget(_target: EventTarget): RecyclableEvent;
        /**
         * Set the current target of the event. Used by the event system.
         * @returns A reference to this event.
         */
        setCurrentTarget(_currentTarget: EventTarget): RecyclableEvent;
        /**
         * Set the event phase of the event. Used by the event system.
         * @returns A reference to this event.
         */
        setEventPhase(_eventPhase: Event["NONE"] | Event["CAPTURING_PHASE"] | Event["AT_TARGET"] | Event["BUBBLING_PHASE"]): RecyclableEvent;
        /**
         * Reset the event to default values. Used by the event system.
         * @returns A reference to this event.
         */
        recycle(): RecyclableEvent;
    }
}
declare namespace FudgeCore {
    /**
     * Interface describing the datatypes of the attributes a mutator as strings
     */
    interface MutatorAttributeTypes {
        [attribute: string]: string | Object;
    }
    /**
     * Interface describing a mutator, which is an associative array with names of attributes and their corresponding values
     */
    interface Mutator {
        [attribute: string]: General;
    }
    /**
     * Interface describing an animation target mutator, which is an associative array with names of attributes and their corresponding values.
     * Numeric values are stored as Float32Arrays, which allows for efficient interpolation and blending in the animation system.
     */
    interface AnimationMutator {
        [attribute: string]: Float32Array;
    }
    interface MutatorForAnimation extends Mutator {
        readonly forAnimation: null;
    }
    interface MutatorForUserInterface extends Mutator {
        readonly forUserInterface: null;
    }
    /**
     * Collect applicable attributes of the instance and copies of their values in a Mutator-object
     */
    function getMutatorOfArbitrary(_object: Object): Mutator;
    /**
     * Association of an attribute with its specified type (constructor).
     * @see {@link Metadata}.
     */
    type MetaAttributeTypes = Record<PropertyKey, Function | Object>;
    /**
     * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
     * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
     */
    interface Metadata extends DecoratorMetadataObject {
        /**
         * The specified types of the attributes of a class. Use the {@link type} decorator to add type information to the metadata of a class.
         */
        attributeTypes?: MetaAttributeTypes;
        enumerateKeys?: PropertyKey[];
        /**
         * Map of property names to the type of serialization that should be used for that property.
         */
        serializables?: {
            [key: string]: "primitive" | "serializable" | "resource" | "node";
        };
        implements?: Set<Function>;
    }
    /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
    type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;
    /**
     * Decorator to specify a type (constructor) for an attribute within a class's {@link Metadata | metadata}.
     * This allows the intended type of an attribute to be known at runtime, making it a valid drop target in the editor.
     *
     * **Note:** Attributes with a specified meta-type will always be included in the {@link Mutator base-mutator}
     * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects
     * will be displayed via their {@link toString} method in the editor.
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    function type<T, C extends abstract new (...args: General[]) => T>(_constructor: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;
    function type<T extends Boolean | Number | String>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
    function type<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
    /**
     * Decorator for making getters in a {@link Mutable} class enumerable. This ensures that the getters are included in mutators and are subsequently displayed in the editor.
     *
     * **Usage**: Apply this decorator to both the getter method and the class to make it effective.
     *
     * **Example**:
     * ```typescript
     * @ƒ.enumerate // apply the decorator to the class.
     * export class SomeScript extends ƒ.ComponentScript {
     *   #size: number = 1;
     *
     *   @ƒ.enumerate // apply the decorator to the getter
     *   public get size(): number {
     *     return this.#size;
     *   }
     *
     *   // define a setter to allow writing, or omit it to leave the property read-only
     *   public set size(_size: number) {
     *     this.#size = _size;
     *   }
     * }
     * ```
     */
    function enumerate(_value: unknown, _context: ClassDecoratorContext<new (...args: General[]) => Mutable>): void;
    function enumerate(_value: unknown, _context: ClassGetterDecoratorContext<Mutable> | ClassAccessorDecoratorContext<Mutable>): void;
    /**
     * Base class for all types that are mutable using {@link Mutator}-objects, thus providing and using interfaces created at runtime.
     *
     * Mutables provide a {@link Mutator} built by collecting all their applicable enumerable properties. By default, this includes only primitive types and nested mutable objects.
     * Using the {@link type}-decorator can also include non-mutable objects, which will be displayed via their {@link toString} method in the editor.
     *
     * Subclasses can either reduce the standard {@link Mutator} built by this base class by deleting properties or implement an individual getMutator method.
     * The provided properties of the {@link Mutator} must match public properties or getters/setters of the object.
     * Otherwise, they will be ignored unless handled by an override of the mutate method in the subclass, and will throw errors in an automatically generated user interface for the object.
     */
    abstract class Mutable extends EventTargetUnified {
        /**
         * Decorator allows to attach {@link Mutable} functionality to existing classes.
         */
        static getMutatorFromPath(_mutator: Mutator, _path: string[]): Mutator;
        /**
         * Retrieves the type of this mutable subclass as the name of the runtime class
         * @returns The type of the mutable
         */
        get type(): string;
        /**
         * Collect applicable attributes of the instance and copies of their values in a Mutator-object.
         * By default, a mutator cannot be extended, since extensions are not available in the object the mutator belongs to.
         * A mutator may be reduced by the descendants of {@link Mutable} to contain only the properties needed.
         */
        getMutator(_extendable?: boolean): Mutator;
        /**
         * Collect the attributes of the instance and their values applicable for animation.
         * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
         */
        getMutatorForAnimation(_extendable?: boolean): MutatorForAnimation;
        /**
         * Collect the attributes of the instance and their values applicable for the user interface.
         * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
         */
        getMutatorForUserInterface(_extendable?: boolean): MutatorForUserInterface;
        /**
         * Collect the attributes of the instance and their values applicable for indiviualization by the component.
         * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
         */
        /**
         * Returns an associative array with the same attributes as the given mutator, but with the corresponding types as string-values.
         * Does not recurse into objects! This will return the decorated {@link Metadata meta-type} instead of the runtime-type of the object, if available.
         */
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        /**
         * Retrieves the specified {@link Metadata.attributeTypes | attribute types} from the {@link Metadata | metadata} of this instance's class.
         */
        getMetaAttributeTypes(): MetaAttributeTypes;
        /**
         * Retrieves the {@link Metadata | metadata} of this instance's class.
         */
        getMetadata(): Metadata;
        /**
         * Updates the values of the given mutator according to the current state of the instance
         * @param _mutator
         */
        updateMutator(_mutator: Mutator): void;
        /**
         * Updates the attribute values of the instance according to the state of the mutator.
         * The mutation may be restricted to a subset of the mutator and the event dispatching suppressed.
         * Uses mutateBase, but can be overwritten in subclasses
         */
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): void | Promise<void>;
        /**
         * Updates the property values of the instance according to the state of the animation mutator. Override to implement custom animation behavior.
         */
        animate(_mutator: AnimationMutator): void;
        /**
         * Synchronous implementation of {@link mutate}.
         * Override {@link mutate} with a sync implementation and call this method from it to mutate synchronously.
         */
        protected mutateSync(_mutator: Mutator, _dispatchMutate?: boolean): void;
        /**
         * Base method for mutation, always available to subclasses. Do not overwrite in subclasses!
         */
        protected mutateBase(_mutator: Mutator, _selection?: string[]): Promise<void>;
        /**
         * Reduces the attributes of the general mutator according to desired options for mutation. To be implemented in subclasses
         * @param _mutator
         */
        protected abstract reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    type General = any;
    /**
     * Holds information needed to recreate an object identical to the one it originated from.
     * A serialization is used to create copies of existing objects at runtime or to store objects as strings or recreate them.
     */
    interface Serialization {
        [type: string]: General;
    }
    /**
     * Generic type for a {@link Serialization} of a specific {@link Serializable} object.
     */
    type SerializationOf<T extends Serializable> = {
        [K in keyof T]?: General;
    };
    interface Serializable {
        /**
         * Returns a {@link Serialization} of this object.
         */
        serialize(): Serialization;
        /**
         * Recreates this instance of {@link Serializable} with the information from the given {@link Serialization}.
         */
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
    /**
     * Handles the external serialization and deserialization of {@link Serializable} objects. The internal process is handled by the objects themselves.
     * A {@link Serialization} object can be created from a {@link Serializable} object and a JSON-String may be created from that.
     * Vice versa, a JSON-String can be parsed to a {@link Serialization} which can be deserialized to a {@link Serializable} object.
     * ```text
     *  [Serializable] → (serialize) → [Serialization] → (stringify) → [String] → (save or send)
     *                                        ↓                            ↓                  ↓
     *                [Serializable] ← (deserialize) ← [Serialization] ← (parse) ← (load) ← [Medium]
     * ```
     * While the internal serialize/deserialize method1s of the objects care of the selection of information needed to recreate the object and its structure,
     * the {@link Serializer} keeps track of the namespaces and classes in order to recreate {@link Serializable} objects. The general structure of a {@link Serialization} is as follows
     * ```text
     * {
     *      namespaceName.className: {
     *          propertyName: propertyValue,
     *          ...,
     *          propertyNameOfReference: SerializationOfTheReferencedObject,
     *          ...,
     *          constructorNameOfSuperclass: SerializationOfSuperClass
     *      }
     * }
     * ```
     * Since the instance of the superclass is created automatically when an object is created,
     * the SerializationOfSuperClass omits the the namespaceName.className key and consists only of its value.
     * The constructorNameOfSuperclass is given instead as a property name in the serialization of the subclass.
     */
    abstract class Serializer {
        /** In order for the Serializer to create class instances, it needs access to the appropriate namespaces */
        private static namespaces;
        /**
         * Registers a namespace to the {@link Serializer}, to enable automatic instantiation of classes defined within
         */
        static registerNamespace(_namespace: Object): string;
        /**
         * Returns a javascript object representing the serializable FUDGE-object given,
         * including attached components, children, superclass-objects all information needed for reconstruction
         * @param _object An object to serialize, implementing the {@link Serializable} interface
         */
        static serialize(_object: Serializable): Serialization;
        /**
         * Returns a FUDGE-object reconstructed from the information in the {@link Serialization} given,
         * including attached components, children, superclass-objects
         */
        static deserialize(_serialization: Serialization): Promise<Serializable>;
        /**
         * Returns an Array of javascript object representing the serializable FUDGE-objects given in the array,
         * including attached components, children, superclass-objects all information needed for reconstruction
         */
        static serializeArray<T extends Serializable>(_type: new () => T, _objects: Serializable[]): Serialization;
        /**
         * Returns an Array of FUDGE-objects reconstructed from the information in the array of {@link Serialization}s given,
         * including attached components, children, superclass-objects
         */
        static deserializeArray<T extends Serializable = Serializable>(_serialization: Serialization): Promise<T[]>;
        /**
         * Prettify a JSON-String, to make it more readable.
         * not implemented yet
         */
        static prettify(_json: string): string;
        /**
         * Returns a formatted, human readable JSON-String, representing the given {@link Serialization} that may have been created by {@link Serializer}.serialize
         * @param _serialization
         */
        static stringify(_serialization: Serialization): string;
        /**
         * Returns a {@link Serialization} created from the given JSON-String. Result may be passed to {@link Serializer.deserialize}
         * @param _json
         */
        static parse(_json: string): Serialization;
        /**
         * Creates an object of the class defined with the full path including the namespaceName(s) and the className seperated by dots(.)
         * @param _path
         */
        static reconstruct(_path: string): Serializable;
        /**
         * Returns the constructor from the given path to a class
         */
        static getConstructor<T extends Serializable>(_path: string): new () => T;
        /**
         * Returns the full path to the class of the object, if found in the registered namespaces
         * @param _object
         */
        private static getFullPath;
        /**
         * Returns the namespace-object defined within the full path, if registered
         * @param _path
         */
        private static getNamespace;
        /**
         * Finds the namespace-object in properties of the parent-object (e.g. window), if present
         * @param _namespace
         * @param _parent
         */
        private static findNamespaceIn;
    }
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
    namespace ParticleData {
        enum FUNCTION {
            ADDITION = "addition",
            SUBTRACTION = "subtraction",
            MULTIPLICATION = "multiplication",
            DIVISION = "division",
            MODULO = "modulo",
            POWER = "power",
            POLYNOMIAL3 = "polynomial3",
            SQUARE_ROOT = "squareRoot",
            RANDOM = "random",
            RANDOM_RANGE = "randomRange"
        }
        const FUNCTION_MINIMUM_PARAMETERS: {
            [key in ParticleData.FUNCTION]: number;
        };
        const PREDEFINED_VARIABLES: {
            [key: string]: string;
        };
    }
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
    /**
     * Interface to be implemented by objects that can be recycled, i.e. to avoid garbage collection by reusing the object instead of replacing it with a new one.
     */
    interface Recycable {
        /**
         * Recycles the object for the next reuse by setting its properties to their default states.
         */
        recycle(): void;
    }
    /**
     * Keeps a depot of objects that have been marked for reuse, sorted by type.
     * Using {@link Recycler} reduces load on the carbage collector and thus supports smooth performance.
     * @author Jirka Dell'Oro-Friedl, HFU, 2021
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Recycler
     */
    abstract class Recycler {
        private static depot;
        /**
         * Fetches an object of the requested type from the depot, calls its recycle-method and returns it.
         * If the depot for that type is empty it returns a new object of the requested type.
         * @param _t The class identifier of the desired object
         */
        static get<T extends Recycable | RecycableArray<T> | Object>(_t: new () => T): T;
        /**
         * Fetches an object of the requested type from the depot and returns it. ⚠️**DOES NOT** call its recycle-method.
         * Faster than {@link Recycler.get}, but should be used with caution.
         */
        static reuse<T extends Object>(_t: new () => T): T;
        /**
         * Stores the object in the depot for later recycling. Users are responsible for throwing in objects that are about to loose scope and are not referenced by any other
         * @param _instance
         */
        static store(_instance: Object): void;
        /**
         * Emptys the depot of a given type, leaving the objects for the garbage collector. May result in a short stall when many objects were in
         * @param _t
         */
        static dump<T>(_t: new () => T): void;
        /**
         * Emptys all depots, leaving all objects to the garbage collector. May result in a short stall when many objects were in
         */
        static dumpAll(): void;
    }
}
declare namespace FudgeCore {
    /**
     * Stores and manipulates a twodimensional vector comprised of the components x and y
     * ```text
     *            +y
     *             |__ +x
     * ```
     * @authors Lukas Scheuerle, Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
     */
    class Vector2 extends Mutable implements Serializable, Recycable, ArrayConvertible {
        x: number;
        y: number;
        constructor(_x?: number, _y?: number);
        /**
         * A shorthand for writing `new Vector2(0, 0)`.
         * @returns A new vector with the values (0, 0)
         */
        static ZERO(): Vector2;
        /**
         * A shorthand for writing `new Vector2(_scale, _scale)`.
         * @param _scale the scale of the vector. Default: 1
         */
        static ONE(_scale?: number): Vector2;
        /**
         * A shorthand for writing `new Vector2(x, 0)`.
         * @param _scale The number to write in the x coordinate. Default: 1
         * @returns A new vector with the values (_scale, 0)
         */
        static X(_scale?: number): Vector2;
        /**
         * A shorthand for writing `new Vector2(0, y)`.
         * @param _scale The number to write in the y coordinate. Default: 1
         * @returns A new vector with the values (0, _scale)
         */
        static Y(_scale?: number): Vector2;
        /**
         * Creates and returns a vector through transformation of the given vector by the given matrix
         * @param _out Optional vector to store the result in.
         */
        static TRANSFORMATION(_vector: Vector2, _mtxTransform: Matrix3x3, _includeTranslation?: boolean, _out?: Vector2): Vector2;
        /**
         * Creates and returns a vector which is a copy of the given vector scaled to the given length.
         * @param _out Optional vector to store the result in.
         */
        static NORMALIZATION(_vector: Vector2, _length?: number, _out?: Vector2): Vector2;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor
         * @param _out Optional vector to store the result in.
         */
        static SCALE(_vector: Vector2, _scale: number, _out?: Vector2): Vector2;
        /**
         * Returns the result of the addition of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static SUM(_a: Vector2, _b: Vector2, _out?: Vector2): Vector2;
        /**
         * Returns the result of the subtraction of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static DIFFERENCE(_minuend: Vector2, _subtrahend: Vector2, _out?: Vector2): Vector2;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor.
         * @param _out Optional vector to store the result in.
         */
        static NEGATION(_vector: Vector2, _out?: Vector2): Vector2;
        /**
         * Calculates the cross product of two Vectors. Due to them being only 2 Dimensional, the result is a single number,
         * which implicitly is on the Z axis. It is also the signed magnitude of the result.
         */
        static CROSS(_a: Vector2, _b: Vector2): number;
        /**
         * Computes the dotproduct of 2 vectors.
         */
        static DOT(_a: Vector2, _b: Vector2): number;
        /**
         * Calculates the orthogonal vector to the given vector. Rotates counterclockwise by default.
         * ```text
         * ↑ => ← => ↓ => → => ↑
         * ```
         * @param _vector Vector to get the orthogonal equivalent of
         * @param _clockwise Should the rotation be clockwise instead of the default counterclockwise? default: false
         * @param _out Optional vector to store the result in.
         * @returns A Vector that is orthogonal to and has the same magnitude as the given Vector.
         */
        static ORTHOGONAL(_vector: Vector2, _clockwise?: boolean, _out?: Vector2): Vector2;
        /**
         * Creates a cartesian vector from polar coordinates.
         * @param _out Optional vector to store the result in.
         */
        static GEO(_angle?: number, _magnitude?: number, _out?: Vector2): Vector2;
        get isArrayConvertible(): true;
        /**
         * Returns the length of the vector
         */
        get magnitude(): number;
        /**
         * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
         */
        get magnitudeSquared(): number;
        /**
         * - get: Returns a polar representation of this vector
         * - set: Adjusts the cartesian values of this vector to represent the given as polar coordinates
         */
        get geo(): Geo2;
        set geo(_geo: Geo2);
        /**
         * Creates and returns a clone of this vector.
         */
        get clone(): Vector2;
        /**
         * Copies the components of the given vector into this vector.
         * @returns A reference to this vector.
         */
        copy(_original: Vector2): Vector2;
        /**
         * Sets the components of this vector.
         * @returns A reference to this vector.
         */
        set(_x?: number, _y?: number): Vector2;
        recycle(): void;
        /**
         * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
         * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
         */
        equals(_compare: Vector2, _tolerance?: number): boolean;
        /**
         * Returns the distance bewtween this vector and the given vector.
         */
        getDistance(_to: Vector2): number;
        /**
         * Adds the given vector to this vector.
         * @returns A reference to this vector.
         */
        add(_addend: Vector2): Vector2;
        /**
         * Subtracts the given vector from this vector.
         * @returns A reference to this vector.
         */
        subtract(_subtrahend: Vector2): Vector2;
        /**
         * Scales the Vector by the given _scalar.
         * @returns A reference to this vector.
         */
        scale(_scalar: number): Vector2;
        /**
         * Negates this vector by flipping the signs of its components
         * @returns A reference to this vector.
         */
        negate(): Vector2;
        /**
         * Normalizes this to the given length, 1 by default
         * @returns A reference to this vector.
         */
        normalize(_length?: number): Vector2;
        /**
         * Transforms this vector by the given matrix, including or exluding the translation.
         * Including is the default, excluding will only rotate and scale this vector.
         * @returns A reference to this vector.
         */
        transform(_mtxTransform: Matrix3x3, _includeTranslation?: boolean): Vector2;
        /**
         * For each dimension, moves the component to the minimum of this and the given vector.
         * @returns A reference to this vector.
         */
        min(_compare: Vector2): Vector2;
        /**
         * For each dimension, moves the component to the maximum of this and the given vector.
         * @returns A reference to this vector.
         */
        max(_compare: Vector2): Vector2;
        /**
         * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
         * @param _out Optional vector to store the result in.
         */
        map(_function: (_value: number, _index: number, _component: "x" | "y", _vector: Vector2) => number, _out?: Vector2): Vector2;
        /**
         * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector2.map} but mutates this vector instead of creating a new one.
         * @returns A reference to this vector.
         */
        apply(_function: (_value: number, _index: number, _component: "x" | "y", _vector: Vector2) => number): Vector2;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        /**
         * Adds a z-component of the given magnitude (default=0) to the vector and returns a new Vector3.
         * @param _out Optional vector to store the result in.
         */
        toVector3(_z?: number, _out?: Vector3): Vector3;
        /**
         * Returns a formatted string representation of this vector.
         */
        toString(): string;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Vector2>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Defines the origin of a rectangle
     */
    enum ORIGIN2D {
        TOPLEFT = 0,
        TOPCENTER = 1,
        TOPRIGHT = 2,
        CENTERLEFT = 16,
        CENTER = 17,
        CENTERRIGHT = 18,
        BOTTOMLEFT = 32,
        BOTTOMCENTER = 33,
        BOTTOMRIGHT = 34
    }
    /**
     * Defines a rectangle with position and size and add comfortable methods to it
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Rectangle extends Mutable implements Recycable {
        position: Vector2;
        size: Vector2;
        constructor(_x?: number, _y?: number, _width?: number, _height?: number, _origin?: ORIGIN2D);
        /**
         * Returns a new rectangle created with the given parameters.
         * @param _out Optional rectangle to store the result in.
         */
        static GET(_x?: number, _y?: number, _width?: number, _height?: number, _origin?: ORIGIN2D, _out?: Rectangle): Rectangle;
        get x(): number;
        set x(_x: number);
        get y(): number;
        set y(_y: number);
        get width(): number;
        set width(_width: number);
        get height(): number;
        set height(_height: number);
        /**
         * Get/set the leftmost expansion, respecting also negative values of width
         */
        get left(): number;
        set left(_value: number);
        /**
         * Get/set the topmost expansion, respecting also negative values of height
         */
        get top(): number;
        set top(_value: number);
        /**
         * Get/set the rightmost expansion, respecting also negative values of width
         */
        get right(): number;
        set right(_value: number);
        /**
         * Get/set the lowest expansion, respecting also negative values of height
         */
        get bottom(): number;
        set bottom(_value: number);
        get clone(): Rectangle;
        recycle(): void;
        /**
         * Returns true if this rectangle is equal to the given rectagnle within the given tolerance.
         */
        equals(_compare: Rectangle, _tolerance?: number): boolean;
        /**
         * Set this rectangle to the values given by the rectangle provided.
         * @returns A reference to this rectangle.
         */
        copy(_rect: Rectangle): Rectangle;
        /**
         * Sets the position and size of the rectangle according to the given parameters.
         * @param _origin The origin of the rectangle. The default is {@link ORIGIN2D.TOPLEFT}.
         * @returns A reference to this rectangle.
         * @deprecated Use {@link set} instead.
         */
        setPositionAndSize(_x?: number, _y?: number, _width?: number, _height?: number, _origin?: ORIGIN2D): Rectangle;
        /**
         * Sets the position and size of the rectangle according to the given parameters.
         * @param _origin The origin of the rectangle. The default is {@link ORIGIN2D.TOPLEFT}.
         * @returns A reference to this rectangle.
         */
        set(_x?: number, _y?: number, _width?: number, _height?: number, _origin?: ORIGIN2D): Rectangle;
        /**
         * Transforms the given point from this rectangles space to the target rectangles space.
         * @param _out Optional vector to store the result in.
         */
        pointToRect(_point: Vector2, _target: Rectangle, _out?: Vector2): Vector2;
        /**
         * Returns true if the given point is inside of this rectangle or on the border.
         */
        isInside(_point: Vector2): boolean;
        /**
         * Returns true if this rectangle collides with the given rectangle.
         */
        collides(_rect: Rectangle): boolean;
        /**
         * Returns true if this rectangle completely encloses the given rectangle.
         */
        covers(_rect: Rectangle): boolean;
        /**
         * Returns the rectangle created by the intersection of this and the given rectangle or null, if they don't collide.
         * @param _out Optional rectangle to store the result in.
         */
        getIntersection(_rect: Rectangle, _out?: Rectangle): Rectangle;
        /**
         * Creates a string representation of this rectangle.
         */
        toString(): string;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    type RenderTexture = WebGLTexture;
    enum BLEND {
        OPAQUE = 0,
        TRANSPARENT = 1,
        ADDITIVE = 2,
        SUBTRACTIVE = 3,
        MODULATE = 4
    }
    enum DEPTH_FUNCTION {
        NEVER = 0,
        LESS = 1,
        EQUAL = 2,
        LESS_EQUAL = 3,
        GREATER = 4,
        NOT_EQUAL = 5,
        GREATER_EQUAL = 6,
        ALWAYS = 7
    }
    enum SHADER_ATTRIBUTE {
        POSITION = 0,
        NORMAL = 1,
        TEXCOORDS = 2,
        COLOR = 3,
        TANGENT = 4,
        BONES = 5,
        WEIGHTS = 6
    }
    const UNIFORM_BLOCK: {
        readonly LIGHTS: {
            readonly NAME: "Lights";
            readonly BINDING: 0;
        };
        readonly CAMERA: {
            readonly NAME: "Camera";
            readonly BINDING: 1;
        };
        readonly MATERIAL: {
            readonly NAME: "Material";
            readonly BINDING: 2;
        };
        readonly NODE: {
            readonly NAME: "Node";
            readonly BINDING: 3;
        };
        readonly SKIN: {
            readonly NAME: "Skin";
            readonly BINDING: 4;
        };
        readonly FOG: {
            readonly NAME: "Fog";
            readonly BINDING: 5;
        };
    };
    const TEXTURE_LOCATION: {
        readonly COLOR: {
            readonly UNIFORM: "u_texColor";
            readonly UNIT: 33984;
            readonly INDEX: 0;
        };
        readonly NORMAL: {
            readonly UNIFORM: "u_texNormal";
            readonly UNIT: 33985;
            readonly INDEX: 1;
        };
        readonly PARTICLE: {
            readonly UNIFORM: "u_particleSystemRandomNumbers";
            readonly UNIT: 33986;
            readonly INDEX: 2;
        };
        readonly TEXT: {
            readonly UNIFORM: "u_texText";
            readonly UNIT: 33987;
            readonly INDEX: 3;
        };
        readonly TOON: {
            readonly UNIFORM: "u_texToon";
            readonly UNIT: 33988;
            readonly INDEX: 4;
        };
    };
    /**
     * Base class for RenderManager, handling the connection to the rendering system, in this case WebGL.
     * Methods and attributes of this class should not be called directly, only through {@link Render}
     */
    abstract class RenderWebGL extends EventTargetStatic {
        static texColor: WebGLTexture;
        static texPosition: WebGLTexture;
        static texNormal: WebGLTexture;
        static texDepthStencil: WebGLTexture;
        private static crc3;
        /** The area of the offscreen-canvas in CSS pixels. */
        private static rectCanvas;
        /** The area on the offscreen-canvas to render to. */
        private static rectRender;
        private static fboScene;
        private static fboOut;
        private static readonly attachmentsColorPositionNormal;
        private static readonly attachmentsColor;
        /**
         * Initializes offscreen-canvas, renderingcontext and hardware viewport. Call once before creating any resources like meshes or shaders
         */
        static initialize(_antialias?: boolean, _alpha?: boolean): WebGL2RenderingContext;
        /**
        * Checks the first parameter and throws an exception with the WebGL-errorcode if the value is null
        * @param _value  value to check against null
        * @param _message  optional, additional message for the exception
        */
        static assert<T>(_value: T | null, _message?: string): T;
        /**
         * Return a reference to the offscreen-canvas.
         *
         * - Do not read or modify the canvas dimensions directly.
         * - Use {@link getCanvasRectangle} to retrieve the size of the offscreen-canvas.
         * - Use {@link setCanvasSize} to set the size of the offscreen-canvas.
         */
        static getCanvas(): HTMLCanvasElement;
        /**
         * Return a reference to the rendering context
         */
        static getRenderingContext(): WebGL2RenderingContext;
        /**
         * Returns a reference to the rectangle describing the size of the offscreen-canvas. x,y are 0 at all times.
         *
         * Do not modify the rectangle directly, use {@link setCanvasSize} instead.
         */
        static getCanvasRectangle(): Rectangle;
        /**
         * Set the size of the offscreen-canvas.
         *
         * ⚠️ CAUTION: If size changes invokes {@link adjustAttachments} which is an expensive operation.
         */
        static setCanvasSize(_width: number, _height: number): void;
        /**
         * Retrieve the area on the offscreen-canvas the camera image gets rendered to.
         *
         * Do not modify the rectangle directly, use {@link setRenderRectangle} instead.
         */
        static getRenderRectangle(): Rectangle;
        /**
         * Set the area on the offscreen-canvas to render the camera image to.
         */
        static setRenderRectangle(_rect: Rectangle): void;
        /**
         * Clear the offscreen renderbuffer with the given {@link Color}
         */
        static clear(_color?: Color, _colors?: boolean, _depth?: boolean, _stencil?: boolean): void;
        /**
         * Set the final framebuffer to render to. If null, the canvas default framebuffer is used.
         * Used by XR to render to the XRWebGLLayer framebuffer.
         */
        static setFramebufferTarget(_buffer: WebGLFramebuffer): void;
        /**
         * Reset the framebuffer to the main color buffer.
         */
        static resetFramebuffer(): void;
        /**
         * Enable / Disable WebGLs depth test.
         */
        static setDepthTest(_test: boolean): void;
        /**
         * Set the comparison operation used to test fragment depths against current depth buffer values.
         */
        static setDepthFunction(_function?: DEPTH_FUNCTION): void;
        /**
         * Enable / Disable WebGLs scissor test.
         */
        static setScissorTest(_test: boolean, _x?: number, _y?: number, _width?: number, _height?: number): void;
        /**
         * Set which color components to enable or to disable when rendering to a color buffer.
         */
        static setColorWriteMask(_r: boolean, _g: boolean, _b: boolean, _a: boolean): void;
        /**
         * Set WebGLs viewport.
         */
        static setViewport(_x: number, _y: number, _width: number, _height: number): void;
        /**
         * Set the blend mode to render with
         */
        static setBlendMode(_mode: BLEND): void;
        /**
         * Read the (world) position from the pixel at the given point on the render-rectangle (origin top left).
         * ⚠️ CAUTION: Currently only works when ambient occlusion is active due to writing to the position texture being disabled otherwise.
         */
        static pointRenderToWorld(_render: Vector2): Vector3;
        /**
         * Initializes different framebuffers aswell as texture attachments to use as render targets
         */
        static initializeAttachments(): void;
        /**
         * Adjusts the size of the different texture attachments (render targets) to the canvas size.
         *
         * ⚠️ CAUTION: Expensive operation, use only when canvas size changed.
         */
        static adjustAttachments(): void;
        static createTexture(_filter: number, _wrap: number): WebGLTexture;
        static bindTexture(_shader: ShaderInterface, _texture: WebGLTexture, _unit: number, _uniform: string): void;
        static useNodeUniforms(_shader: ShaderInterface, _mtxWorld: Matrix4x4, _mtxPivot: Matrix3x3, _color: Color, _id?: number): void;
        /**
         * Draw a mesh buffer using the given infos and the complete projection matrix
        */
        static drawNode(_node: Node, _cmpCamera: ComponentCamera): void;
        /**
         * Used with a {@link Picker}-camera, this method renders one pixel with picking information
         * for each node in the line of sight and return that as an unsorted {@link Pick}-array
         */
        static pick(_nodes: readonly Node[], _cmpCamera: ComponentCamera): Pick[];
        /**
         * The render function for picking nodes.
         * A cameraprojection with extremely narrow focus is used, so each pixel of the buffer would hold the same information from the node,
         * but the fragment shader renders only 1 pixel for each node into the render buffer, 1st node to 1st pixel, 2nd node to second pixel etc.
         */
        protected static pickNodes(_nodes: readonly Node[], _cmpCamera: ComponentCamera): Pick[];
        /**
         * Draws the given nodes using the given camera and the post process components attached to the same node as the camera
         * The opaque nodes are drawn first, then ssao is applied, then bloom is applied, then nodes alpha (sortForAlpha) are drawn.
         */
        protected static drawNodes(_nodesOpaque: Iterable<Node>, _nodesAlpha: Iterable<Node>, _cmpCamera: ComponentCamera): void;
        private static drawParticles;
        private static faceCamera;
    }
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
    interface MapClassToComponents {
        [className: string]: Component[];
    }
    /**
     * Represents a node in the scenetree.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Graph
     */
    class Node extends EventTargetUnified implements Serializable {
        #private;
        name: string;
        readonly mtxWorld: Matrix4x4;
        timestampUpdate: number;
        /** The number of nodes of the whole branch including this node and all successors */
        nNodesInBranch: number;
        /** The radius of the bounding sphere in world dimensions enclosing the geometry of this node and all successors in the branch */
        radius: number;
        private parent;
        private children;
        private components;
        private active;
        /**
         * Creates a new node with a name and initializes all attributes
         */
        constructor(_name: string);
        /**
         * Return the mutator-like path string to get from one node to another or null if no path is found e.g.:
         * ```typescript
         * "node/parent/children/1/components/ComponentSkeleton/0"
         * ```
         */
        static PATH_FROM_TO(_from: Node | Component, _to: Node | Component): string | null;
        /**
         * Return the {@link Node} or {@link Component} found at the given path starting from the given node or undefined if not found
         */
        static FIND<T = Node | Component>(_from: Node | Component, _path: string): T;
        get isActive(): boolean;
        /**
         * Shortcut to retrieve this nodes {@link ComponentTransform}
         */
        get cmpTransform(): ComponentTransform;
        /**
         * Shortcut to retrieve the local {@link Matrix4x4} attached to this nodes {@link ComponentTransform}
         * Fails if no {@link ComponentTransform} is attached
         */
        get mtxLocal(): Matrix4x4;
        get mtxWorldInverse(): Matrix4x4;
        /**
         * Returns the number of children attached to this
         */
        get nChildren(): number;
        /**
         * Generator yielding the node and all decendants in the graph below for iteration
         * Inactive nodes and their descendants can be filtered
         */
        getIterator(_active?: boolean): IterableIterator<Node>;
        /**
         * Returns an iterator over this node and all its descendants in the graph below
         */
        [Symbol.iterator](): IterableIterator<Node>;
        /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
        updateRenderData(_cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial, _cmpFaceCamera: ComponentFaceCamera, _cmpParticleSystem: ComponentParticleSystem): void;
        /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
        useRenderData(_mtxWorldOverride?: Matrix4x4): void;
        /**
         * De- / Activate this node. Inactive nodes will not be processed by the renderer.
         */
        activate(_on: boolean): void;
        /**
         * Returns a reference to this nodes parent node
         */
        getParent(): Node | null;
        /**
         * Traces back the ancestors of this node and returns the first.
         */
        getAncestor(): Node | null;
        /**
         * Traces the hierarchy upwards to the root and returns the path from the root to this node.
         */
        getPath(_out?: Node[], _offset?: number): Node[];
        /**
         * Returns child at the given index in the list of children
         */
        getChild(_index: number): Node;
        /**
         * Returns the readonly list of children. Create a copy to modify it.
         */
        getChildren(): readonly Node[];
        /**
         * Returns the first child with the supplied name.
         */
        getChildByName(_name: string): Node;
        /**
         * Returns an array of references to childnodes with the supplied name.
         */
        getChildrenByName(_name: string): Node[];
        /**
         * Returns the first descendant with the supplied name. Depth first search.
         */
        getDescendantByName(_name: string): Node;
        /**
         * Simply calls {@link addChild}. This reference is here solely because appendChild is the equivalent method in DOM.
         * See and preferably use {@link addChild}
         */
        readonly appendChild: (_child: Node) => void;
        /**
         * Adds the given reference to a node to the list of children, if not already in
         * @throws Error when trying to add an ancestor of this
         */
        addChild(_child: Node): void;
        /**
         * Adds the given reference to a node to the list of children at the given index. If it is already a child, it is moved to the new position.
         */
        addChild(_child: Node, _index: number): void;
        /**
         * Removes the reference to the give node from the list of children
         */
        removeChild(_child: Node): void;
        /**
         * Removes all references in the list of children
         */
        removeAllChildren(): void;
        /**
         * Returns the position of the node in the list of children or -1 if not found
         */
        findChild(_search: Node): number;
        /**
         * Replaces a child node with another, preserving the position in the list of children
         */
        replaceChild(_replace: Node, _with: Node): boolean;
        /**
         * Returns true if the given timestamp matches the last update timestamp this node underwent, else false
         */
        isUpdated(_timestampUpdate: number): boolean;
        /**
         * Returns true if this node is a descendant of the given node, directly or indirectly, else false
         */
        isDescendantOf(_ancestor: Node): boolean;
        /**
         * Applies a Mutator from {@link Animation} to all its components and transfers it to its children.
         */
        applyAnimation(_mutator: Mutator): void;
        /**
         * Returns a list of all components attached to this node, independent of type.
         */
        getAllComponents(): Component[];
        /**
         * Returns the list of components of the given class attached to this node. If no components of this type are attached, an empty array is returned.
         * @returns A **readonly** array of components.
         */
        getComponents<T extends Component>(_class: new () => T): readonly T[];
        /**
         * Returns the first compontent found of the given class attached this node or null, if list is empty or doesn't exist
         */
        getComponent<T extends Component>(_class: new () => T): T;
        /**
         * Attach the given component to this node. Identical to {@link addComponent}
         */
        attach(_component: Component): void;
        /**
         * Attach the given component to this node
         */
        addComponent(_component: Component): void;
        /**
         * Detach the given component from this node. Identical to {@link removeComponent}
         */
        detach(_component: Component): void;
        /**
         * Removes all components of the given class attached to this node.
         */
        removeComponents(_class: new () => Component): void;
        /**
         * Removes the given component from the node, if it was attached, and sets its parent to null.
         */
        removeComponent(_component: Component): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        toString(): string;
        /**
         * Creates a string as representation of this node and its descendants
         */
        toHierarchyString(_node?: Node, _level?: number): string;
        /**
         * Adds an event listener to the node. The given handler will be called when a matching event is passed to the node.
         * Deviating from the standard EventTarget, here the _handler must be a function and _capture is the only option.
         */
        addEventListener(_type: EVENT | string, _handler: EventListenerUnified, _capture?: boolean): void;
        /**
         * Removes an event listener from the node. The signature must match the one used with addEventListener
         */
        removeEventListener(_type: EVENT | string, _handler: EventListenerUnified, _capture?: boolean): void;
        /**
         * Dispatches a synthetic event to target. This implementation always returns true (standard: return true only if either event's cancelable attribute value is false or its preventDefault() method was not invoked)
         * The event travels into the hierarchy to this node dispatching the event, invoking matching handlers of the nodes ancestors listening to the capture phase,
         * than the matching handler of the target node in the target phase, and back out of the hierarchy in the bubbling phase, invoking appropriate handlers of the anvestors
         */
        dispatchEvent(_event: Event): boolean;
        /**
         * Dispatches a synthetic event to target without travelling through the graph hierarchy neither during capture nor bubbling phase
         */
        dispatchEventToTargetOnly(_event: Event): boolean;
        /**
         * Broadcasts a synthetic event to this node and from there to all nodes deeper in the hierarchy,
         * invoking matching handlers of the nodes listening to the capture phase. Watch performance when there are many nodes involved
         */
        broadcastEvent(_event: Event): void;
        private broadcastEventRecursive;
        /**
         * Calls the listeners with the given event. The listeners are called in the order they were added. Handles listeners removing themselves or other listeners from the list during execution.
         */
        private callListeners;
    }
}
declare namespace FudgeCore {
    /**
     * Superclass for all {@link Component}s that can be attached to {@link Node}s.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jascha Karagöl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
     */
    abstract class Component extends Mutable implements Serializable, Gizmo {
        #private;
        /** subclasses get a iSubclass number for identification */
        static readonly iSubclass: number;
        /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
        static readonly baseClass: typeof Component;
        /** list of all the subclasses derived from this class, if they registered properly*/
        static readonly subclasses: typeof Component[];
        protected singleton: boolean;
        protected active: boolean;
        constructor();
        protected static registerSubclass(_subclass: typeof Component): number;
        get isActive(): boolean;
        /**
         * Is true, when only one instance of the component class can be attached to a node
         */
        get isSingleton(): boolean;
        /**
         * Retrieves the node, this component is currently attached to
         */
        get node(): Node | null;
        /**
         * De- / Activate this component. Inactive components will not be processed by the renderer.
         */
        activate(_on: boolean): void;
        /**
         * Tries to attach the component to the given node, removing it from the node it was attached to if applicable
         */
        attachToNode(_container: Node | null): void;
        /**
         * Override this to draw visual aids for this component inside the editors render view. Use {@link Gizmos} inside the override to draw stuff.
         */
        drawGizmos?(_cmpCamera?: ComponentCamera): void;
        /**
         * See {@link drawGizmos}. Only displayed while the corresponding node is selected.
         */
        drawGizmosSelected?(_cmpCamera?: ComponentCamera): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): void | Promise<void>;
        protected mutateSync(_mutator: Mutator, _dispatchMutate?: boolean): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Wraps a regular Javascript Array and offers very limited functionality geared solely towards avoiding garbage colletion.
     * @author Jirka Dell'Oro-Friedl, HFU, 2021
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Recycler
     */
    class RecycableArray<T> {
        #private;
        get length(): number;
        /**
         * Sets the virtual length of the array to zero but keeps the entries beyond.
         */
        reset(): void;
        /**
         * Recycle this array
         */
        recycle(): void;
        /**
         * Appends a new entry to the end of the array, and returns the new length of the array.
         */
        push(_entry: T): number;
        /**
         * Removes the last entry from the array and returns it.
         */
        pop(): T;
        /**
         * Recycles the object following the last in the array and increases the array length
         * It must be assured, that none of the objects in the array is still in any use of any kind!
         */
        [Symbol.iterator](): IterableIterator<T>;
        /**
         * Returns a copy of the array sorted according to the given compare function
         */
        getSorted(_sort: (a: T, b: T) => number): T[];
    }
}
declare namespace FudgeCore {
    const enum EVENT_PHYSICS {
        TRIGGER_ENTER = "TriggerEnteredCollision",
        TRIGGER_EXIT = "TriggerLeftCollision",
        COLLISION_ENTER = "ColliderEnteredCollision",
        COLLISION_EXIT = "ColliderLeftCollision"
    }
    /**
     * Special type of {@link Event} for physics.
     */
    class EventPhysics extends Event {
        /**
         * ComponentRigidbody that collided with this ComponentRigidbody
         */
        cmpRigidbody: ComponentRigidbody;
        /**
         * The normal impulse between the two colliding objects. Normal represents the default impulse.
         * Impulse is only happening on COLLISION_ENTER, so there is no impulse on exit nor on triggers.
         * Use the velocity of the cmpRigidbody to determine the intensity of the EVENT instead.
         */
        normalImpulse: number;
        tangentImpulse: number;
        binomalImpulse: number;
        /** The point where the collision/triggering initially happened. The collision point exists only on COLLISION_ENTER / TRIGGER_ENTER. */
        collisionPoint: Vector3;
        /** The normal vector of the collision. Only existing on COLLISION_ENTER */
        collisionNormal: Vector3;
        /** Creates a new event customized for physics. Holding informations about impulses. Collision point and the body that is colliding */
        constructor(_type: EVENT_PHYSICS, _hitRigidbody: ComponentRigidbody, _normalImpulse: number, _tangentImpulse: number, _binormalImpulse: number, _collisionPoint?: Vector3, _collisionNormal?: Vector3);
    }
    /**
    * Groups to place a node in, not every group should collide with every group. Use a Mask in to exclude collisions
    */
    enum COLLISION_GROUP {
        DEFAULT = 1,
        GROUP_1 = 2,
        GROUP_2 = 4,
        GROUP_3 = 8,
        GROUP_4 = 16,
        GROUP_5 = 32
    }
    /**
    * Defines the type of the rigidbody which determines the way it interacts with the physical and the visual world
    */
    enum BODY_TYPE {
        /** The body ignores the hierarchy of the render graph, is completely controlled  by physics and takes its node with it  */
        DYNAMIC = 0,// = OIMO.RigidBodyType.DYNAMIC,
        /** The body ignores the hierarchy of the render graph, is completely immoveble and keeps its node from moving  */
        STATIC = 1,// = OIMO.RigidBodyType.STATIC,
        /** The body is controlled by its node and moves with it, while it impacts the physical world e.g. by collisions */
        KINEMATIC = 2
    }
    /**
    * Different types of collider shapes, with different options in scaling BOX = Vector3(length, height, depth),
    * SPHERE = Vector3(diameter, x, x), CAPSULE = Vector3(diameter, height, x), CYLINDER = Vector3(diameter, height, x),
    * CONE = Vector(diameter, height, x), PYRAMID = Vector3(length, height, depth); x == unused.
    * CONVEX = ComponentMesh needs to be available in the RB Property convexMesh, the points of that component are used to create a collider that matches,
    * the closest possible representation of that form, in form of a hull. Convex is experimental and can produce unexpected behaviour when vertices
    * are too close to one another and the given vertices do not form a in itself closed shape and having a genus of 0 (no holes). Vertices in the ComponentMesh can be scaled differently
    * for texturing/normal or other reasons, so the collider might be off compared to the visual shape, this can be corrected by changing the pivot scale of the ComponentRigidbody.
    */
    enum COLLIDER_TYPE {
        CUBE = 0,
        SPHERE = 1,
        CAPSULE = 2,
        CYLINDER = 3,
        CONE = 4,
        PYRAMID = 5,
        CONVEX = 6
    }
    /** Displaying different types of debug information about different physic features. Default = JOINTS_AND_COLLIDER. */
    enum PHYSICS_DEBUGMODE {
        NONE = 0,
        COLLIDERS = 1,
        JOINTS_AND_COLLIDER = 2,
        BOUNDING_BOXES = 3,
        CONTACTS = 4,
        PHYSIC_OBJECTS_ONLY = 5
    }
    /** Info about Raycasts shot from the physics system. */
    class RayHitInfo implements Recycable {
        hit: boolean;
        hitDistance: number;
        hitPoint: Vector3;
        rigidbodyComponent: ComponentRigidbody;
        hitNormal: Vector3;
        rayEnd: Vector3;
        rayOrigin: Vector3;
        constructor();
        recycle(): void;
    }
    /** General settings for the physic simulation and the debug of it. */
    class PhysicsSettings {
        constructor(_defaultCollisionGroup: number, _defaultCollisionMask: number);
        /** Change if rigidbodies are able to sleep (don't be considered in physical calculations) when their movement is below a threshold. Deactivation is decreasing performance for minor advantage in precision. */
        get disableSleeping(): boolean;
        set disableSleeping(_value: boolean);
        /** Sleeping Threshold for Movement Veloctiy. */
        get sleepingVelocityThreshold(): number;
        set sleepingVelocityThreshold(_value: number);
        /** Sleeping Threshold for Rotation Velocity. */
        get sleepingAngularVelocityThreshold(): number;
        set sleepingAngularVelocityThreshold(_value: number);
        /** Threshold how long the Rigidbody must be below/above the threshold to count as sleeping. */
        get sleepingTimeThreshold(): number;
        set sleepingTimeThreshold(_value: number);
        /** Error threshold. Default is 0.05. The higher the more likely collisions get detected before actual impact at high speeds but it's visually less accurate. */
        get defaultCollisionMargin(): number;
        set defaultCollisionMargin(_thickness: number);
        /** The default applied friction between two rigidbodies with the default value. How much velocity is slowed down when moving accross this surface. */
        get defaultFriction(): number;
        set defaultFriction(_value: number);
        /** Bounciness of rigidbodies. How much of the impact is restituted. */
        get defaultRestitution(): number;
        set defaultRestitution(_value: number);
        /** Groups the default rigidbody will collide with. Set it like: (PHYSICS_GROUP.DEFAULT | PHYSICS_GROUP.GROUP_1 | PHYSICS_GROUP.GROUP_2 | PHYSICS_GROUP.GROUP_3)
         * to collide with multiple groups. Default is collision with everything but triggers.
        */
        get defaultCollisionMask(): number;
        set defaultCollisionMask(_value: number);
        /** The group that this rigidbody belongs to. Default is the DEFAULT Group which means its just a normal Rigidbody not a trigger nor anything special. */
        get defaultCollisionGroup(): COLLISION_GROUP;
        set defaultCollisionGroup(_value: COLLISION_GROUP);
        /** Change the type of joint solver algorithm. Default Iterative == 0, is faster but less stable. Direct == 1, slow but more stable, recommended for complex joint work. Change this setting only at the start of your game. */
        get defaultConstraintSolverType(): number;
        set defaultConstraintSolverType(_value: number);
        /** The correction algorithm used to correct physics calculations. Change this only at the beginning of your game. Each has different approaches, so if you have problems test another
         *  Default 0 = Baumgarte (fast but less correct induces some energy errors), 1 = Split-Impulse (fast and no engery errors, but more inaccurate for joints), 2 = Non-linear Gauss Seidel (slowest but most accurate)*/
        get defaultCorrectionAlgorithm(): number;
        set defaultCorrectionAlgorithm(_value: number);
        /** The precision of the simulation in form of number of iterations the simulations runs through until it accepts the result.
         *  10 Default - Higher means more precision but results in a performance decrease. This helps especially with joints,
         * but also the general stability of the simulation due to simulation steps being rechecked multiple times before being set.
         */
        get solverIterations(): number;
        set solverIterations(_value: number);
    }
}
declare namespace FudgeCore {
    /**
       * Acts as the physical representation of a connection between two {@link Node}'s.
       * The type of conncetion is defined by the subclasses like prismatic joint, cylinder joint etc.
       * A Rigidbody on the {@link Node} that this component is added to is needed. Setting the connectedRigidbody and
       * initializing the connection creates a physical connection between them. This differs from a connection through hierarchy
       * in the node structure of fudge. Joints can have different DOF's (Degrees Of Freedom), 1 Axis that can either twist or swing is a degree of freedom.
       * A joint typically consists of a motor that limits movement/rotation or is activly trying to move to a limit. And a spring which defines the rigidity.
       * @author Marko Fehrenbach, HFU 2020
       */
    abstract class Joint extends Component {
        #private;
        /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
        static readonly baseClass: typeof Joint;
        /** list of all the subclasses derived from this class, if they registered properly*/
        static readonly subclasses: typeof Joint[];
        protected singleton: boolean;
        protected abstract joint: OIMO.Joint;
        protected abstract config: OIMO.JointConfig;
        /** Create a joint connection between the two given RigidbodyComponents. */
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody);
        protected static registerSubclass(_subclass: typeof Joint): number;
        /** Get/Set the first ComponentRigidbody of this connection. It should always be the one that this component is attached too in the sceneTree. */
        get bodyAnchor(): ComponentRigidbody;
        set bodyAnchor(_cmpRB: ComponentRigidbody);
        /** Get/Set the second ComponentRigidbody of this connection. */
        get bodyTied(): ComponentRigidbody;
        set bodyTied(_cmpRB: ComponentRigidbody);
        /**
         * The exact position where the two {@link Node}s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor(): Vector3;
        set anchor(_value: Vector3);
        /**
         * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
        */
        get breakTorque(): number;
        set breakTorque(_value: number);
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
         */
        get breakForce(): number;
        set breakForce(_value: number);
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
          * On a welding joint the connected bodies should not be colliding with each other,
          * for best results
         */
        get internalCollision(): boolean;
        set internalCollision(_value: boolean);
        /**
         * Connect a child node with the given name to the joint.
         */
        connectChild(_name: string): void;
        /**
         * Connect the given node to the joint. Tieing its rigidbody to the nodes rigidbody this component is attached to.
         */
        connectNode(_node: Node): void;
        /** Check if connection is dirty, so when either rb is changed disconnect and reconnect. Internally used no user interaction needed. */
        isConnected(): boolean;
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect(): void;
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect(): void;
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within FUDGE is needed.
        */
        getOimoJoint(): OIMO.Joint;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
        /** Tell the FudgePhysics system that this joint needs to be handled in the next frame. */
        protected dirtyStatus(): void;
        protected addJoint(): void;
        protected removeJoint(): void;
        protected constructJoint(..._configParams: Object[]): void;
        protected configureJoint(): void;
        protected deleteFromMutator(_mutator: Mutator, _delete: Mutator): void;
        private hndEvent;
    }
}
declare namespace FudgeCore {
    /**
       * Base class for joints operating with exactly one axis
       * @author Jirka Dell'Oro-Friedl, HFU, 2021
     */
    abstract class JointAxial extends Joint {
        #private;
        protected springDamper: OIMO.SpringDamper;
        /** Creating a cylindrical joint between two ComponentRigidbodies moving on one axis and rotating around another bound on a local anchorpoint. */
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axis?: Vector3, _localAnchor?: Vector3);
        /**
         * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axis(): Vector3;
        set axis(_value: Vector3);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get maxMotor(): number;
        set maxMotor(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get minMotor(): number;
        set minMotor(_value: number);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping(): number;
        set springDamping(_value: number);
        /**
          * The target speed of the motor in m/s.
         */
        get motorSpeed(): number;
        set motorSpeed(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency(): number;
        set springFrequency(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutator(): Mutator;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    export enum MODE {
        EDITOR = 0,
        RUNTIME = 1
    }
    export enum RESOURCE_STATUS {
        PENDING = 0,
        READY = 1,
        ERROR = 2
    }
    /** A serializable resource implementing an id and a name so it can be managed by the {@link Project} */
    export interface SerializableResource extends Serializable {
        readonly isSerializableResource: true;
        name: string;
        idResource: string;
        readonly type: string;
    }
    /** A serializable resource that is loaded from an external source (e.g. from a glTF-file) */
    export interface SerializableResourceExternal extends SerializableResource {
        url: RequestInfo;
        status: RESOURCE_STATUS;
        load(): Promise<SerializableResourceExternal>;
    }
    export interface Resources {
        [idResource: string]: SerializableResource;
    }
    export interface SerializationOfResources {
        [idResource: string]: Serialization;
    }
    export interface ScriptNamespaces {
        [name: string]: Object;
    }
    export interface ComponentScripts {
        [namespace: string]: ComponentScript[];
    }
    interface GraphInstancesToResync {
        [idResource: string]: GraphInstance[];
    }
    /**
     * Static class handling the resources used with the current FUDGE-instance.
     * Keeps a list of the resources and generates ids to retrieve them.
     * Resources are objects referenced multiple times but supposed to be stored only once
     */
    export abstract class Project extends EventTargetStatic {
        static resources: Resources;
        static serialization: SerializationOfResources;
        static scriptNamespaces: ScriptNamespaces;
        static baseURL: URL;
        static mode: MODE;
        static graphInstancesToResync: GraphInstancesToResync;
        /**
         * Registers the resource and generates an id for it by default.
         * If the resource already has an id, thus having been registered, its deleted from the list and registered anew.
         * It's possible to pass an id, but should not be done except by the Serializer.
         */
        static register(_resource: SerializableResource, _idResource?: string): void;
        /**
         * Removes the resource from the list of resources.
         */
        static deregister(_resource: SerializableResource): void;
        /**
         * Clears the list of resources and their serialization, thus removing all resources.
         */
        static clear(): void;
        /**
         * Returns an array of all resources of the requested type.
         */
        static getResourcesByType<T>(_type: new (_args: General) => T): SerializableResource[];
        /**
         * Returns an array of all resources with the requested name.
         */
        static getResourcesByName(_name: string): SerializableResource[];
        /**
         * Generate a user readable and unique id using the type of the resource, the date and random numbers
         * @param _resource
         */
        static generateId(_resource: SerializableResource): string;
        /**
         * Tests, if an object is a {@link SerializableResource}
         * @param _object The object to examine
         */
        static isResource(_object: Serializable): boolean;
        /**
         * Retrieves the resource stored with the given id
         */
        static getResource(_idResource: string): Promise<SerializableResource>;
        static cloneResource(_resource: SerializableResource): Promise<SerializableResource>;
        /**
         * Creates and registers a resource from a {@link Node}, copying the complete graph starting with it
         * @param _node A node to create the resource from
         * @param _replaceWithInstance if true (default), the node used as origin is replaced by a {@link GraphInstance} of the {@link Graph} created
         */
        static registerAsGraph(_node: Node, _replaceWithInstance?: boolean): Promise<Graph>;
        /**
         * Creates and returns a {@link GraphInstance} of the given {@link Graph}
         * and connects it to the graph for synchronisation of mutation.
         */
        static createGraphInstance(_graph: Graph): Promise<GraphInstance>;
        /**
         * Register the given {@link GraphInstance} to be resynced
         */
        static registerGraphInstanceForResync(_instance: GraphInstance): void;
        /**
         * Resync all {@link GraphInstance} registered to the given {@link Graph}
         */
        static resyncGraphInstances(_graph: Graph): Promise<void>;
        /**
         * Register the given namespace to the list of script-namespaces.
         */
        static registerScriptNamespace(_namespace: Object): void;
        /**
         * Clear the list of script-namespaces.
         */
        static clearScriptNamespaces(): void;
        /**
         * Collects all {@link ComponentScript}s registered in {@link Project.scriptNamespaces} and returns them.
         */
        static getComponentScripts(): ComponentScripts;
        /**
         * Loads a script from the given URL and integrates it into a {@link HTMLScriptElement} in the {@link document.head}
         */
        static loadScript(_url: RequestInfo): Promise<void>;
        /**
         * Load {@link Resources} from the given url
         */
        static loadResources(_url: RequestInfo): Promise<Resources>;
        /**
         * Load all resources from the {@link document.head}
         */
        static loadResourcesFromHTML(): Promise<void>;
        /**
         * Serialize all resources
         */
        static serialize(): SerializationOfResources;
        /**
         * Create resources from a serialization, deleting all resources previously registered
         * @param _serialization
         */
        static deserialize(_serialization: SerializationOfResources): Promise<Resources>;
        private static deserializeResource;
    }
    export {};
}
declare namespace FudgeCore {
    /** {@link TexImageSource} is a union type which as of now includes {@link VideoFrame}. All other parts of this union have a .width and .height property but VideoFrame does not. And since we only ever use {@link HTMLImageElement} and {@link OffscreenCanvas} currently VideoFrame can be excluded for convenience of accessing .width and .height */
    type ImageSource = Exclude<TexImageSource, VideoFrame>;
    /**
     * - CRISP: no mipmapping, mag filter nearest, min filter nearest
     * - MEDIUM: mipmapping, mag filter nearest, min filter nearest_mipmap_linear
     * - BLURRY: mipmapping, mag filter linear, min filter linear_mipmap_linear
     * - SMOOTH: no mipmapping, mag filter linear, min filter linear
     */
    export enum MIPMAP {
        CRISP = 0,
        MEDIUM = 1,
        BLURRY = 2,
        SMOOTH = 3
    }
    export enum WRAP {
        REPEAT = 0,
        CLAMP = 1,
        MIRROR = 2
    }
    /**
     * Baseclass for different kinds of textures.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    export abstract class Texture extends Mutable implements SerializableResource {
        #private;
        name: string;
        idResource: string;
        protected renderData: unknown;
        protected textureDirty: boolean;
        protected mipmapDirty: boolean;
        protected wrapDirty: boolean;
        constructor(_name?: string);
        get isSerializableResource(): true;
        set mipmap(_mipmap: MIPMAP);
        get mipmap(): MIPMAP;
        set wrap(_wrap: WRAP);
        get wrap(): WRAP;
        /**
         * Returns the image source of this texture.
         */
        abstract get texImageSource(): ImageSource;
        /**
         * Refreshes the image data in the render engine.
         */
        refresh(): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(_extendable?: boolean): Mutator;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        protected reduceMutator(_mutator: Mutator): void;
    }
    /**
     * Texture created from an existing image
     */
    export class TextureImage extends Texture {
        image: HTMLImageElement;
        url: RequestInfo;
        constructor(_url?: RequestInfo);
        get texImageSource(): ImageSource;
        /**
         * Asynchronously loads the image from the given url
         */
        load(_url: RequestInfo): Promise<void>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
    }
    /**
     * Texture created from a canvas
     */
    export class TextureBase64 extends Texture {
        image: HTMLImageElement;
        constructor(_name: string, _base64: string, _mipmap?: MIPMAP, _wrap?: WRAP, _width?: number, _height?: number);
        get texImageSource(): ImageSource;
    }
    /**
     * Texture created from a canvas
     */
    export class TextureCanvas extends Texture {
        crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
        constructor(_name: string, _crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D);
        get texImageSource(): ImageSource;
    }
    /**
     * Texture created from a text. Texture upates when the text or font changes. The texture is resized to fit the text.
     * @authors Jonas Plotzky, HFU, 2024
     */
    export class TextureText extends Texture {
        #private;
        protected crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
        constructor(_name: string, _text?: string, _font?: string);
        set text(_text: string);
        get text(): string;
        set font(_font: string);
        get font(): string;
        get texImageSource(): ImageSource;
        get width(): number;
        get height(): number;
        get hasTransparency(): boolean;
        private get canvas();
        useRenderData(_textureUnit?: number): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(_extendable?: boolean): Mutator;
    }
    /**
     * Texture created from a FUDGE-Sketch
     */
    export class TextureSketch extends TextureCanvas {
        get texImageSource(): ImageSource;
    }
    /**
     * Texture created from an HTML-page
     */
    export class TextureHTML extends TextureCanvas {
        get texImageSource(): ImageSource;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Abstract base class for all meshes.
     * Meshes provide indexed vertices, the order of indices to create trigons and normals, and texture coordinates
     *
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019/22
     */
    abstract class Mesh extends Mutable implements SerializableResource {
        #private;
        /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
        static readonly baseClass: typeof Mesh;
        /** list of all the subclasses derived from this class, if they registered properly*/
        static readonly subclasses: typeof Mesh[];
        idResource: string;
        name: string;
        vertices: Vertices;
        faces: Face[];
        /** bounding box AABB */
        protected ƒbox: Box;
        /** bounding radius */
        protected ƒradius: number;
        constructor(_name?: string);
        protected static registerSubclass(_subClass: typeof Mesh): number;
        get isSerializableResource(): true;
        get renderMesh(): RenderMesh;
        get boundingBox(): Box;
        get radius(): number;
        /**
         * Clears the bounds of this mesh aswell as the buffers of the associated {@link RenderMesh}.
         */
        clear(): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
        protected createRadius(): number;
        protected createBoundingBox(): Box;
    }
}
declare namespace FudgeCore {
    /**
     * Baseclass for materials. Combines a {@link Shader} with a compatible {@link Coat}
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Material extends Mutable implements SerializableResource {
        #private;
        /** The name to call the Material by. */
        name: string;
        idResource: string;
        timestampUpdate: number;
        private shaderType;
        constructor(_name: string, _shader?: typeof Shader, _coat?: Coat);
        get isSerializableResource(): true;
        /**
         * Returns the currently referenced {@link Coat} instance
         */
        get coat(): Coat;
        /**
         * Makes this material reference the given {@link Coat} if it is compatible with the referenced {@link Shader}
         */
        set coat(_coat: Coat);
        /**
         * Creates a new {@link Coat} instance that is valid for the {@link Shader} referenced by this material
         */
        createCoatMatchingShader(): Coat;
        /**
         * Changes the materials reference to the given {@link Shader}, creates and references a new {@link Coat} instance
         * and mutates the new coat to preserve matching properties.
         * @param _shaderType
         */
        setShader(_shaderType: typeof Shader): void;
        /**
         * Returns the {@link Shader} referenced by this material
         */
        getShader(): typeof Shader;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * The namesapce for handling the particle data
     */
    namespace ParticleData {
        /**
         * The data structure for a particle system. Describes the particle behavior and appearance.
         */
        interface System {
            variableNames?: string[];
            variables?: Expression[];
            color?: Expression[];
            mtxLocal?: Transformation[];
            mtxWorld?: Transformation[];
        }
        type Recursive = System | Expression[] | Transformation[] | Transformation | Expression;
        type Expression = Function | Variable | Constant | Code;
        interface Function {
            function: FUNCTION;
            parameters: Expression[];
        }
        interface Variable {
            value: string;
        }
        interface Constant {
            value: number;
        }
        interface Code {
            code: string;
        }
        interface Transformation {
            transformation: "translate" | "rotate" | "scale";
            parameters: Expression[];
        }
        /**
         * Returns true if the given data is a {@link Expression}
         */
        function isExpression(_data: Recursive): _data is Expression;
        /**
         * Returns true if the given data is a {@link Function}
         */
        function isFunction(_data: Recursive): _data is Function;
        /**
         * Returns true if the given data is a {@link Variable}
         */
        function isVariable(_data: Recursive): _data is Variable;
        /**
         * Returns true if the given data is a {@link Constant}
         */
        function isConstant(_data: Recursive): _data is Constant;
        /**
         * Returns true if the given data is a {@link Code}
         */
        function isCode(_data: Recursive): _data is Code;
        /**
         * Returns true if the given data is a {@link Transformation}
         */
        function isTransformation(_data: Recursive): _data is Transformation;
    }
    /**
     * Holds information on how to mutate the particles of a particle system.
     * A full particle system is composed by attaching a {@link ComponentParticleSystem}, {@link ComponentMesh} and {@link ComponentMaterial} to the same {@link Node}.
     * Additionally a {@link ComponentFaceCamera} can be attached to make the particles face the camera.
     * @authors Jonas Plotzky, HFU, 2022
     */
    class ParticleSystem extends Mutable implements SerializableResource {
        #private;
        name: string;
        idResource: string;
        constructor(_name?: string, _data?: ParticleData.System);
        get isSerializableResource(): true;
        get data(): ParticleData.System;
        set data(_data: ParticleData.System);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
    /**
     * Holds an array of bones ({@link Node}s within a {@link Graph}). Referenced from a {@link ComponentMesh} it can be associated with a {@link Mesh} and enable skinning for the mesh.
     * @authors Matthias Roming, HFU, 2022-2023 | Jonas Plotzky, HFU, 2023
     */
    class ComponentSkeleton extends Component {
        /** The bones used for skinning */
        bones: Node[];
        /** When applied to vertices, it moves them from object/model space to bone-local space as if the bone were at its initial pose */
        mtxBindInverses: Matrix4x4[];
        protected renderBuffer: unknown;
        protected singleton: boolean;
        /** Contains the bone transformations applicable to the vertices of a {@link Mesh} */
        protected mtxBones: Matrix4x4[];
        protected mtxBonesData: Float32Array;
        protected bonesDirty: boolean;
        constructor(_bones?: Node[], _mtxBoneInverses?: Matrix4x4[]);
        /**
         * Adds a node as a bone with its bind inverse matrix
         */
        addBone(_bone: Node, _mtxBindInverse?: Matrix4x4): void;
        /**
         * Return the index of the first bone in the bones array which has the given name, and -1 otherwise.
         */
        indexOf(_name: string): number;
        /**
         * Return the index of the first occurrence of the given bone node in the bone array, or -1 if it is not present.
         */
        indexOf(_node: Node): number;
        /**
         * Resets the pose of this skeleton to the default pose
         */
        resetPose(): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<ComponentSkeleton>;
    }
}
declare function ifNumber(_check: number, _default: number): number;
declare namespace FudgeCore {
    /**
     * Holds information about the AnimationStructure that the Animation uses to map the Sequences to the Attributes.
     * Built out of a {@link Node}'s serialsation, it swaps the values with {@link AnimationSequence}s.
     */
    interface AnimationStructure {
        [attribute: string]: AnimationStructure[] | AnimationStructure | AnimationSequence;
    }
    /**
    * An associative array mapping names of lables to timestamps.
    * Labels need to be unique per Animation.
    * @author Lukas Scheuerle, HFU, 2019
    */
    interface AnimationLabel {
        [name: string]: number;
    }
    /**
    * Holds information about Animation Event Triggers
    * @author Lukas Scheuerle, HFU, 2019
    */
    interface AnimationEventTrigger {
        [name: string]: number;
    }
    /**
     * Holds different playmodes the animation uses to play back its animation.
     * @author Lukas Scheuerle, HFU, 2019
     */
    enum ANIMATION_PLAYMODE {
        /**Plays animation in a loop: it restarts once it hit the end.*/
        LOOP = "loop",
        /**Plays animation once and stops at the last key/frame*/
        PLAY_ONCE = "playOnce",
        /**Plays animation once and stops on the first key/frame */
        PLAY_ONCE_RESET = "playOnceReset",
        /**Plays animation like LOOP, but backwards.*/
        REVERSE_LOOP = "reverseLoop",
        /**Causes the animation not to play at all. Useful for jumping to various positions in the animation without proceeding in the animation.*/
        STOP = "stop"
    }
    enum ANIMATION_QUANTIZATION {
        /**Calculates the state of the animation at the exact position of time. Ignores FPS value of animation.*/
        CONTINOUS = "continous",
        /**Limits the calculation of the state of the animation to the FPS value of the animation. Skips frames if needed.*/
        DISCRETE = "discrete",
        /** Advances the time each frame according to the FPS value of the animation, ignoring the actual duration of the frames. Doesn't skip any frames.*/
        FRAMES = "frames"
    }
    /**
     * Describes and controls and animation by yielding mutators
     * according to the stored {@link AnimationStructure} and {@link AnimationSequence}s
     * Applied to a {@link Node} directly via script or {@link ComponentAnimation}.
     * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021-2023 | Jonas Plotzky, HFU, 2025
     */
    class Animation extends Mutable implements SerializableResource {
        #private;
        static readonly subclasses: typeof Animation[];
        static readonly iSubclass: number;
        idResource: string;
        name: string;
        totalTime: number;
        labels: AnimationLabel;
        animationStructure: AnimationStructure;
        events: AnimationEventTrigger;
        protected framesPerSecond: number;
        private eventsProcessed;
        constructor(_name?: string, _animStructure?: AnimationStructure, _fps?: number);
        /**
         * Override the given base mutator with the given override mutator using linear interpolation between the values with the given weight.
         * Set the intersect flag to only include properties in the result that exist in both of the given mutators.
         */
        static blendOverride(_base: Mutator, _override: Mutator, _weight: number, _intersect?: boolean): Mutator;
        /**
         * Add the given additive mutator to the given base mutator. The values of the additive mutator will be multiplied by the given weight.
         */
        static blendAdditive(_base: Mutator, _add: Mutator, _weight: number): Mutator;
        /**
         * Blend the two given mutators together, using the given weights to determine the influence of each.
         * The resulting mutator will contain all properties of the base mutator, with the properties of the blend mutator blended in.
         * Blend mutator properties that don't exist in the base mutator will be added to the result mutator.
         * Set the intersect flag to only include properties in the result that exist in both of the given mutators.
         */
        static blendRecursive(_base: Mutator, _blend: Mutator, _weightBase: number, _weightBlend: number, _intersect?: boolean): Mutator;
        protected static registerSubclass(_subClass: typeof Animation): number;
        get isSerializableResource(): true;
        get getLabels(): Enumerator;
        get fps(): number;
        set fps(_fps: number);
        /**
         * Clear this animations cache.
         */
        clearCache(): void;
        /**
         * Generates and returns a {@link Mutator} with the information to apply to the {@link Node} to animate
         * in the state the animation is in at the given time, direction and quantization
         */
        getState(_time: number, _direction: number, _quantization: ANIMATION_QUANTIZATION, _mutatorOut?: Mutator): Mutator;
        /**
         * Returns a list of the names of the events the {@link ComponentAnimation} needs to fire between _min and _max input values.
         * @param _direction The direction the animation is supposed to run in. >0 == forward, 0 == stop, <0 == backwards
         * @returns a list of strings with the names of the custom events to fire.
         */
        getEventsToFire(_min: number, _max: number, _quantization: ANIMATION_QUANTIZATION, _direction: number): string[] | null;
        /**
         * Adds an Event to the List of events.
         * @param _name The name of the event (needs to be unique per Animation).
         * @param _time The timestamp of the event (in milliseconds).
         */
        setEvent(_name: string, _time: number): void;
        /**
         * Removes the event with the given name from the list of events.
         * @param _name name of the event to remove.
         */
        removeEvent(_name: string): void;
        /**
         * (Re-)Calculate the total time of the Animation. Calculation-heavy, use only if actually needed.
         */
        calculateTotalTime(): void;
        /**
         * Returns the time to use for animation sampling when applying a playmode
         */
        getModalTime(_time: number, _playmode: ANIMATION_PLAYMODE, _timeStop?: number): number;
        /**
         * Calculates and returns the direction the animation should currently be playing in.
         * @param _time the time at which to calculate the direction
         * @returns 1 if forward, 0 if stop, -1 if backwards
         */
        calculateDirection(_time: number, _playmode: ANIMATION_PLAYMODE): number;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
        /**
         * Traverses an AnimationStructure and returns the Serialization of said Structure.
         * @param _structure The Animation Structure at the current level to transform into the Serialization.
         * @returns the filled Serialization.
         */
        private traverseStructureForSerialization;
        /**
         * Traverses a Serialization to create a new AnimationStructure.
         * @param _serialization The serialization to transfer into an AnimationStructure
         * @returns the newly created AnimationStructure.
         */
        private traverseStructureForDeserialization;
        /**
         * Finds and returns the list of events to be used with these settings.
         */
        private getCorrectEventList;
        /**
         * Traverses an {@link AnimationStructure} and returns a {@link Mutator} describing the state at the given time.
         */
        private traverseStructureForMutator;
        /**
         * Traverses the current AnimationStrcuture to find the totalTime of this animation.
         * @param _structure The structure to traverse
         */
        private traverseStructureForTime;
        private getAnimationStructure;
        /**
         * Ensures the existance of the requested {@link AnimationStructure} and returns it.
         * @param _type the type of the structure to get
         * @returns the requested [[@link AnimationStructure]]
         */
        private getProcessedAnimationStructure;
        /**
         * Ensures the existance of the requested {@link AnimationEventTrigger} and returns it.
         * @param _type The type of AnimationEventTrigger to get
         * @returns the requested {@link AnimationEventTrigger}
         */
        private getProcessedEventTrigger;
        /**
         * Traverses an existing structure to apply a recalculation function to the AnimationStructure to store in a new Structure.
         * @param _oldStructure The old structure to traverse
         * @param _functionToUse The function to use to recalculated the structure.
         * @returns A new Animation Structure with the recalulated Animation Sequences.
         */
        private traverseStructureForNewStructure;
        /**
         * Creates a reversed Animation Sequence out of a given Sequence.
         * @param _sequence The sequence to calculate the new sequence out of
         * @returns The reversed Sequence
         */
        private calculateReverseSequence;
        /**
         * Creates a rastered {@link AnimationSequence} out of a given sequence.
         * @param _sequence The sequence to calculate the new sequence out of
         * @returns the rastered sequence.
         */
        private calculateRasteredSequence;
        /**
         * Creates a new reversed {@link AnimationEventTrigger} object based on the given one.
         * @param _events the event object to calculate the new one out of
         * @returns the reversed event object
         */
        private calculateReverseEventTriggers;
        /**
         * Creates a rastered {@link AnimationEventTrigger} object based on the given one.
         * @param _events the event object to calculate the new one out of
         * @returns the rastered event object
         */
        private calculateRasteredEventTriggers;
        /**
         * Checks which events lay between two given times and returns the names of the ones that do.
         * @param _eventTriggers The event object to check the events inside of.
         * @param _min the minimum of the range to check between (inclusive).
         * @param _max the maximum of the range to check between (exclusive).
         * @param _events the array to add the names of the events to.
         * @returns an given array of the events appended with the events in the given range.
         */
        private addEventsBetween;
    }
}
declare namespace FudgeCore {
    /**
     * Calculates the values between {@link AnimationKey}s.
     * Represented internally by a cubic function (`f(x) = ax³ + bx² + cx + d`).
     * Only needs to be recalculated when the keys change, so at runtime it should only be calculated once.
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2025
     */
    abstract class AnimationFunction<T extends AnimationReturnType = AnimationReturnType> {
        protected a: T;
        protected b: T;
        protected c: T;
        protected d: T;
        protected keyIn: AnimationKey<T>;
        protected keyOut: AnimationKey<T>;
        constructor(_keyIn: AnimationKey<T>, _keyOut?: AnimationKey<T>);
        /**
         * Returns the parameter values of this cubic function. `f(x) = ax³ + bx² + cx + d`
         * Used by editor.
         */
        getParameters(): {
            a: T;
            b: T;
            c: T;
            d: T;
        };
        /**
         * Calculates the value of the function at the given time.
         * @param _time the point in time at which to evaluate the function in milliseconds. Will be corrected for offset internally.
         * @returns the value at the given time
         */
        abstract evaluate(_time: number, _mutatorOut: AnimationReturnType): T;
        /**
         * (Re-)Calculates the parameters of the cubic function.
         * See https://math.stackexchange.com/questions/3173469/calculate-cubic-equation-from-two-points-and-two-slopes-variably
         * and https://jirkadelloro.github.io/FUDGE/Documentation/Logs/190410_Notizen_LS
         */
        abstract calculate(): void;
    }
    class AnimationFunctionNumber extends AnimationFunction<number> {
        evaluate(_time: number): number;
        calculate(): void;
    }
    class AnimationFunctionVector3 extends AnimationFunction<MutatorVector3> {
        evaluate(_time: number, _out?: MutatorVector3): MutatorVector3;
        calculate(): void;
    }
    class AnimationFunctionQuaternion extends AnimationFunction<MutatorQuaternion> {
        evaluate(_time: number, _out?: MutatorQuaternion): MutatorQuaternion;
        calculate(): void;
    }
}
declare namespace FudgeCore {
    const AnimationGLTF_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Animation;
    /**
     * An {@link Animation} loaded from a glTF-File.
     * @authors Jonas Plotzky
     */
    export class AnimationGLTF extends AnimationGLTF_base {
        load(_url?: RequestInfo, _name?: string): Promise<AnimationGLTF>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
    export {};
}
declare namespace FudgeCore {
    enum ANIMATION_INTERPOLATION {
        CONSTANT = 0,
        LINEAR = 1,
        CUBIC = 2
    }
    /**
     * Holds information about continous points in time their accompanying values as well as their slopes.
     * Also holds a reference to the {@link AnimationFunction}s that come in and out of the sides.
     * The {@link AnimationFunction}s are handled by the {@link AnimationSequence}s.
     * If the property constant is true, the value does not change and wil not be interpolated between this and the next key in a sequence
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2025
     */
    class AnimationKey<T extends AnimationReturnType = AnimationReturnType> extends Mutable implements Serializable {
        #private;
        /**Don't modify this unless you know what you're doing.*/
        functionOut: AnimationFunction<T>;
        constructor(_time?: number, _value?: T, _interpolation?: ANIMATION_INTERPOLATION, _slopeIn?: T, _slopeOut?: T);
        /**
         * Static comparation function to use in an array sort function to sort the keys by their time.
         * @param _a the animation key to check
         * @param _b the animation key to check against
         * @returns >0 if a>b, 0 if a=b, <0 if a<b
         */
        static compare<T extends AnimationReturnType, K extends AnimationKey<T>>(_a: K, _b: K): number;
        get time(): number;
        set time(_time: number);
        get value(): T;
        set value(_value: T);
        get interpolation(): ANIMATION_INTERPOLATION;
        set interpolation(_interpolation: ANIMATION_INTERPOLATION);
        get slopeIn(): T;
        set slopeIn(_slope: T);
        get slopeOut(): T;
        set slopeOut(_slope: T);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /** Blending modes used in {@link AnimationNodeBlend}. */
    enum ANIMATION_BLENDING {
        /** Adds this animation to the previous animations. */
        ADDITIVE = "Additive",
        /** Overrides the previous animations using linear interpolation. */
        OVERRIDE = "Override"
    }
    /**
     * Base class for all animation nodes. Animation nodes form an animation graph enabling hierachical animation blending and animation transitions.
     * Can be attached to a {@link Node} via {@link ComponentAnimationGraph}.
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    abstract class AnimationNode {
        /** The (blended) {@link Animation.getState animation mutator} at the state of the last call to {@link update}. */
        mutator: Mutator;
        /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
        events: string[];
        /** The playback speed */
        speed: number;
        /** The weight used for blending this node with others in an {@link AnimationNodeBlend}. Default: 1.*/
        weight: number;
        /** The mode used for blending this node with others in an {@link AnimationNodeBlend}. Default: {@link ANIMATION_BLENDING.OVERRIDE}. */
        blending: ANIMATION_BLENDING;
        constructor(_options?: {
            speed?: number;
            weight?: number;
            blending?: ANIMATION_BLENDING;
        });
        /** Resets the time. */
        abstract reset(): void;
        /** Updates the {@link mutator} and {@link events} according the given delta time */
        abstract update(_deltaTime: number, _pose?: Mutator): void;
    }
    /**
     * Evaluates a single {@link Animation} providing a {@link mutator} and {@link events}.
     * Used as an input for other {@link AnimationNode}s.
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    class AnimationNodeAnimation extends AnimationNode {
        animation: Animation;
        playmode: ANIMATION_PLAYMODE;
        /** The time after the last call to {@link update}. */
        time: number;
        /** The time offset from which the animation starts when reset. */
        offset?: number;
        constructor(_animation: Animation, _options?: {
            speed?: number;
            offset?: number;
            playmode?: ANIMATION_PLAYMODE;
            weight?: number;
            blending?: ANIMATION_BLENDING;
        });
        constructor();
        constructor(_mutator: Mutator);
        /** Resets this node to its {@link offset} time. */
        reset(): void;
        update(_deltaTime: number): void;
    }
    /**
     * Blends multiple input {@link AnimationNode}s providing a blended {@link mutator} and the {@link events} from all nodes.
     * Each child node must specify its own blend {@link weight} and {@link blending}. Processes nodes sequentially, each node blends with the accumulated result.
     * When combined with {@link AnimationNodeTransition}s as children, transitions from/into an empty state will blend from/into the accumulated result of this node.
     * @author Jonas Plotzky, HFU, 2024-2025
     *
     * **Example walk-run-blend:**
     * ```typescript
     * import ƒ = FudgeCore;
     * // initialization
     * const walk: ƒ.Animation = new ƒ.Animation();
     * const run: ƒ.Animation = new ƒ.Animation();
     * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
     * const nodeRun: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(run, { speed: run.totalTime / walk.totalTime }) // slow down the playback speed of run to synchronize the motion with walk.
     * const nodeMove: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWalk, nodeRun]);
     * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
     * cmpAnimationGraph.root = nodeMove;
     *
     * // during the game
     * nodeRun.weight = 0.5; // adjust the weight: 0 is walking, 1 is running.
     * nodeMove.speed = 1 + nodeRun.weight * nodeRun.speed; // adjust the playback speed of the blend to account for the slowed down run animation.
     * ```
     * **Example transition-empty-state:**
     * ```typescript
     * import ƒ = FudgeCore;
     * // initialization
     * const idle: ƒ.Animation = new ƒ.Animation();
     * const walk: ƒ.Animation = new ƒ.Animation();
     * const draw: ƒ.Animation = new ƒ.Animation();
     * const sheathe: ƒ.Animation = new ƒ.Animation();
     *
     * const nodeEmpty: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation();
     * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
     * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
     * const nodeDraw: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(draw, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
     * const nodeSheathe: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(sheathe, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
     *
     * const nodeWholeBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
     * const nodeUpperBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeEmpty);
     * const nodeRoot: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWholeBody, nodeUpperBody]);
     * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
     * cmpAnimationGraph.root = nodeRoot;
     *
     * // during the game
     * nodeWholeBody.transit(nodeWalk, 300); // transit whole body into walk.
     * // in parallel to the whole body, the upper body can transit from empty to draw/sheath and back to empty.
     * nodeUpperBody.transit(nodeDraw, 300); // transit upper body from empty into draw.
     * nodeUpperBody.transit(nodeSheathe, 300); // transit upper body from draw into sheathe.
     * nodeUpperBody.transit(nodeEmpty, 300); // transit upper body from sheathe into empty.
     * ```
     */
    class AnimationNodeBlend extends AnimationNode {
        nodes: AnimationNode[];
        constructor(_nodes: AnimationNode[], _options?: {
            speed?: number;
            weight?: number;
            blending?: ANIMATION_BLENDING;
        });
        reset(): void;
        update(_deltaTime: number): void;
    }
    /**
     * Allows to transition from one {@link AnimationNode} to another over a specified time.
     * If nested inside an {@link AnimationNodeBlend}, transit from/into an empty state to blend from/into the accumulated result of the container blend node.
     * @author Jonas Plotzky, HFU, 2024-2025
     *
     * **Example:**
     * ```typescript
     * import ƒ = FudgeCore;
     * // initialization
     * const idle: ƒ.Animation = new ƒ.Animation();
     * const walk: ƒ.Animation = new ƒ.Animation();
     * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
     * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
     * const nodeTransition: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
     * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
     * cmpAnimationGraph.root = nodeTransition;
     *
     * // during the game
     * nodeTransition.transit(nodeWalk, 300); // transit to the walk animation in 300ms.
     * nodeTransition.transit(nodeIdle, 300); // transit back to the idle animation.
     * ```
     */
    class AnimationNodeTransition extends AnimationNode {
        from: AnimationNode;
        to: AnimationNode;
        duration: number;
        time: number;
        constructor(_animation: AnimationNode, _options?: {
            speed?: number;
            weight?: number;
            blending?: ANIMATION_BLENDING;
        });
        reset(): void;
        /** Transit to the given {@link AnimationNode} over the specified duration. The given node will be {@link reset}. */
        transit(_to: AnimationNode, _duration: number): void;
        update(_deltaTime: number, _pose: Mutator): void;
    }
}
declare namespace FudgeCore {
    interface MutatorVector3 {
        x?: number;
        y?: number;
        z?: number;
    }
    interface MutatorQuaternion {
        x: number;
        y: number;
        z: number;
        w: number;
    }
    type AnimationReturnType = number | MutatorVector3 | MutatorQuaternion;
    type AnimationClassType<T extends AnimationReturnType = AnimationReturnType> = T extends number ? NumberConstructor : T extends MutatorQuaternion ? typeof Quaternion : T extends MutatorVector3 ? typeof Vector3 : never;
    /**
     * A sequence of {@link AnimationKey}s that is mapped to an attribute of a {@link Node} or its {@link Component}s inside the {@link Animation}.
     * Provides functions to modify said keys
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022-2025
     */
    class AnimationSequence<T extends AnimationReturnType = AnimationReturnType, C extends AnimationClassType<T> = AnimationClassType<T>> extends Mutable implements Serializable {
        #private;
        protected keys: AnimationKey<T>[];
        constructor(_keys: AnimationKey<T>[], _valueType: C);
        get length(): number;
        get classType(): C;
        private set classType(value);
        /**
         * Evaluates the sequence at the given point in time.
         * @param _time the point in time at which to evaluate the sequence in milliseconds.
         * @returns the value of the sequence at the given time. undefined if there are no keys.
         */
        evaluate<T extends AnimationReturnType>(_time: number, _out?: T): T;
        /**
         * Adds a new key to the sequence.
         * @param _key the key to add
         */
        addKey(_key: AnimationKey<T>): void;
        /**
         * Modifys a given key in the sequence.
         * @param _key the key to add
         */
        modifyKey(_key: AnimationKey<T>, _time?: number, _value?: T): void;
        /**
         * Removes a given key from the sequence.
         * @param _key the key to remove
         */
        removeKey(_key: AnimationKey<T>): void;
        /**
         * Find a key in the sequence exactly matching the given time.
         */
        findKey(_time: number): AnimationKey<T>;
        /**
         * Removes the Animation Key at the given index from the keys.
         * @param _index the zero-based index at which to remove the key
         * @returns the removed AnimationKey if successful, null otherwise.
         */
        removeKeyAtIndex(_index: number): AnimationKey<T>;
        /**
         * Gets a key from the sequence at the desired index.
         * @param _index the zero-based index at which to get the key
         * @returns the AnimationKey at the index if it exists, null otherwise.
         */
        getKey(_index: number): AnimationKey<T>;
        /**
         * Returns this sequence's keys. This is not a copy, but the actual array used internally. Handle with care!
         * Used by Editor.
         */
        getKeys(): AnimationKey<T>[];
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        /**
         * Utility function that (re-)generates all functions in the sequence.
         */
        protected regenerateFunctions(_keys?: AnimationKey<T>[]): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    class AnimationSprite extends Animation {
        #private;
        static readonly iSubclass: number;
        private frames;
        private wrapAfter;
        private start;
        private size;
        private next;
        private wrap;
        constructor(_name?: string);
        get texture(): Texture;
        /**
         * Sets the texture to be used as the spritesheet
         */
        set texture(_texture: Texture);
        /**
         * Creates this animation sprite from the given arguments
         */
        create(_texture: Texture, _frames: number, _wrapAfter: number, _start: Vector2, _size: Vector2, _next: Vector2, _wrap: Vector2, _framesPerSecond: number): void;
        /**
         * Returns the scale of the spritesheet
         */
        getScale(): Vector2;
        /**
         * Returns the positions of the spritesheet
         */
        getPositions(): Vector2[];
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        /**
         * Converts the {@link AnimationSprite} into an {@link Animation}
         */
        convertToAnimation(): Animation;
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * A track of events trigerred at specific times during an animation.
         */
        class AnimationEventTrack {
            times: number[];
            events: string[][];
            constructor(_times?: number[], _events?: string[][]);
        }
        /**
         * Represents an animation consisting of multiple channels. Each channel targets a specific property within a node hierarchy and contains keyframes that define the animation's behavior over time.
         */
        class Animation extends Mutable implements SerializableResource {
            idResource: string;
            name: string;
            duration: number;
            channels: AnimationChannel[];
            eventTrack: AnimationEventTrack;
            constructor(_name?: string, _duration?: number, _channels?: AnimationChannel[], _eventTrack?: AnimationEventTrack);
            get isSerializableResource(): true;
            serialize(): SerializationOf<Animation>;
            deserialize(_serialization: Serialization): Promise<Animation>;
            protected reduceMutator(_mutator: Mutator): void;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * Stores the path and keyframe data to animate a single property within a node hierarchy.
         * The keyframes are stored in an input/output buffer pair: a set of scalar values representing the timestamps; and a set of elements (scalar, vector, quaternion etc.) representing the animated property.
         * Interpolation between keyframes is defined by the set {@link ANIMATION_INTERPOLATION}. When used with {@link ANIMATION_INTERPOLATION.CUBIC cubic} interpolation, for each timestamp there must be three associated keyframe elements: in-tangent, property value, and out-tangent.
         *
         * **Example vector3-input-output:**
         *
         * `input: [t0, t1, ...]`
         *
         * `output: [e0x, e0y, e0z, e1x, e1y, e1z, ...]`
         *
         * **Example vector2-input-cubic-output:** in and out tangents (`a`, `b`) and elements (`e`) must be grouped within keyframes.
         *
         * `input: [t0, t1, ...]`
         *
         * `output: [a0x, a0y, e0x, e0y, b0x, b0y, a1x, a1y, e1x, e1y, b1x, b1y, ...]`
         */
        abstract class AnimationChannel implements Serializable {
            targetPath: string;
            input: Float32Array;
            output: Float32Array;
            interpolation: ANIMATION_INTERPOLATION;
            constructor(_targetPath?: string, _input?: Float32Array, _output?: Float32Array, _interpolation?: ANIMATION_INTERPOLATION);
            /**
             * Returns the size of a single element in the output buffer, which is the number of values per element. e.g. 3 for a vector3, 4 for a quaternion, 1 for a scalar.
             */
            getElementSize(): number;
            createInterpolant(_result?: Float32Array): AnimationInterpolant;
            serialize(): SerializationOf<AnimationChannel>;
            deserialize(_serialization: SerializationOf<AnimationChannel>): Promise<AnimationChannel>;
            /**
             * Interpolates between keyframe[i-1] and keyframe[i] using the given t value in the range [0, 1].
             */
            interpolate(_i1: number, _t: number, _out: Float32Array): void;
            protected createInterpolantConstant(_result?: Float32Array): AnimationInterpolant;
            protected createInterpolantLinear(_result?: Float32Array): AnimationInterpolant;
            protected createInterpolantCubic(_result?: Float32Array): AnimationInterpolant;
        }
        class AnimationChannelNumber extends AnimationChannel {
        }
        class AnimationChannelVector extends AnimationChannel {
        }
        class AnimationChannelColor extends AnimationChannel {
        }
        class AnimationChannelQuaternion extends AnimationChannel {
            protected createInterpolantLinear(_result?: Float32Array): AnimationInterpolant;
            protected createInterpolantCubic(_result?: Float32Array): AnimationInterpolant;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * Handles evaluation and interpolation of animation keyframe data.
         */
        abstract class AnimationInterpolant {
            input: Float32Array;
            output: Float32Array;
            result: Float32Array;
            elementSize: number;
            constructor(_input: Float32Array, _output: Float32Array, _elementSize: number, _result?: Float32Array);
            /**
             * Evaluates the interpolant at a given time.
             */
            evaluate(_t: number): Float32Array;
            /**
             * Interpolates between the input/output buffer segment `[_i1 - 1, _i1]`.
             * @param _i1 - The index of the right-hand keyframe.
             * @param _t0 - The left-hand input value. input[_i1 - 1]
             * @param _t - The value to interpolate at. Between _t0 and _t1.
             * @param _t1 - The right-hand input value. input[_i1]
             */
            abstract interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
        class AnimationInterpolantConstant extends AnimationInterpolant {
            interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
        class AnimationInterpolantLinear extends AnimationInterpolant {
            interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
        class AnimationInterpolantQuaternionLinear extends AnimationInterpolant {
            interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
        class AnimationInterpolantCubic extends AnimationInterpolant {
            /**
             * The stride of the elements in the output array, which is the size of one element multiplied by 3 (inTangent, element, outTangent).
             */
            elementStride: number;
            constructor(_times: Float32Array, _output: Float32Array, _elementSize: number, _result?: Float32Array);
            interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
        class AnimationInterpolantQuaternionCubic extends AnimationInterpolantCubic {
            interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /** Blending modes used in {@link AnimationNodeBlend}. */
        enum ANIMATION_BLENDING {
            /** Adds this animation to the previous animations. */
            ADDITIVE = "Additive",
            /** Overrides the previous animations using linear interpolation. */
            OVERRIDE = "Override"
        }
        /**
         * Base class for all animation nodes. Animation nodes form an animation graph enabling hierachical animation blending and animation transitions.
         * Can be attached to a {@link Node} via {@link ComponentAnimationGraph}.
         * @author Jonas Plotzky, HFU, 2024-2025
         */
        abstract class AnimationNode {
            values: Map<string, Float32Array>;
            /** The playback speed */
            speed: number;
            /** The weight used for blending this node with others in an {@link AnimationNodeBlend}. Default: 1.*/
            weight: number;
            /** The mode used for blending this node with others in an {@link AnimationNodeBlend}. Default: {@link ANIMATION_BLENDING.OVERRIDE}. */
            blending: ANIMATION_BLENDING;
            constructor(_speed?: number, _weight?: number, _blending?: ANIMATION_BLENDING);
            /** Resets the time. */
            abstract reset(): void;
            /** Updates the animation according the given delta time */
            abstract update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void;
        }
        /**
         * Evaluates a single {@link Animation}.
         * Used as an input for other {@link AnimationNode}s.
         * @author Jonas Plotzky, HFU, 2024-2025
         */
        class AnimationNodeAnimation extends AnimationNode {
            #private;
            animation: Animation;
            playmode: ANIMATION_PLAYMODE;
            interpolants: AnimationInterpolant[];
            time: number;
            offset: number;
            constructor(_animation: Animation, _playmode?: ANIMATION_PLAYMODE, _speed?: number, _offset?: number, _weight?: number, _blending?: ANIMATION_BLENDING);
            reset(): void;
            update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void;
        }
        /**
         * Blends multiple input {@link AnimationNode}s.
         * Each child node must specify its own blend {@link weight} and {@link blending}. Processes nodes sequentially, each node blends with the accumulated result.
         * When combined with {@link AnimationNodeTransition}s as children, transitions from/into an empty state will blend from/into the accumulated result of this node.
         * @author Jonas Plotzky, HFU, 2024-2025
         *
         * **Example walk-run-blend:**
         * ```typescript
         * import ƒ = FudgeCore;
         * // initialization
         * const walk: ƒ.Animation = new ƒ.Animation();
         * const run: ƒ.Animation = new ƒ.Animation();
         * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
         * const nodeRun: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(run, { speed: run.totalTime / walk.totalTime }) // slow down the playback speed of run to synchronize the motion with walk.
         * const nodeMove: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWalk, nodeRun]);
         * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
         * cmpAnimationGraph.root = nodeMove;
         *
         * // during the game
         * nodeRun.weight = 0.5; // adjust the weight: 0 is walking, 1 is running.
         * nodeMove.speed = 1 + nodeRun.weight * nodeRun.speed; // adjust the playback speed of the blend to account for the slowed down run animation.
         * ```
         * **Example transition-empty-state:**
         * ```typescript
         * import ƒ = FudgeCore;
         * // initialization
         * const idle: ƒ.Animation = new ƒ.Animation();
         * const walk: ƒ.Animation = new ƒ.Animation();
         * const draw: ƒ.Animation = new ƒ.Animation();
         * const sheathe: ƒ.Animation = new ƒ.Animation();
         *
         * const nodeEmpty: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation();
         * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
         * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
         * const nodeDraw: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(draw, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
         * const nodeSheathe: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(sheathe, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
         *
         * const nodeWholeBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
         * const nodeUpperBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeEmpty);
         * const nodeRoot: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWholeBody, nodeUpperBody]);
         * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
         * cmpAnimationGraph.root = nodeRoot;
         *
         * // during the game
         * nodeWholeBody.transit(nodeWalk, 300); // transit whole body into walk.
         * // in parallel to the whole body, the upper body can transit from empty to draw/sheath and back to empty.
         * nodeUpperBody.transit(nodeDraw, 300); // transit upper body from empty into draw.
         * nodeUpperBody.transit(nodeSheathe, 300); // transit upper body from draw into sheathe.
         * nodeUpperBody.transit(nodeEmpty, 300); // transit upper body from sheathe into empty.
         * ```
         */
        class AnimationNodeBlend extends AnimationNode {
            nodes: AnimationNode[];
            constructor(_nodes: AnimationNode[], _speed?: number, _weight?: number, _blending?: ANIMATION_BLENDING);
            reset(): void;
            update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void;
        }
        /**
         * Allows to transition from one {@link AnimationNode} to another over a specified time.
         * If nested inside an {@link AnimationNodeBlend}, transit from/into an empty state to blend from/into the accumulated result of the container blend node.
         * @author Jonas Plotzky, HFU, 2024-2025
         *
         * **Example:**
         * ```typescript
         * import ƒ = FudgeCore;
         * // initialization
         * const idle: ƒ.Animation = new ƒ.Animation();
         * const walk: ƒ.Animation = new ƒ.Animation();
         * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
         * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
         * const nodeTransition: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
         * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
         * cmpAnimationGraph.root = nodeTransition;
         *
         * // during the game
         * nodeTransition.transit(nodeWalk, 300); // transit to the walk animation in 300ms.
         * nodeTransition.transit(nodeIdle, 300); // transit back to the idle animation.
         * ```
         */
        class AnimationNodeTransition extends AnimationNode {
            #private;
            /**
             * All nodes that can be transitioned to/from.
             */
            nodes: AnimationNode[];
            current: AnimationNode;
            target: AnimationNode;
            canceled: boolean;
            transition: boolean;
            duration: number;
            time: number;
            constructor(_nodes: AnimationNode[], _animation: AnimationNode, _speed?: number, _weight?: number, _blending?: ANIMATION_BLENDING);
            reset(): void;
            /**
             * Transit to the given {@link AnimationNode} over the specified duration. The given node will be {@link reset}.
             */
            transit(_target: AnimationNode, _duration: number): void;
            update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * Binds a specific property within a node hierarchy (via a path) and allows direct access to it.
         */
        class AnimationPropertyBinding {
            #private;
            root: Node;
            path: string;
            pathParsed: {
                nodePath: string[];
                componentType: string;
                componentIndex: string;
                targetPath: string[];
            };
            node: Node;
            component: Component;
            target: Mutable;
            key: string;
            property: unknown | ArrayConvertible;
            /** The animated value to be applied to the property */
            output: Float32Array;
            constructor(_root: Node, _path: string, _output: Float32Array);
            /**
             * @example "childName/childName/childName/components/ComponentTransform/0/mtxLocal/translation"
             * @example "components/ComponentTransform/0"
             */
            static parsePath(_path: string): AnimationPropertyBinding["pathParsed"];
            static findNode(_rootNode: Node, _parsedPath: string[]): Node;
            static findTarget(_component: Component, _parsedPath: string[]): Mutable;
            bind(): void;
            unbind(): void;
            apply(): void;
            set(_source: Float32Array, _offset: number): void;
            get(_target: Float32Array, _offset: number): void;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * Binds a specific {@link Mutable} animation target within a node graph and allows {@link Mutable.animate animation} of it.
         */
        class AnimationTargetBinding {
            target: Mutable;
            animationMutator: AnimationMutator;
            mutator: AnimationMutator;
            propertyBindings: AnimationPropertyBinding[];
            constructor(_target: Mutable, _propertyBindings: AnimationPropertyBinding[]);
            apply(): void;
        }
    }
}
declare namespace FudgeCore {
    namespace AnimationSystem {
        /**
         * Attaches a {@link AnimationNode} to a {@link Node} and updates the node's properties according to the animation graph.
         */
        class ComponentAnimationGraph extends Component {
            #private;
            root: AnimationNode;
            constructor(_root?: AnimationNode);
            bind(): void;
            unbind(): void;
            update(_deltaTime: number): void;
            private hndRenderPrepare;
            private onComponentAdd;
            private onComponentRemove;
        }
    }
}
declare namespace FudgeCore {
    /**
     * Extension of AudioBuffer with a load method that creates a buffer in the {@link AudioManager}.default to be used with {@link ComponentAudio}
     * @authors Thomas Dorner, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class Audio extends Mutable implements SerializableResource {
        name: string;
        idResource: string;
        buffer: AudioBuffer;
        path: URL;
        private url;
        private ready;
        constructor(_url?: RequestInfo);
        get isSerializableResource(): true;
        get isReady(): boolean;
        /**
         * Asynchronously loads the audio (mp3) from the given url
         */
        load(_url: RequestInfo): Promise<void>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    const enum EVENT_AUDIO {
        /** broadcast to a {@link Node} and all its descendants in the graph after it was appended to a parent */
        CHILD_APPEND = "childAppendToAudioGraph",
        /** broadcast to a {@link Node} and all its descendants in the graph just before its being removed from its parent */
        CHILD_REMOVE = "childRemoveFromAudioGraph",
        /** broadcast to a {@link Node} and all its descendants in the graph to update the panners in AudioComponents */
        UPDATE = "updateAudioGraph",
        /** fired when the audio file was loaded and is ready for playing */
        READY = "ready",
        /** fired when the end of the audio is reached while playing */
        ENDED = "ended"
    }
}
declare namespace FudgeCore {
    /**
     * Extends the standard AudioContext for integration with FUDGE-graphs.
     * Creates a default object at startup to be addressed as AudioManager default.
     * Other objects of this class may be create for special purposes.
     */
    class AudioManager extends AudioContext {
        /** The default context that may be used throughout the project without the need to create others */
        static readonly default: AudioManager;
        private static eventUpdate;
        /** The master volume all AudioNodes in the context should attach to */
        readonly gain: GainNode;
        private graph;
        private cmpListener;
        constructor(_contextOptions?: AudioContextOptions);
        /**
         * Set the master volume
         */
        set volume(_value: number);
        /**
         * Get the master volume
         */
        get volume(): number;
        /**
         * Determines FUDGE-graph to listen to. Each {@link ComponentAudio} in the graph will connect to this contexts master gain, all others disconnect.
         */
        listenTo: (_graph: Node | null) => void;
        /**
         * Retrieve the FUDGE-graph currently listening to
         */
        getGraphListeningTo: () => Node;
        /**
         * Set the {@link ComponentAudioListener} that serves the spatial location and orientation for this contexts listener
         */
        listenWith: (_cmpListener: ComponentAudioListener | null) => void;
        /**
         * Updates the spatial settings of the AudioNodes effected in the current FUDGE-graph
         */
        update: () => void;
    }
}
declare namespace FudgeCore {
    /**
     * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive an ambient occlusion effect.
     * @authors Roland Heer, HFU, 2023 | Jonas Plotzky, HFU, 2023
     */
    class ComponentAmbientOcclusion extends Component {
        static readonly iSubclass: number;
        sampleRadius: number;
        bias: number;
        attenuationConstant: number;
        attenuationLinear: number;
        attenuationQuadratic: number;
        constructor(_sampleRadius?: number, _bias?: number, _attenuationConstant?: number, _attenuationLinear?: number, _attenuationQuadratic?: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * Holds a reference to an {@link Animation} and controls it. Controls quantization and playmode as well as speed.
     * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2022-2025
     */
    class ComponentAnimation extends Component {
        #private;
        static readonly iSubclass: number;
        playmode: ANIMATION_PLAYMODE;
        quantization: ANIMATION_QUANTIZATION;
        scaleWithGameTime: boolean;
        animateInEditor: boolean;
        constructor(_animation?: Animation, _playmode?: ANIMATION_PLAYMODE, _quantization?: ANIMATION_QUANTIZATION);
        get animation(): Animation;
        set animation(_animation: Animation);
        set scale(_scale: number);
        get scale(): number;
        /**
         * - get: return the current sample time of the animation
         * - set: jump to a certain sample time in the animation
         */
        get time(): number;
        set time(_time: number);
        activate(_on: boolean): void;
        /**
         * Jumps to a certain time in the animation to play from there.
         */
        jumpTo(_time: number): void;
        /**
         * Jumps to a certain label in the animation if defined
         */
        jumpToLabel(_label: string): void;
        /**
         * Forces an update of the animation from outside. Used in the ViewAnimation. Shouldn't be used during the game.
         * @param _time the (unscaled) time to update the animation with.
         * @returns the Mutator for Animation.
         */
        updateAnimation(_time: number): Mutator;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        private activateListeners;
        /**
         * Updates the Animation.
         * Uses the built-in time unless a different time is specified.
         * May also be called from updateAnimation().
         */
        private updateAnimationLoop;
        /**
         * Fires all custom events the Animation should have fired between the last frame and the current frame.
         * @param _events a list of names of custom events to fire
         */
        private executeEvents;
        /**
         * Updates the scale of the animation if the user changes it or if the global game timer changed its scale.
         */
        private updateScale;
    }
}
declare namespace FudgeCore {
    /**
     * Attaches an {@link AnimationNode animation graph} to a {@link Node} and animates it.
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    class ComponentAnimationGraph extends Component {
        static readonly iSubclass: number;
        root: AnimationNode;
        constructor(_root?: AnimationNode);
        private update;
    }
}
declare namespace FudgeCore {
    enum AUDIO_PANNER {
        CONE_INNER_ANGLE = "coneInnerAngle",
        CONE_OUTER_ANGLE = "coneOuterAngle",
        CONE_OUTER_GAIN = "coneOuterGain",
        DISTANCE_MODEL = "distanceModel",
        MAX_DISTANCE = "maxDistance",
        PANNING_MODEL = "panningModel",
        REF_DISTANCE = "refDistance",
        ROLLOFF_FACTOR = "rolloffFactor"
    }
    enum AUDIO_NODE_TYPE {
        SOURCE = 0,
        PANNER = 1,
        GAIN = 2
    }
    /**
     * Builds a minimal audio graph (by default in {@link AudioManager}.default) and synchronizes it with the containing {@link Node}
     * ```text
     * ┌ AudioManager(.default) ────────────────────────┐
     * │ ┌ ComponentAudio ───────────────────┐          │
     * │ │    ┌──────┐   ┌──────┐   ┌──────┐ │ ┌──────┐ │
     * │ │    │source│ → │panner│ → │ gain │ → │ gain │ │
     * │ │    └──────┘   └──────┘   └──────┘ │ └──────┘ │
     * │ └───────────────────────────────────┘          │
     * └────────────────────────────────────────────────┘
     * ```
     * @authors Thomas Dorner, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentAudio extends Component {
        static readonly iSubclass: number;
        /** places and directs the panner relative to the world transform of the {@link Node}  */
        mtxPivot: Matrix4x4;
        protected singleton: boolean;
        private audio;
        private gain;
        private panner;
        private source;
        private audioManager;
        private playing;
        private listened;
        constructor(_audio?: Audio, _loop?: boolean, _start?: boolean, _audioManager?: AudioManager);
        set volume(_value: number);
        get volume(): number;
        set loop(_on: boolean);
        get loop(): boolean;
        set playbackRate(_value: number);
        get playbackRate(): number;
        get isPlaying(): boolean;
        get isAttached(): boolean;
        get isListened(): boolean;
        /**
         * Sets the given {@link Audio} as the audio source
         */
        setAudio(_audio: Audio): void;
        /**
         * Returns the {@link Audio} currently used as audio source
         */
        getAudio(): Audio;
        /**
         * Set the property of the panner to the given value. Use to manipulate range and rolloff etc.
         */
        setPanner(_property: AUDIO_PANNER, _value: number): void;
        /**
         * Returns the mutator for the specified AudioNode of the standard graph
         */
        getMutatorOfNode(_type: AUDIO_NODE_TYPE): Mutator;
        /**
         * Returns the specified AudioNode of the standard graph for further manipulation
         */
        getAudioNode(_type: AUDIO_NODE_TYPE): AudioNode;
        /**
         * Start or stop playing the audio
         */
        play(_on: boolean): void;
        /**
         * Inserts AudioNodes between the panner and the local gain of this {@link ComponentAudio}
         * _input and _output may be the same AudioNode, if there is only one to insert,
         * or may have multiple AudioNode between them to create an effect-graph.\
         * Note that {@link ComponentAudio} does not keep track of inserted AudioNodes!
         * ```text
         * ┌ AudioManager(.default) ──────────────────────────────────────────────────────┐
         * │ ┌ ComponentAudio ─────────────────────────────────────────────────┐          │
         * │ │    ┌──────┐   ┌──────┐   ┌──────┐          ┌───────┐   ┌──────┐ │ ┌──────┐ │
         * │ │    │source│ → │panner│ → │_input│ → ...  → │_output│ → │ gain │ → │ gain │ │
         * │ │    └──────┘   └──────┘   └──────┘          └───────┘   └──────┘ │ └──────┘ │
         * │ └─────────────────────────────────────────────────────────────────┘          │
         * └──────────────────────────────────────────────────────────────────────────────┘
         * ```
         */
        insertAudioNodes(_input: AudioNode, _output: AudioNode): void;
        /**
         * Activate override. Connects or disconnects AudioNodes
         */
        activate(_on: boolean): void;
        /**
         * Connects this components gain-node to the gain node of the AudioManager this component runs on.
         * Only call this method if the component is not attached to a {@link Node} but needs to be heard.
         */
        connect(_on: boolean): void;
        drawGizmos(): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        protected reduceMutator(_mutator: Mutator): void;
        private hndAudioReady;
        private hndAudioEnded;
        private install;
        private createSource;
        private updateConnection;
        /**
         * Automatically connects/disconnects AudioNodes when adding/removing this component to/from a node.
         * Therefore unused AudioNodes may be garbage collected when an unused component is collected
         */
        private handleAttach;
        /**
         * Automatically connects/disconnects AudioNodes when appending/removing the FUDGE-graph the component is in.
         */
        private handleGraph;
        /**
         * Updates the panner node, its position and direction, using the worldmatrix of the container and the pivot of this component.
         */
        private update;
    }
}
declare namespace FudgeCore {
    /**
     * Serves to set the spatial location and orientation of AudioListeners relative to the
     * world transform of the {@link Node} it is attached to.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentAudioListener extends Component {
        static readonly iSubclass: number;
        mtxPivot: Matrix4x4;
        /**
         * Updates the position and orientation of the given AudioListener
         */
        update(_listener: AudioListener): void;
    }
}
declare namespace FudgeCore {
    /**
     * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive a bloom-effect.
     * @authors Roland Heer, HFU, 2023
     */
    class ComponentBloom extends Component {
        #private;
        static readonly iSubclass: number;
        constructor(_threshold?: number, _intensity?: number, _desaturateHighlights?: number);
        get threshold(): number;
        set threshold(_value: number);
        get intensity(): number;
        set intensity(_value: number);
        get highlightDesaturation(): number;
        set highlightDesaturation(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
    }
}
declare namespace FudgeCore {
    enum FIELD_OF_VIEW {
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        DIAGONAL = "diagonal"
    }
    /**
     * Defines identifiers for the various projections a camera can provide.
     * TODO: change back to number enum if strings not needed
     */
    enum PROJECTION {
        CENTRAL = "central",
        ORTHOGRAPHIC = "orthographic",
        DIMETRIC = "dimetric",
        STEREO = "stereo"
    }
    /**
     * The camera component holds the projection-matrix and other data needed to render a scene from the perspective of the node it is attached to.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
     */
    class ComponentCamera extends Component {
        #private;
        static readonly iSubclass: number;
        mtxPivot: Matrix4x4;
        readonly mtxWorld: Matrix4x4;
        clrBackground: Color;
        /**
         * Returns {@link mtxProjection} * {@link mtxCameraInverse}
         * yielding the worldspace to viewspace matrix
         */
        get mtxWorldToView(): Matrix4x4;
        /**
         * Returns the inversion of this cameras worldtransformation
         */
        get mtxCameraInverse(): Matrix4x4;
        /**
         * Returns the projectionmatrix of this camera.
         */
        get mtxProjection(): Matrix4x4;
        /**
         * Returns true if the background of the camera should be rendered, false if not.
         */
        get backgroundEnabled(): boolean;
        /**
         * Returns the cameras {@link PROJECTION} mode.
         */
        get projection(): PROJECTION;
        /**
         * Returns the cameras aspect ratio.
         */
        get aspectRatio(): number;
        /**
         * Returns the cameras field of view in degrees.
         */
        get fieldOfView(): number;
        /**
         * Returns the cameras direction i.e. the plane on which the fieldOfView-Angle is given.
         */
        get direction(): FIELD_OF_VIEW;
        /**
         * Returns the cameras near value i.e. the minimum distance to render objects at.
         */
        get near(): number;
        /**
         * Returns the cameras far value i.e. the maximum distance to render objects at.
         */
        get far(): number;
        /**
         * Returns the cameras {@link PROJECTION} mode.
         * @deprecated Use {@link projection} instead.
         */
        getProjection(): PROJECTION;
        /**
         * Returns true if the background of the camera should be rendered, false if not.
         * @deprecated Use {@link backgroundEnabled} instead.
         */
        getBackgroundEnabled(): boolean;
        /**
         * Returns the cameras aspect ratio.
         * @deprecated Use {@link aspectRatio} instead.
         */
        getAspect(): number;
        /**
         * Returns the cameras field of view in degrees.
         * @deprecated Use {@link fieldOfView} instead.
         */
        getFieldOfView(): number;
        /**
         * Returns the cameras direction i.e. the plane on which the fieldOfView-Angle is given.
         * @deprecated Use {@link direction} instead.
         */
        getDirection(): FIELD_OF_VIEW;
        /**
         * Returns the cameras near value i.e. the minimum distance to render objects at.
         * @deprecated Use {@link near} instead.
         */
        getNear(): number;
        /**
         * Returns the cameras far value i.e. the maximum distance to render objects at.
         * @deprecated Use {@link far} instead.
         */
        getFar(): number;
        /**
         * Set the camera to perspective projection. The world origin is in the center of the canvaselement.
         * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
         * @param _fieldOfView The field of view in Degrees. (Default = 45)
         * @param _direction The plane on which the fieldOfView-Angle is given
         */
        projectCentral(_aspect?: number, _fieldOfView?: number, _direction?: FIELD_OF_VIEW, _near?: number, _far?: number): void;
        /**
         * Set the camera to orthographic projection. Default values are derived the canvas client dimensions
         * @param _left The positionvalue of the projectionspace's left border.
         * @param _right The positionvalue of the projectionspace's right border.
         * @param _bottom The positionvalue of the projectionspace's bottom border.
         * @param _top The positionvalue of the projectionspace's top border.
         */
        projectOrthographic(_left?: number, _right?: number, _bottom?: number, _top?: number): void;
        /**
         * Returns a (recycled) rectangle of the calculated dimension of a projection surface in the hypothetical distance of 1 to the camera.
         * @param _out Optional rectangle to store the result in.
         */
        getProjectionRectangle(_out?: Rectangle): Rectangle;
        /**
         * Transforms the given point from world space to clip space.
         * @param _out Optional vector to store the result in.
         */
        pointWorldToClip(_pointInWorldSpace: Vector3, _out?: Vector3): Vector3;
        /**
         * Transforms the given point from clip space to world space.
         * @param _out Optional vector to store the result in.
         */
        pointClipToWorld(_pointInClipSpace: Vector3, _out?: Vector3): Vector3;
        /**
         * Returns a scaling factor that, given a position in world space,
         * scales an object at that position so that one unit equals one (logical) pixel on the screen
         * when seen through this camera.
         * e.g., after setting the scaling, 1 unit in the world equals one (logical) pixel on the screen.
         */
        getWorldToPixelScale(_posWorld: Vector3): number;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        drawGizmos(): void;
        drawGizmosSelected(): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Makes the node face the camera when rendering, respecting restrictions for rotation around specific axis
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
     */
    class ComponentFaceCamera extends Component {
        static readonly iSubclass: number;
        upLocal: boolean;
        up: Vector3;
        restrict: boolean;
        constructor();
    }
}
declare namespace FudgeCore {
    /**
     * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive a fog-effect.
     * @authors Roland Heer, HFU, 2023
     */
    class ComponentFog extends Component {
        static readonly iSubclass: number;
        color: Color;
        near: number;
        far: number;
        constructor(_color?: Color, _near?: number, _far?: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * Filters synchronization between a graph instance and the graph it is connected to. If active, no synchronization occurs.
     * Maybe more finegrained in the future...
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
     */
    class ComponentGraphFilter extends Component {
        static readonly iSubclass: number;
        constructor();
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * Defines identifiers for the various types of light this component can provide.
     */
    enum LIGHT_TYPE {
        AMBIENT = "LightAmbient",
        DIRECTIONAL = "LightDirectional",
        POINT = "LightPoint",
        SPOT = "LightSpot"
    }
    /**
      * Attaches a light to the node.
      * The pivot matrix has different effects depending on the {@link LIGHT_TYPE}. See there for details.
      * @authors Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
      */
    class ComponentLight extends Component {
        static readonly iSubclass: number;
        lightType: LIGHT_TYPE;
        mtxPivot: Matrix4x4;
        color: Color;
        intensity: number;
        constructor(_lightType?: LIGHT_TYPE, _color?: Color, _intensity?: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        drawGizmos(): void;
        drawGizmosSelected(): void;
    }
}
declare namespace FudgeCore {
    /**
     * Attaches a {@link Material} to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019 - 2021
     */
    class ComponentMaterial extends Component {
        static readonly iSubclass: number;
        clrPrimary: Color;
        clrSecondary: Color;
        mtxPivot: Matrix3x3;
        material: Material;
        /** Support sorting of objects with transparency when rendering, render objects in the back first. When this component is used as a part of a {@link ParticleSystem}, try enabling this when disabling {@link ComponentParticleSystem.depthMask} */
        sortForAlpha: boolean;
        constructor(_material?: Material);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * Attaches a {@link Mesh} to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentMesh extends Component {
        #private;
        static readonly iSubclass: number;
        readonly mtxWorld: Matrix4x4;
        mesh: Mesh;
        skeleton: ComponentSkeleton;
        constructor(_mesh?: Mesh, _skeleton?: ComponentSkeleton);
        get mtxPivot(): Matrix4x4;
        set mtxPivot(_mtx: Matrix4x4);
        get radius(): number;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        drawGizmosSelected(): void;
    }
}
declare namespace FudgeCore {
    /**
     * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes all nodes in {@link selection} to be drawn with a 1px outline.
     * @authors Jonas Plotzky, HFU, 2025
     */
    class ComponentOutline extends Component {
        color: Color;
        colorOccluded: Color;
        selection: Iterable<Node>;
        constructor(_selection?: Node[], _color?: Color, _colorOccluded?: Color);
    }
}
declare namespace FudgeCore {
    enum PARTICLE_SYSTEM_PLAYMODE {
        /**Plays particle system in a loop: it restarts once it hit the end.*/
        LOOP = 0,
        /**Plays particle system once and stops at the last point in time.*/
        PLAY_ONCE = 1
    }
    /**
     * Attaches a {@link ParticleSystem} to the node.
     * Works in conjunction with {@link ComponentMesh} and {@link ComponentMaterial} to create a shader particle system.
     * Additionally a {@link ComponentFaceCamera} can be attached to make the particles face the camera.
     * @author Jonas Plotzky, HFU, 2022
     */
    class ComponentParticleSystem extends Component {
        #private;
        static readonly iSubclass: number;
        particleSystem: ParticleSystem;
        /** When disabled try enabling {@link ComponentMaterial.sortForAlpha} */
        depthMask: boolean;
        blendMode: BLEND;
        playMode: PARTICLE_SYSTEM_PLAYMODE;
        duration: number;
        constructor(_particleSystem?: ParticleSystem);
        /**
         * Get the number of particles
         */
        get size(): number;
        /**
         * Set the number of particles. Caution: Setting this will reinitialize the random numbers array(texture) used in the shader.
         */
        set size(_size: number);
        get time(): number;
        set time(_time: number);
        get timeScale(): number;
        set timeScale(_scale: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutatorForAnimation(): MutatorForAnimation;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        private hndEvent;
        private update;
        private updateTimeScale;
    }
}
declare namespace FudgeCore {
    enum PICK {
        RADIUS = "radius",
        CAMERA = "camera",
        PHYSICS = "physics"
    }
    /**
     * Attaches picking functionality to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class ComponentPick extends Component {
        static readonly iSubclass: number;
        pick: PICK;
        /**
         * Picks the node according to the given {@link Ray} and invokes events accordingly
         */
        pickAndDispatch(_ray: Ray, _event: PointerEvent): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        drawGizmosSelected(_cmpCamera: ComponentCamera): void;
    }
}
declare namespace FudgeCore {
    /**
     * Base class for scripts the user writes
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
     */
    class ComponentScript extends Component {
        static readonly iSubclass: number;
        constructor();
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * Attaches a {@link TextureText} to the node.
     * Works in conjunction with {@link ComponentMesh} and {@link ComponentMaterial} to create a text node.
     * A 'textured' {@link Material} (e.g. {@link ShaderLitTextured}) must be used to display the text properly. Ideally a {@link MeshQuad} should be used to render the text onto.
     * Additionally a {@link ComponentFaceCamera} can be attached to make the text face the camera.
     * @authors Jonas Plotzky, HFU, 2024
     */
    class ComponentText extends Component {
        static readonly iSubclass: number;
        readonly texture: TextureText;
        readonly mtxWorld: Matrix4x4;
        /** - on: The texts size is fixed to match the set font size
         *  - off: The font size is stretched to match the attached meshes size
         */
        fixedSize: boolean;
        constructor(_text?: string, _font?: string);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        useRenderData(_mtxMeshToWorld: Matrix4x4, _cmpCamera: ComponentCamera): Matrix4x4;
        drawGizmosSelected(): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    enum BASE {
        SELF = 0,
        PARENT = 1,
        WORLD = 2,
        NODE = 3
    }
    /**
     * Attaches a transform-{@link Matrix4x4} to the node, moving, scaling and rotating it in space relative to its parent.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentTransform extends Component {
        static readonly iSubclass: number;
        mtxLocal: Matrix4x4;
        constructor(_mtxInit?: Matrix4x4);
        /**
         * recalculates this local matrix to yield the identical world matrix based on the given node.
         * Use rebase before appending the container of this component to another node while preserving its transformation in the world.
         */
        rebase(_node?: Node): void;
        /**
         * Applies the given transformation relative to the selected base (SELF, PARENT, WORLD) or a particular other node (NODE)
         */
        transform(_mtxTransform: Matrix4x4, _base?: BASE, _node?: Node): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Describes a VR Controller and its capabilities.
     */
    class VRController {
        cmpTransform: ComponentTransform;
        gamePad: Gamepad;
        thumbstickX: number;
        thumbstickY: number;
    }
    /**
     * VR Component Class, for Session Management, Controller Management and Reference Space Management.
     * @author Valentin Schmidberger, HFU, 2022
     */
    class ComponentVRDevice extends ComponentCamera {
        #private;
        static readonly iSubclass: number;
        rightCntrl: VRController;
        leftCntrl: VRController;
        constructor();
        /**
         * Returns the actual matrix of the vr - device.
         * Creators should use this for readonly purposes.
         */
        get mtxLocal(): Matrix4x4;
        /**
         * Sets a Vector3 as Position of the reference space.
         */
        set translation(_translation: Vector3);
        /**
         * Sets Vector3 Rotation of the reference space.
         */
        set rotation(_rotation: Vector3);
        /**
         * Adds a Vector3 in Position of the reference space.
         */
        translate(_by: Vector3): void;
        /**
         * Adds a Vector3 in Rotation of the reference space.
         */
        rotate(_by: Vector3): void;
        private getMtxLocalFromCmpTransform;
    }
}
declare namespace FudgeCore {
    const enum EVENT_CONTROL {
        INPUT = "input",
        OUTPUT = "output"
    }
    const enum CONTROL_TYPE {
        /** The output simply follows the scaled and delayed input */
        PROPORTIONAL = 0,
        /** The output value changes over time with a rate given by the scaled and delayed input */
        INTEGRAL = 1,
        /** The output value reacts to changes of the scaled input and drops to 0 with given delay, if input remains constant */
        DIFFERENTIAL = 2
    }
    /**
     * Processes input signals of type number and generates an output signal of the same type using
     * proportional, integral or differential mapping, an amplification factor and a linear dampening/delay
     * ```text
     *         ┌─────────────────────────────────────────────────────────────┐
     *         │   ┌───────┐   ┌─────┐      pass through (Proportional)      │
     * Input → │ → │amplify│ → │delay│ → ⚟ sum up over time (Integral) ⚞ → │ → Output
     *         │   └───────┘   └─────┘      pass change  (Differential)      │
     *         └─────────────────────────────────────────────────────────────┘
     * ```
     */
    class Control extends EventTarget {
        readonly type: CONTROL_TYPE;
        active: boolean;
        name: string;
        protected rateDispatchOutput: number;
        protected valuePrevious: number;
        protected outputBase: number;
        protected outputTarget: number;
        protected outputPrevious: number;
        protected outputTargetPrevious: number;
        protected factor: number;
        protected time: Time;
        protected timeValueDelay: number;
        protected timeOutputTargetSet: number;
        protected idTimer: number;
        constructor(_name: string, _factor?: number, _type?: CONTROL_TYPE, _delay?: number);
        /**
         * Set the time-object to be used when calculating the output in {@link CONTROL_TYPE.INTEGRAL}
         */
        setTimebase(_time: Time): void;
        /**
         * Feed an input value into this control and fire the events {@link EVENT_CONTROL.INPUT} and {@link EVENT_CONTROL.OUTPUT}
         */
        setInput(_input: number): void;
        /**
         * TODO: describe!
         */
        pulse(_input: number): void;
        /**
         * Set the time to take for the internal linear dampening until the final ouput value is reached
         */
        setDelay(_time: number): void;
        /**
         * Set the number of output-events to dispatch per second.
         * At the default of 0, the control output must be polled and will only actively dispatched once each time input occurs and the output changes.
         */
        setRateDispatchOutput(_rateDispatchOutput?: number): void;
        /**
         * Set the factor to multiply the input value given with {@link setInput} with
         */
        setFactor(_factor: number): void;
        /**
         * Get the value from the output of this control
         */
        getOutput(): number;
        /**
         * Calculates the output of this control
         */
        protected calculateOutput(): number;
        /**
         * calculates the output considering the time of the delay
         */
        private getValueDelayed;
        private dispatchOutput;
    }
}
declare namespace FudgeCore {
    /**
     * Handles multiple controls as inputs and creates an output from that.
     * As a subclass of {@link Control}, axis calculates the ouput summing up the inputs and processing the result using its own settings.
     * Dispatches {@link EVENT_CONTROL.OUTPUT} and {@link EVENT_CONTROL.INPUT} when one of the controls dispatches them.
     * ```text
     *           ┌───────────────────────────────────────────┐
     *           │ ┌───────┐                                 │
     *   Input → │ │control│\                                │
     *           │ └───────┘ \                               │
     *           │ ┌───────┐  \┌───┐   ┌─────────────────┐   │
     *   Input → │ │control│---│sum│ → │internal control │ → │ → Output
     *           │ └───────┘  /└───┘   └─────────────────┘   │
     *           │ ┌───────┐ /                               │
     *   Input → │ │control│/                                │
     *           │ └───────┘                                 │
     *           └───────────────────────────────────────────┘
     * ```
     */
    class Axis extends Control {
        private controls;
        private sumPrevious;
        /**
         * Add the control given to the list of controls feeding into this axis
         */
        addControl(_control: Control): void;
        /**
         * Returns the control with the given name
         */
        getControl(_name: string): Control;
        /**
         * Removes the control with the given name
         */
        removeControl(_name: string): void;
        /**
         * Returns the value of this axis after summing up all inputs and processing the sum according to the axis' settings
         */
        getOutput(): number;
        private hndOutputEvent;
        private hndInputEvent;
    }
}
declare namespace FudgeCore {
    /**
     * Collects the keys pressed on the keyboard and stores their status.
     */
    abstract class Keyboard {
        private static keysPressed;
        /**
         * Returns true if one of the given keys is is currently being pressed.
         */
        static isPressedOne(_keys: KEYBOARD_CODE[]): boolean;
        /**
         * Returns true if all of the given keys are currently being pressed
         */
        static isPressedCombo(_keys: KEYBOARD_CODE[]): boolean;
        /**
         * Returns the value given as _active if one or, when _combo is true, all of the given keys are pressed.
         * Returns the value given as _inactive if not.
         */
        static mapToValue<T>(_active: T, _inactive: T, _keys: KEYBOARD_CODE[], _combo?: boolean): T;
        /**
         * Returns a balanced ternary value (either -1, 0 or 1)
         * according to the match of the keys currently being pressed and the lists of keys given
         */
        static mapToTrit(_positive: KEYBOARD_CODE[], _negative: KEYBOARD_CODE[]): number;
        private static initialize;
        private static hndKeyInteraction;
    }
}
declare namespace FudgeCore {
    /**
     * Routing to the alert box
     */
    class DebugAlert extends DebugTarget {
        static delegates: MapDebugFilterToDelegate;
        /**
         * Returns a delegate-function expecting a message to log.
         */
        static createDelegate(_headline: string): Function;
    }
}
declare namespace FudgeCore {
    /**
     * Routing to a HTMLDialogElement
     */
    class DebugDialog extends DebugTarget {
    }
}
declare namespace FudgeCore {
    /**
     * Route to an HTMLTextArea, may be obsolete when using HTMLDialogElement
     */
    class DebugTextArea extends DebugTarget {
        static textArea: HTMLTextAreaElement;
        static autoScroll: boolean;
        static delegates: MapDebugFilterToDelegate;
        private static groups;
        /**
         * Clears the text area and the groups
         */
        static clear(): void;
        /**
         * Begins a new group with the given name
         */
        static group(_name: string): void;
        /**
         * Ends the last group
         */
        static groupEnd(): void;
        /**
         * Returns a delegate-function expecting a message to log.
         */
        static createDelegate(_headline: string): Function;
        private static getIndentation;
        private static print;
    }
}
declare namespace FudgeCore {
    /**
     * The codes sent from a standard english keyboard layout
     */
    enum KEYBOARD_CODE {
        A = "KeyA",
        B = "KeyB",
        C = "KeyC",
        D = "KeyD",
        E = "KeyE",
        F = "KeyF",
        G = "KeyG",
        H = "KeyH",
        I = "KeyI",
        J = "KeyJ",
        K = "KeyK",
        L = "KeyL",
        M = "KeyM",
        N = "KeyN",
        O = "KeyO",
        P = "KeyP",
        Q = "KeyQ",
        R = "KeyR",
        S = "KeyS",
        T = "KeyT",
        U = "KeyU",
        V = "KeyV",
        W = "KeyW",
        X = "KeyX",
        Y = "KeyY",
        Z = "KeyZ",
        ESC = "Escape",
        ZERO = "Digit0",
        ONE = "Digit1",
        TWO = "Digit2",
        THREE = "Digit3",
        FOUR = "Digit4",
        FIVE = "Digit5",
        SIX = "Digit6",
        SEVEN = "Digit7",
        EIGHT = "Digit8",
        NINE = "Digit9",
        MINUS = "Minus",
        EQUAL = "Equal",
        BACKSPACE = "Backspace",
        TABULATOR = "Tab",
        BRACKET_LEFT = "BracketLeft",
        BRACKET_RIGHT = "BracketRight",
        ENTER = "Enter",
        CTRL_LEFT = "ControlLeft",
        SEMICOLON = "Semicolon",
        QUOTE = "Quote",
        BACK_QUOTE = "Backquote",
        SHIFT_LEFT = "ShiftLeft",
        BACKSLASH = "Backslash",
        COMMA = "Comma",
        PERIOD = "Period",
        SLASH = "Slash",
        SHIFT_RIGHT = "ShiftRight",
        NUMPAD_MULTIPLY = "NumpadMultiply",
        ALT_LEFT = "AltLeft",
        SPACE = "Space",
        CAPS_LOCK = "CapsLock",
        F1 = "F1",
        F2 = "F2",
        F3 = "F3",
        F4 = "F4",
        F5 = "F5",
        F6 = "F6",
        F7 = "F7",
        F8 = "F8",
        F9 = "F9",
        F10 = "F10",
        PAUSE = "Pause",
        SCROLL_LOCK = "ScrollLock",
        NUMPAD7 = "Numpad7",
        NUMPAD8 = "Numpad8",
        NUMPAD9 = "Numpad9",
        NUMPAD_SUBTRACT = "NumpadSubtract",
        NUMPAD4 = "Numpad4",
        NUMPAD5 = "Numpad5",
        NUMPAD6 = "Numpad6",
        NUMPAD_ADD = "NumpadAdd",
        NUMPAD1 = "Numpad1",
        NUMPAD2 = "Numpad2",
        NUMPAD3 = "Numpad3",
        NUMPAD0 = "Numpad0",
        NUMPAD_DECIMAL = "NumpadDecimal",
        PRINT_SCREEN = "PrintScreen",
        INTL_BACK_SLASH = "IntlBackSlash",
        F11 = "F11",
        F12 = "F12",
        NUMPAD_EQUAL = "NumpadEqual",
        F13 = "F13",
        F14 = "F14",
        F15 = "F15",
        F16 = "F16",
        F17 = "F17",
        F18 = "F18",
        F19 = "F19",
        F20 = "F20",
        F21 = "F21",
        F22 = "F22",
        F23 = "F23",
        F24 = "F24",
        KANA_MODE = "KanaMode",
        LANG2 = "Lang2",
        LANG1 = "Lang1",
        INTL_RO = "IntlRo",
        CONVERT = "Convert",
        NON_CONVERT = "NonConvert",
        INTL_YEN = "IntlYen",
        NUMPAD_COMMA = "NumpadComma",
        UNDO = "Undo",
        PASTE = "Paste",
        MEDIA_TRACK_PREVIOUS = "MediaTrackPrevious",
        CUT = "Cut",
        COPY = "Copy",
        MEDIA_TRACK_NEXT = "MediaTrackNext",
        NUMPAD_ENTER = "NumpadEnter",
        CTRL_RIGHT = "ControlRight",
        AUDIO_VOLUME_MUTE = "AudioVolumeMute",
        LAUNCH_APP2 = "LaunchApp2",
        MEDIA_PLAY_PAUSE = "MediaPlayPause",
        MEDIA_STOP = "MediaStop",
        EJECT = "Eject",
        AUDIO_VOLUME_DOWN = "AudioVolumeDown",
        VOLUME_DOWN = "VolumeDown",
        AUDIO_VOLUME_UP = "AudioVolumeUp",
        VOLUME_UP = "VolumeUp",
        BROWSER_HOME = "BrowserHome",
        NUMPAD_DIVIDE = "NumpadDivide",
        ALT_RIGHT = "AltRight",
        HELP = "Help",
        NUM_LOCK = "NumLock",
        HOME = "Home",
        ARROW_UP = "ArrowUp",
        ARROW_RIGHT = "ArrowRight",
        ARROW_DOWN = "ArrowDown",
        ARROW_LEFT = "ArrowLeft",
        END = "End",
        PAGE_UP = "PageUp",
        PAGE_DOWN = "PageDown",
        INSERT = "Insert",
        DELETE = "Delete",
        META_LEFT = "Meta_Left",
        OS_LEFT = "OSLeft",
        META_RIGHT = "MetaRight",
        OS_RIGHT = "OSRight",
        CONTEXT_MENU = "ContextMenu",
        POWER = "Power",
        BROWSER_SEARCH = "BrowserSearch",
        BROWSER_FAVORITES = "BrowserFavorites",
        BROWSER_REFRESH = "BrowserRefresh",
        BROWSER_STOP = "BrowserStop",
        BROWSER_FORWARD = "BrowserForward",
        BROWSER_BACK = "BrowserBack",
        LAUNCH_APP1 = "LaunchApp1",
        LAUNCH_MAIL = "LaunchMail",
        LAUNCH_MEDIA_PLAYER = "LaunchMediaPlayer",
        FN = "Fn",//no event fired actually
        AGAIN = "Again",
        PROPS = "Props",
        SELECT = "Select",
        OPEN = "Open",
        FIND = "Find",
        WAKE_UP = "WakeUp",
        NUMPAD_PARENT_LEFT = "NumpadParentLeft",
        NUMPAD_PARENT_RIGHT = "NumpadParentRight",
        SLEEP = "Sleep"
    }
    enum KEYBOARD_CODE_DE {
        Z = "KeyY",
        Y = "KeyZ",
        Ö = "Semicolon",
        Ä = "Quote",
        Ü = "BracketLeft",
        HASH = "Backslash",
        PLUS = "BracketRight",
        ß = "Minus",
        ACUTE = "Equal",
        LESS_THAN = "IntlBackSlash",
        MINUS = "Slash"
    }
}
declare namespace FudgeCore {
    const enum EVENT_TIMER {
        CALL = "\u0192lapse"
    }
    /**
     * An event that represents a call from a {@link Timer}
     */
    class EventTimer {
        type: EVENT_TIMER;
        target: Timer;
        arguments: Object[];
        firstCall: boolean;
        lastCall: boolean;
        count: number;
        constructor(_timer: Timer, ..._arguments: Object[]);
    }
}
declare namespace FudgeCore {
    /**
     * Custom touch events
     */
    enum EVENT_TOUCH {
        /** custom event fired in addition to the standard touchmove, details offset to starting touch */
        MOVE = "touchMove",
        /** custom event fired when the touches haven't moved outside of the tap radius */
        TAP = "touchTap",
        /** custom event fired when the touches have moved outside of the notch radius, details offset and cardinal direction */
        NOTCH = "touchNotch",
        /** custom event fired when the touches haven't moved outside of the tap radius for some time */
        LONG = "touchLong",
        /** custom event fired when two taps were detected in short succession */
        DOUBLE = "touchDouble",
        /** custom event fired when the distance between the only two touches changes beyond a tolerance */
        PINCH = "touchPinch",
        /** custom event not implemented yet */
        ROTATE = "touchRotate"
    }
    /** Details for CustomTouchEvents, use as generic CustomEvent<EventTouchDetail> */
    interface EventTouchDetail {
        position: Vector2;
        touches: TouchList;
        offset?: Vector2;
        movement?: Vector2;
        cardinal?: Vector2;
        pinch?: Vector2;
        pinchDelta?: number;
    }
    /**
     * Dispatches CustomTouchEvents to the EventTarget given with the constructor.
     * When using touch events, make sure to set `touch-action: none` in CSS
     * @author Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class TouchEventDispatcher {
        posStart: Vector2;
        posNotch: Vector2;
        radiusTap: number;
        radiusNotch: number;
        private target;
        private posPrev;
        private moved;
        private timerDouble;
        private timerLong;
        private timeDouble;
        private timeLong;
        private time;
        private pinchDistance;
        private pinchTolerance;
        constructor(_target: EventTarget, _radiusTap?: number, _radiusNotch?: number, _timeDouble?: number, _timerLong?: number);
        /**
         * De-/Activates the dispatch of CustomTouchEvents
         */
        activate(_on: boolean): void;
        private hndEvent;
        private detectPinch;
        private startGesture;
        private calcAveragePosition;
    }
}
declare namespace FudgeCore {
    /**
     * A node managed by {@link Project} that functions as a template for {@link GraphInstance}s
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Resource
     */
    class Graph extends Node implements SerializableResource {
        idResource: string;
        constructor(_name?: string);
        get isSerializableResource(): true;
        get type(): string;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        private hndMutate;
    }
}
declare namespace FudgeCore {
    const GraphGLTF_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Graph;
    /**
     * A {@link Graph} loaded from a glTF-File.
     * @authors Jonas Plotzky, HFU, 2024
     */
    export class GraphGLTF extends GraphGLTF_base {
        load(_url?: RequestInfo, _name?: string): Promise<GraphGLTF>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * An instance of a {@link Graph}.
     * This node keeps a reference to its resource an can thus optimize serialization
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Resource
     */
    class GraphInstance extends Node {
        #private;
        /** id of the resource that instance was created from */
        static count: number;
        /**
         * This constructor alone will not create a reconstruction, but only save the id.
         * To create an instance of the graph, call reset on this or set with a graph as parameter.
         * Prefer Project.createGraphInstance(_graph).
         */
        constructor(_graph?: Graph);
        get idSource(): string;
        /**
         * Recreate this node from the {@link Graph} referenced
         */
        reset(): Promise<void>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        /**
         * Connects this graph instance to the graph referenced.
         */
        connectToGraph(): Promise<void>;
        /**
         * Set this node to be a recreation of the {@link Graph} given
         */
        set(_graph: Graph): Promise<void>;
        /**
         * Retrieve the graph this instances refers to
         */
        get(): Graph;
        /**
         * Source graph mutated, reflect mutation in this instance
         */
        private hndMutationGraph;
        /**
         * This instance mutated, reflect mutation in source graph
         */
        private hndMutationInstance;
        private reflectMutation;
        private isFiltered;
    }
}
declare namespace FudgeCore {
    /**
     * Holds data to feed into a {@link Shader} to describe the surface of {@link Mesh}.
     * {@link Material}s reference {@link Coat} and {@link Shader}.
     */
    class Coat extends Mutable implements Serializable {
        /**
         * Clipping threshold for alpha values, every pixel with alpha < alphaClip will be discarded.
         */
        alphaClip: number;
        /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
        updateRenderData(): void;
        /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
        useRenderData(): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * The simplest {@link Coat} providing just a color
     */
    class CoatColored extends Coat {
        color: Color;
        constructor(_color?: Color);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * A {@link Coat} providing a color and parameters for the phong shading model.
     */
    class CoatRemissive extends CoatColored {
        #private;
        diffuse: number;
        specular: number;
        intensity: number;
        constructor(_color?: Color, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number);
        get metallic(): number;
        set metallic(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
    }
}
declare namespace FudgeCore {
    /**
     * A {@link Coat} providing a texture and additional data for texturing
     */
    class CoatTextured extends CoatColored {
        texture: Texture;
        constructor(_color?: Color, _texture?: Texture);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    /**
     * A {@link Coat} providing a texture and additional data for texturing
     */
    class CoatRemissiveTextured extends CoatTextured {
        #private;
        diffuse: number;
        specular: number;
        intensity: number;
        constructor(_color?: Color, _texture?: Texture, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number);
        get metallic(): number;
        set metallic(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
    }
}
declare namespace FudgeCore {
    /**
     * A {@link Coat} providing a texture and additional data for texturing
     */
    class CoatRemissiveTexturedNormals extends CoatRemissiveTextured {
        normalMap: Texture;
        constructor(_color?: Color, _texture?: Texture, _normalMap?: Texture, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
}
declare namespace FudgeCore {
    const CoatToon_base: (abstract new (...args: any[]) => {
        texToon: Texture;
    }) & typeof CoatRemissive;
    /**
     * A {@link Coat} providing a color and parameters for the toon shading model.
     */
    export class CoatToon extends CoatToon_base {
        constructor(_color?: Color, _texToon?: Texture, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number);
    }
    const CoatToonTextured_base: (abstract new (...args: any[]) => {
        texToon: Texture;
    }) & typeof CoatRemissiveTextured;
    /**
     * A {@link Coat} providing a texture, a color and parameters for the toon shading model.
     */
    export class CoatToonTextured extends CoatToonTextured_base {
        constructor(_color?: Color, _texture?: Texture, _texToon?: Texture, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number);
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Defines a color as values in the range of 0 to 1 for the four channels red, green, blue and alpha (for opacity)
     */
    class Color extends Mutable implements Serializable, Recycable, ArrayConvertible {
        #private;
        static crc2: CanvasRenderingContext2D;
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(_r?: number, _g?: number, _b?: number, _a?: number);
        /**
         * Converts the given HSL values to RGB and returns the result in the given object.
         * @param _hue Hue as an angle in degrees in range [0, 360].
         * @param _saturation Saturation in range [0, 1]
         * @param _lightness Lightness in range [0, 1]
         * @param _out Optional color to store the result in.
         * @returns The RGB values in range [0, 1].
         * @source https://www.w3.org/TR/css-color-4/#hsl-to-rgb
         */
        static hsl2rgb<T extends {
            r: number;
            g: number;
            b: number;
        } = {
            r: number;
            g: number;
            b: number;
        }>(_hue: number, _saturation: number, _lightness: number, _out: T): T;
        /**
         * @param _red Red value  [0, 1]
         * @param _green Green component [0, 1]
         * @param _blue Blue component [0, 1]
         * @param _out Optional color to store the result in.
         * @returns The HSL values. Hue as an angle in degrees in range [0, 360]. Saturation and lightness in range [0, 1].
         * @source https://www.w3.org/TR/css-color-4/#rgb-to-hsl
         */
        static rgb2hsl<T extends {
            h: number;
            s: number;
            l: number;
        } = {
            h: number;
            s: number;
            l: number;
        }>(_red: number, _green: number, _blue: number, _out: T): T;
        /**
         * Returns a new {@link Color} object created from the given css color keyword.
         * Passing an _alpha value will override the alpha value specified in the keyword.
         * Supported color formats are:
         * - named colors (e.g. "red", "blue", "green")
         * - hex colors (e.g. "#f00" "#ff0000", "#ff0000ff")
         * - srgb colors (e.g. "rgb(255 0 0 / 1)", "rgb(255, 0, 0)", "rgba(0, 0, 255, 1))
         * - hsl colors (e.g. "hsl(90deg 100% 50% / 1)", "hsl(90, 100%, 50%)", hsla(90, 100%, 50%, 1))
         *
         * **Note:** If possibile try to avoid invoking this method frequently, as it might cause major garbage collection depending on the keyword and browser.
         * @param _out Optional color to store the result in.
         */
        static CSS(_keyword: string, _alpha?: number, _out?: Color): Color;
        /**
         * Computes and returns the sum of two colors.
         * @param _out Optional color to store the result in.
         */
        static SUM(_clrA: Color, _clrB: Color, _out?: Color): Color;
        /**
         * Computes and returns the sum of two colors.
         * @param _out Optional color to store the result in.
         */
        static DIFFERENCE(_clrA: Color, _clrB: Color, _out?: Color): Color;
        /**
         * Computes and returns the product of two colors.
         * @param _out Optional color to store the result in.
         */
        static PRODUCT(_clrA: Color, _clrB: Color, _out?: Color): Color;
        /**
         * Returns a new color representing the given color scaled by the given scaling factor.
         * @param _out Optional color to store the result in.
         */
        static SCALE(_vector: Color, _scaling: number, _out?: Color): Color;
        get isArrayConvertible(): true;
        /**
         * Creates and returns a clone of this color.
         */
        get clone(): Color;
        /**
         * Copies the color channels of the given color into this color and returns it.
         * @returns A reference to this color.
         */
        copy(_color: Color): Color;
        /**
         * Sets the color channels of this color.
         * @returns A reference to this color.
         */
        set(_r: number, _g: number, _b: number, _a: number): Color;
        recycle(): void;
        /**
         * Returns true if this vector is equal to the given vector within the given tolerance.
         */
        equals(_compare: Color, _tolerance?: number): boolean;
        /**
         * Sets this color from the given css color keyword. Optinally sets the alpha value to the given value.
         * @returns A reference to this color.
         */
        setCSS(_keyword: string, _alpha?: number): Color;
        /**
         * Sets the color channels of this color and clamps them between 0 and 1.
         * @returns A reference to this color.
         */
        setClamped(_r: number, _g: number, _b: number, _a: number): Color;
        /**
         * Sets this color from the given hsl values.
         */
        setHSL(_hue: number, _saturation: number, _lightness: number, _alpha?: number): Color;
        /**
         * Sets this color from the given 8-bit values for the color channels.
         * @returns A reference to this color.
         */
        setBytes(_r: number, _g: number, _b: number, _a: number): Color;
        /**
         * Sets this color from the given hex string color.
         * @returns A reference to this color.
         */
        setHex(_hex: string): Color;
        /**
         * Returns the css color keyword representing this color.
         * @deprecated Use {@link toCSS} instead.
         */
        getCSS(): string;
        /**
         * Returns the hex string representation of this color.
         * @deprecated Use {@link toHex} instead.
         */
        getHex(): string;
        /**
         * Adds the given color to this.
         */
        add(_color: Color): Color;
        /**
         * Adds the given color to this.
         */
        subtract(_color: Color): Color;
        /**
         * Multiplies this with the given color.
         */
        multiply(_color: Color): Color;
        /**
         * Scales this color by the given factor.
         */
        scale(_scaling: number): Color;
        /**
         * Calls a defined callback function on each channel of the color, and returns a new color that contains the results. Similar to {@link Array.map}.
         * @param _out Optional color to store the result in.
         */
        map(_function: (_value: number, _index: number, _channel: "r" | "g" | "b" | "a", _color: Color) => number, _out?: Color): Color;
        /**
         * Calls a defined callback function on each channel of the color and assigns the result to the channel. Similar to {@link Color.map} but mutates this color instead of creating a new one.
         * @returns A reference to this color.
         */
        apply(_function: (_value: number, _index: number, _channel: "r" | "g" | "b" | "a", _color: Color) => number): Color;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        /**
         * Returns a formatted string representation of this color
         */
        toString(): string;
        /**
         * Returns the hex string representation of this color. // TODO: maybe this should return a number instead of a string?
         */
        toHex(): string;
        /**
         * Returns the css color keyword representing this color.
         */
        toCSS(): string;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    const MaterialGLTF_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Material;
    /**
     * A {@link Material} loaded from a glTF-File.
     * @authors Jonas Plotzky, HFU, 2024
     */
    export class MaterialGLTF extends MaterialGLTF_base {
        load(_url?: RequestInfo, _name?: string): Promise<MaterialGLTF>;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Abstract class supporting various arithmetical helper functions
     */
    abstract class Calc {
        /** factor multiplied with angle in degrees yields the angle in radian */
        static readonly deg2rad: number;
        /** factor multiplied with angle in radian yields the angle in degrees */
        static readonly rad2deg: number;
        /**
         * Returns one of the values passed in, either _value if within _min and _max or the boundary being exceeded by _value.
         */
        static clamp<T>(_value: T, _min: T, _max: T, _isSmaller?: (_value1: T, _value2: T) => boolean): T;
        /**
         * Returns the linear interpolation between two values. When t is 0 the result is a, when t is 1 the result is b. Clamps t between 0 and 1.
         */
        static lerp(_a: number, _b: number, _t: number): number;
        /**
         * Rounds the given value to the nearest multiple of the given increment using the given rounding function.
         * Default rounding function is {@link Math.round}, use {@link Math.floor} or {@link Math.ceil} to round down or up.
         */
        static snap(_value: number, _increment: number, _round?: (_value: number) => number): number;
        private static isSmaller;
    }
}
declare namespace FudgeCore {
    interface Border {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
    /**
     * Framing describes how to map a rectangle into a given frame
     * and how points in the frame correspond to points in the resulting rectangle and vice versa
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Framing
     */
    abstract class Framing extends Mutable {
        protected reduceMutator(_mutator: Mutator): void;
        /**
         * Maps a point in the given frame according to this framing
         * @param _pointInFrame The point in the frame given
         * @param _rectFrame The frame the point is relative to
         */
        abstract getPoint(_pointInFrame: Vector2, _rectFrame: Rectangle): Vector2;
        /**
         * Maps a point in a given rectangle back to a calculated frame of origin
         * @param _point The point in the rectangle
         * @param _rect The rectangle the point is relative to
         */
        abstract getPointInverse(_point: Vector2, _rect: Rectangle): Vector2;
        /**
         * Takes a rectangle as the frame and creates a new rectangle according to the framing
         * @param _rectFrame
         * @param _rectOut Optional rectangle to store the result in.
         */
        abstract getRect(_rectFrame: Rectangle, _rectOut?: Rectangle): Rectangle;
    }
    /**
     * The resulting rectangle has a fixed width and height and display should scale to fit the frame
     * Points are scaled in the same ratio
     */
    class FramingFixed extends Framing {
        width: number;
        height: number;
        constructor(_width?: number, _height?: number);
        /**
         * Sets this framing to the given width and height
         */
        setSize(_width: number, _height: number): void;
        getPoint(_pointInFrame: Vector2, _rectFrame: Rectangle): Vector2;
        getPointInverse(_point: Vector2, _rect: Rectangle): Vector2;
        getRect(_rectFrame: Rectangle, _rectOut?: Rectangle): Rectangle;
    }
    /**
     * Width and height of the resulting rectangle are fractions of those of the frame, scaled by normed values normWidth and normHeight.
     * Display should scale to fit the frame and points are scaled in the same ratio
     */
    class FramingScaled extends Framing {
        normWidth: number;
        normHeight: number;
        /**
         * Sets this framing to the given normed width and height
         */
        setScale(_normWidth: number, _normHeight: number): void;
        getPoint(_pointInFrame: Vector2, _rectFrame: Rectangle): Vector2;
        getPointInverse(_point: Vector2, _rect: Rectangle): Vector2;
        getRect(_rectFrame: Rectangle, _rectOut?: Rectangle): Rectangle;
    }
    /**
     * The resulting rectangle fits into a margin given as fractions of the size of the frame given by normAnchor
     * plus an absolute padding given by pixelBorder. Display should fit into this.
     */
    class FramingComplex extends Framing {
        margin: Border;
        padding: Border;
        getPoint(_pointInFrame: Vector2, _rectFrame: Rectangle): Vector2;
        getPointInverse(_point: Vector2, _rect: Rectangle): Vector2;
        getRect(_rectFrame: Rectangle, _rectOut?: Rectangle): Rectangle;
        getMutator(): Mutator;
    }
}
declare namespace FudgeCore {
    /**
     * Representation of a vector2 as polar coordinates
     * ```text
     *  ↕- angle (Angle to the x-axis)
     *  -→ Magnitude (Distance from the center)
     * ```
     */
    class Geo2 implements Recycable {
        magnitude: number;
        angle: number;
        constructor(_angle?: number, _magnitude?: number);
        /**
         * Set the properties of this instance at once
         */
        set(_angle?: number, _magnitude?: number): Geo2;
        recycle(): void;
        /**
         * Returns a pretty string representation
         */
        toString(): string;
    }
}
declare namespace FudgeCore {
    /**
     * Representation of a vector3 as geographic coordinates as seen on a globe
     * ```text
     * ←|→ Longitude (Angle to the z-axis)
     *  ↕- Latitude (Angle to the equator)
     *  -→ Magnitude (Distance from the center)
     * ```
     */
    class Geo3 implements Recycable {
        magnitude: number;
        latitude: number;
        longitude: number;
        constructor(_longitude?: number, _latitude?: number, _magnitude?: number);
        /**
         * Set the properties of this instance at once
         */
        set(_longitude?: number, _latitude?: number, _magnitude?: number): Geo3;
        recycle(): void;
        /**
         * Returns a pretty string representation
         */
        toString(): string;
    }
}
declare namespace FudgeCore {
    function Mash(): Function;
    function LFIB4(): Function;
}
declare namespace FudgeCore {
    /**
     * Simple class for 3x3 matrix operations
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020 | Jonas Plotzky, HFU, 2025
     */
    class Matrix3x3 extends Mutable implements Serializable, Recycable, ArrayConvertible {
        #private;
        private data;
        private mutator;
        constructor();
        /** TODO: describe! */
        static PROJECTION(_width: number, _height: number, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Retrieve a new identity matrix.
         */
        static IDENTITY(): Matrix3x3;
        /**
         * Composes a new matrix according to the given translation, rotation and scaling.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static COMPOSITION(_translation?: Vector2, _rotation?: number, _scaling?: Vector2, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Returns a matrix that translates coordinates along the x- and y-axis according to the given {@link Vector2}.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static TRANSLATION(_translate: Vector2, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
         * @param _angleInDegrees The value of the rotation.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION(_angleInDegrees: number, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Returns a matrix that scales coordinates along the x- and y-axis according to the given {@link Vector2}.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static SCALING(_scalar: Vector2, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Computes and returns the product of two passed matrices.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static PRODUCT(_mtxLeft: Matrix3x3, _mtxRight: Matrix3x3, _mtxOut?: Matrix3x3): Matrix3x3;
        /**
         * Computes and returns the inverse of a passed matrix.
         * @param _mtx The matrix to compute the inverse of.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static INVERSE(_mtx: Matrix3x3, _mtxOut?: Matrix3x3): Matrix3x3;
        get isArrayConvertible(): true;
        /**
         * - get: return a vector representation of the translation {@link Vector2}.
         * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: effect the matrix ignoring its rotation and scaling
         */
        get translation(): Vector2;
        set translation(_translation: Vector2);
        /**
         * - get: a copy of the calculated rotation {@link Vector2}
         * - set: effect the matrix
         */
        get rotation(): number;
        set rotation(_rotation: number);
        /**
         * - get: return a vector representation of the scale {@link Vector3}.
         * **Caution!** Do not manipulate result, instead create a clone!
         * - set: effect the matrix
         */
        get scaling(): Vector2;
        set scaling(_scaling: Vector2);
        /**
         * Creates and returns a clone of this matrix.
         */
        get clone(): Matrix3x3;
        /**
         * Resets the matrix to the identity-matrix and clears cache. Used by the recycler to reset.
         */
        recycle(): void;
        /**
         * Resets the matrix to the identity-matrix and clears cache.
         */
        reset(): void;
        /**
         * Adds a translation by the given {@link Vector2} to this matrix.
         * @returns A reference to this matrix.
         */
        translate(_by: Vector2): Matrix3x3;
        /**
         * Adds a translation along the x-axis to this matrix.
         * @returns A reference to this matrix.
         */
        translateX(_by: number): Matrix3x3;
        /**
         * Adds a translation along the y-axis to this matrix.
         * @returns A reference to this matrix.
         */
        translateY(_by: number): Matrix3x3;
        /**
         * Adds a rotation around the z-Axis to this matrix
         * @returns A reference to this matrix.
         */
        rotate(_angleInDegrees: number): Matrix3x3;
        /**
         * Adds a scaling by the given {@link Vector2} to this matrix.
         * @returns A reference to this matrix.
         */
        scale(_by: Vector2): Matrix3x3;
        /**
         * Adds a scaling along the x-Axis to this matrix.
         * @returns A reference to this matrix.
         */
        scaleX(_by: number): Matrix3x3;
        /**
         * Adds a scaling along the y-Axis to this matrix.
         * @returns A reference to this matrix.
         */
        scaleY(_by: number): Matrix3x3;
        /**
         * Multiply this matrix with the given matrix.
         * @returns A reference to this matrix.
         */
        multiply(_mtxRight: Matrix3x3): Matrix3x3;
        /**
         * Premultiply this matrix with the given matrix.
         * @returns A reference to this matrix.
         */
        premultiply(_mtxLeft: Matrix3x3): Matrix3x3;
        /**
         * (Re-)Compose this matrix from the given translation, rotation and scaling.
         * Missing values will be decompsed from the current matrix state if necessary.
         * @returns A reference to this matrix.
         */
        compose(_translation?: Partial<Vector2>, _rotation?: number, _scaling?: Partial<Vector2>): Matrix3x3;
        /**
         * Sets the elements of this matrix to the given values.
         * @returns A reference to this matrix.
         */
        set(_m00: number, _m01: number, _m02: number, _m10: number, _m11: number, _m12: number, _m20: number, _m21: number, _m22: number): Matrix3x3;
        /**
         * Copies the elements of the given matrix into this matrix.
         * @returns A reference to this matrix.
         */
        copy(_original: Matrix3x3): Matrix3x3;
        /**
         * Returns a formatted string representation of this matrix
         */
        toString(): string;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        /**
         * Returns the array of the elements of this matrix.
         * @returns A readonly view of the internal array.
         */
        getArray(): ArrayLike<number> & Iterable<number> & ArrayBufferView;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator): void;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        protected reduceMutator(_mutator: Mutator): void;
        private resetCache;
    }
}
declare namespace FudgeCore {
    /**
     * Stores a 4x4 transformation matrix and provides operations for it.
     * ```text
     * [ 0, 1, 2, 3 ] ← row vector x
     * [ 4, 5, 6, 7 ] ← row vector y
     * [ 8, 9,10,11 ] ← row vector z
     * [12,13,14,15 ] ← translation
     *            ↑  homogeneous column
     * ```
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2023-2025
     */
    class Matrix4x4 extends Mutable implements Serializable, Recycable, ArrayConvertible {
        #private;
        private data;
        private mutator;
        constructor(_data?: Float32Array);
        /**
         * Retrieve a new identity matrix
         */
        static IDENTITY(): Matrix4x4;
        /**
         * Composes a new matrix according to the given translation, rotation and scaling.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static COMPOSITION(_translation?: Vector3, _rotation?: Vector3 | Quaternion, _scaling?: Vector3, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Multiplies two matrices.
         * @param _a - the first operand.
         * @param _b - the second operand.
         * @param _out - (optional) the receiving matrix.
         * @returns `_out` or a new matrix if none is provided.
         * @source https://github.com/toji/gl-matrix
         */
        static PRODUCT(_a: Matrix4x4, _b: Matrix4x4, _out?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns the transpose of a passed matrix.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static TRANSPOSE(_mtx: Matrix4x4, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns the inverse of a passed matrix.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static INVERSE(_mtx: Matrix4x4, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns a matrix with the given translation, its z-axis pointing directly at the given target,
         * and a minimal angle between its y-axis and the given up-{@link Vector3}, respetively calculating yaw and pitch.
         * The pitch may be restricted to the up-vector to only calculate yaw. Optionally pass a desired scaling.
         * @param _up A unit vector indicating the up-direction.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static LOOK_AT(_translation: Vector3, _target: Vector3, _up?: Vector3, _restrict?: boolean, _scaling?: Vector3, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns a matrix with its z-axis pointing directly in the given forward direction,
         * and a minimal angle between its y-axis and the given up direction. The pitch may be restricted to the up-vector to only calculate yaw.
         * Optionally pass a desired translation and/or scaling.
         * @param _forward A unit vector indicating the desired forward-direction.
         * @param _up A unit vector indicating the up-direction.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static LOOK_IN(_forward: Vector3, _up?: Vector3, _restrict?: boolean, _translation?: Vector3, _scaling?: Vector3, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that translates coordinates along the x-, y- and z-axis according to the given {@link Vector3}.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static TRANSLATION(_translate: Vector3, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that rotates coordinates on the x-axis when multiplied by.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION_X(_angleInDegrees: number, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that rotates coordinates on the y-axis when multiplied by.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION_Y(_angleInDegrees: number, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION_Z(_angleInDegrees: number, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that rotates coordinates when multiplied by, using the rotation euler angles or unit quaternion given.
         * Rotation occurs around the axis in the order Z-Y-X.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION(_rotation: Vector3 | Quaternion, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that rotates coordinates around an arbitrary axis when multiplied by.
         * @param _axis The axis to rotate around as a unit vector.
         * @param _angle The angle in degrees.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static ROTATION_AXIS_ANGLE(_axis: Vector3, _angle: number, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a matrix that scales coordinates along the x-, y- and z-axis according to the given {@link Vector3}.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static SCALING(_scalar: Vector3, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Returns a representation of the given matrix relative to the given base.
         * If known, pass the inverse of the base to avoid unneccesary calculation.
         * @param _mtxOut Optional matrix to store the result in.
         */
        static RELATIVE(_mtx: Matrix4x4, _mtxBase: Matrix4x4, _mtxInverse?: Matrix4x4, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns a matrix that applies perspective to an object, if its transform is multiplied by it.
         * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
         * @param _fieldOfViewInDegrees The field of view in Degrees. (Default = 45)
         * @param _near The near clipspace border on the z-axis.
         * @param _far The far clipspace border on the z-axis.
         * @param _direction The plane on which the fieldOfView-Angle is given
         * @param _mtxOut Optional matrix to store the result in.
         */
        static PROJECTION_CENTRAL(_aspect: number, _fieldOfViewInDegrees: number, _near: number, _far: number, _direction: FIELD_OF_VIEW, _mtxOut?: Matrix4x4): Matrix4x4;
        /**
         * Computes and returns a matrix that applies orthographic projection to an object, if its transform is multiplied by it.
         * @param _left The positionvalue of the projectionspace's left border.
         * @param _right The positionvalue of the projectionspace's right border.
         * @param _bottom The positionvalue of the projectionspace's bottom border.
         * @param _top The positionvalue of the projectionspace's top border.
         * @param _near The positionvalue of the projectionspace's near border.
         * @param _far The positionvalue of the projectionspace's far border
         * @param _mtxOut Optional matrix to store the result in.
         */
        static PROJECTION_ORTHOGRAPHIC(_left: number, _right: number, _bottom: number, _top: number, _near?: number, _far?: number, _mtxOut?: Matrix4x4): Matrix4x4;
        get isArrayConvertible(): true;
        /**
         * - get: return a vector representation of the translation {@link Vector3}.
         * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: effect the matrix ignoring its rotation and scaling
         */
        get translation(): Vector3;
        set translation(_translation: Vector3);
        /**
         * - get: return a vector representation of the rotation {@link Vector3}.
         * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: effect the matrix
         */
        get rotation(): Vector3;
        set rotation(_rotation: Quaternion | Vector3);
        /**
         * - get: return a vector representation of the scaling {@link Vector3}.
         * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: effect the matrix
         */
        get scaling(): Vector3;
        set scaling(_scaling: Vector3);
        /**
         * - get: return a unit quaternion representing the rotation of this matrix.
         * **Caution!** Use immediately and readonly, since the quaternion is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: effect the matrix
         */
        get quaternion(): Quaternion;
        set quaternion(_quaternion: Quaternion);
        /**
         * Returns the determinant of this matrix. Computational heavy operation, not cached so use with care.
         * @deprecated Use {@link Matrix4x4.getDeterminant} instead.
         */
        get determinant(): number;
        /**
         * Returns the normalized cardinal x-axis.
         * @deprecated use {@link getRight} instead.
         */
        get right(): Vector3;
        /**
         * Returns the normalized cardinal y-axis.
         * @deprecated use {@link getUp} instead.
         */
        get up(): Vector3;
        /**
         * Returns the normalized cardinal z-axis.
         * @deprecated use {@link getForward} instead.
         */
        get forward(): Vector3;
        /**
         * Creates and returns a clone of this matrix.
         */
        get clone(): Matrix4x4;
        /**
         * Resets the matrix to the identity-matrix and clears cache. Used by the recycler to reset.
         */
        recycle(): void;
        /**
         * Resets the matrix to the identity-matrix and clears cache.
         * @returns A reference to this matrix.
         */
        reset(): Matrix4x4;
        /**
         * Transpose this matrix.
         * @returns A reference to this matrix.
         */
        transpose(): Matrix4x4;
        /**
         * Invert this matrix.
         * @returns A reference to this matrix.
         */
        invert(): Matrix4x4;
        /**
         * Adds a translation by the given {@link Vector3} to this matrix.
         * If _local is true, the translation occurs according to the current rotation and scaling of this matrix,
         * otherwise, it occurs according to the parent.
         * @returns A reference to this matrix.
         */
        translate(_by: Vector3, _local?: boolean): Matrix4x4;
        /**
         * Adds a translation along the x-axis to this matrix.
         * @returns A reference to this matrix.
         */
        translateX(_x: number, _local?: boolean): Matrix4x4;
        /**
         * Adds a translation along the y-axis to this matrix.
         * @returns A reference to this matrix.
         */
        translateY(_y: number, _local?: boolean): Matrix4x4;
        /**
         * Adds a translation along the z-axis to this matrix.
         * @returns A reference to this matrix.
         */
        translateZ(_z: number, _local?: boolean): Matrix4x4;
        /**
         * Rotates this matrix by given {@link Vector3} in the order Z, Y, X. Right hand rotation is used, thumb points in axis direction, fingers curling indicate rotation
         * The rotation is appended to already applied transforms, thus multiplied from the right. Set _fromLeft to true to switch and put it in front.
         * @returns A reference to this matrix.
         */
        rotate(_by: Vector3 | Quaternion, _fromLeft?: boolean): Matrix4x4;
        /**
         * Adds a rotation around the x-axis to this matrix.
         * @returns A reference to this matrix.
         */
        rotateX(_angleInDegrees: number, _fromLeft?: boolean): Matrix4x4;
        /**
         * Adds a rotation around the y-axis to this matrix.
         * @returns A reference to this matrix.
         */
        rotateY(_angleInDegrees: number, _fromLeft?: boolean): Matrix4x4;
        /**
         * Adds a rotation around the z-axis to this matrix.
         * @returns A reference to this matrix.
         */
        rotateZ(_angleInDegrees: number, _fromLeft?: boolean): Matrix4x4;
        /**
         * Adjusts the rotation of this matrix to point the z-axis directly at the given target and tilts it to accord with the given up-{@link Vector3},
         * respectively calculating yaw and pitch. If no up-{@link Vector3} is given, the previous up-{@link Vector3} is used.
         * The pitch may be restricted to the up-vector to only calculate yaw.
         * @param _up A unit vector indicating the up-direction.
         * @returns A reference to this matrix.
         */ lookAt(_target: Vector3, _up?: Vector3, _restrict?: boolean): Matrix4x4;
        /**
         * Adjusts the rotation of this matrix to align the z-axis with the given forward-direction and tilts it to accord with the given up-{@link Vector3}.
         * If no up-vector is provided, the local {@link Matrix4x4.getUp} is used.
         * The pitch may be restricted to the up-vector to only calculate yaw.
         * @param _forward A unit vector indicating the desired forward-direction.
         * @param _up A unit vector indicating the up-direction.
         * @returns A reference to this matrix.
         */ lookIn(_forward: Vector3, _up?: Vector3, _restrict?: boolean): Matrix4x4;
        /**
         * Same as {@link Matrix4x4.lookAt}, but optimized and needs testing
         */
        /**
         * Adds a scaling by the given {@link Vector3} to this matrix.
         * @returns A reference to this matrix.
         */
        scale(_by: Vector3, _fromLeft?: boolean): Matrix4x4;
        /**
         * Adds a scaling along the x-axis to this matrix.
         * @returns A reference to this matrix.
         */
        scaleX(_by: number): Matrix4x4;
        /**
         * Adds a scaling along the y-axis to this matrix.
         * @returns A reference to this matrix.
         */
        scaleY(_by: number): Matrix4x4;
        /**
         * Adds a scaling along the z-axis to this matrix.
         * @returns A reference to this matrix.
         */
        scaleZ(_by: number): Matrix4x4;
        /**
         * Multiply this matrix by the given matrix.
         * @returns A reference to this matrix.
         */
        multiply(_matrix: Matrix4x4, _fromLeft?: boolean): Matrix4x4;
        /**
         * Premultiply this matrix with the given matrix.
         * @returns A reference to this matrix.
         */
        premultiply(_mtxLeft: Matrix4x4): Matrix4x4;
        /**
         * (Re-)Compose this matrix from the given translation, rotation and scaling.
         * Missing values will be decompsed from the current matrix state if necessary.
         * @returns A reference to this matrix.
         */
        compose(_translation?: Partial<Vector3>, _rotation?: Partial<Vector3> | Partial<Quaternion>, _scaling?: Partial<Vector3>): Matrix4x4;
        animate(_mutator: {
            translation?: Float32Array;
            rotation?: Float32Array;
            quaternion?: Float32Array;
            scaling?: Float32Array;
        }): Matrix4x4;
        /**
         * Sets the elements of this matrix to the given values.
         * @returns A reference to this matrix.
         */
        set(_m00: number, _m01: number, _m02: number, _m03: number, _m10: number, _m11: number, _m12: number, _m13: number, _m20: number, _m21: number, _m22: number, _m23: number, _m30: number, _m31: number, _m32: number, _m33: number): Matrix4x4;
        /**
         * Copies the state of the given matrix into this matrix.
         * @returns A reference to this matrix.
         */
        copy(_original: Matrix4x4): Matrix4x4;
        /**
         * Returns a formatted string representation of this matrix
         */
        toString(): string;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        /**
         * Returns the array of the elements of this matrix.
         * @returns A readonly view of the internal array.
         */
        getArray(): ArrayLike<number> & Iterable<number> & ArrayBufferView;
        /**
          * Returns the determinant of this matrix.
          */
        getDeterminant(): number;
        /**
         * Return cardinal x-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getX(_vctOut?: Vector3): Vector3;
        /**
         * Return cardinal y-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getY(_vctOut?: Vector3): Vector3;
        /**
         * Return cardinal z-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getZ(_vctOut?: Vector3): Vector3;
        /**
         * Returns the normalized cardinal x-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getRight(_vctOut?: Vector3): Vector3;
        /**
         * Returns the normalized cardinal y-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getUp(_vctOut?: Vector3): Vector3;
        /**
         * Returns the normalized cardinal z-axis.
         * @param _vctOut Optional vector to store the result in.
         */
        getForward(_vctOut?: Vector3): Vector3;
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapXY(): void;
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapXZ(): void;
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapYZ(): void;
        /**
         * Returns the tranlation from this matrix to the target matrix.
         * @param _vctOut Optional vector to store the result in.
         */
        getTranslationTo(_mtxTarget: Matrix4x4, _vctOut?: Vector3): Vector3;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator): void;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        protected reduceMutator(_mutator: Mutator): void;
        private resetCache;
    }
}
declare namespace FudgeCore {
    /**
     * Baseclass for Noise2, Noise3 and Noise4
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021
     * This is an adaption of https://www.npmjs.com/package/fast-simplex-noise
     */
    abstract class Noise {
        protected perm: Uint8Array;
        protected permMod12: Uint8Array;
        /**
         * Returns a random value between -1 and 1 based on the given position
         */
        abstract sample: (..._args: number[]) => number;
        constructor(_random?: Function);
    }
}
declare namespace FudgeCore {
    /**
     * This is an adaption of https://www.npmjs.com/package/fast-simplex-noise
     * done by Jirka Dell'Oro-Friedl, HFU, 2021
     *
     * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
     * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
     * Better rank ordering method by Stefan Gustavson in 2012.
     *
     * This code was placed in the public domain by its original author,
     * Stefan Gustavson. You may use it as you see fit, but
     * attribution is appreciated.
     */
    class Noise2 extends Noise {
        #private;
        private static offset;
        private static gradient;
        constructor(_random?: Function);
        sample: (_x: number, _y: number) => number;
    }
}
declare namespace FudgeCore {
    /**
     * This is an adaption of https://www.npmjs.com/package/fast-simplex-noise
     * done by Jirka Dell'Oro-Friedl, HFU, 2021
     *
     * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
     * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
     * Better rank ordering method by Stefan Gustavson in 2012.
     *
     * This code was placed in the public domain by its original author,
     * Stefan Gustavson. You may use it as you see fit, but
     * attribution is appreciated.
     */
    class Noise3 extends Noise {
        #private;
        private static offset;
        private static gradient;
        constructor(_random?: Function);
        sample: (_x: number, _y: number, _z: number) => number;
    }
}
declare namespace FudgeCore {
    /**
     * This is an adaption of https://www.npmjs.com/package/fast-simplex-noise
     * done by Jirka Dell'Oro-Friedl, HFU, 2021
     *
     * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
     * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
     * Better rank ordering method by Stefan Gustavson in 2012.
     *
     * This code was placed in the public domain by its original author,
     * Stefan Gustavson. You may use it as you see fit, but
     * attribution is appreciated.
     */
    class Noise4 extends Noise {
        #private;
        private static offset;
        private static gradient;
        constructor(_random?: Function);
        sample: (_x: number, _y: number, _z: number, _w: number) => number;
    }
}
declare namespace FudgeCore {
    interface QuaternionLike {
        x: number;
        y: number;
        z: number;
        w: number;
    }
    /**
      * Storing and manipulating rotations in the form of quaternions.
      * Constructed out of the 4 components: (x, y, z, w). Mathematical notation: w + xi + yj + zk.
      * A Quaternion can be described with an axis and angle: (x, y, z) = sin(angle/2)*axis; w = cos(angle/2).
      * roll: x, pitch: y, yaw: z. Note that operations are adapted to work with vectors where y is up and z is forward.
      * @authors Matthias Roming, HFU, 2023 | Marko Fehrenbach, HFU, 2020 | Jonas Plotzky, HFU, 2023
      */
    class Quaternion extends Mutable implements Serializable, Recycable, ArrayConvertible {
        #private;
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        /**
         * Retrieve a new identity quaternion
         */
        static IDENTITY(): Quaternion;
        /**
         * Normalize a quaternion making it a valid rotation representation.
         * @param _q - quaternion to normalize
         * @param _out - (optional) the receiving quaternion.
         * @returns `_out` or a new quaternion if none is provided.
         */
        static NORMALIZATION(_q: Readonly<Quaternion>, _out?: Quaternion): Quaternion;
        static NORMALIZATION<T extends QuaternionLike>(_q: Readonly<T>, _out: T): T;
        /**
         * Returns a quaternion that rotates coordinates when multiplied by, using the angles given.
         * Rotation occurs around the axis in the order Z-Y-X.
         * @param _out Optional quaternion to store the result in.
         */
        static ROTATION_EULER_ANGLES(_eulerAngles: Vector3, _out?: Quaternion): Quaternion;
        /**
         * Returns a quaternion that rotates coordinates when multiplied by, using the axis and angle given.
         * Axis must be normalized. Angle is in degrees.
         * @param _out Optional quaternion to store the result in.
         */
        static ROTATION_AXIS_ANGLE(_axis: Vector3, _angle: number, _out?: Quaternion): Quaternion;
        /**
         * Returns a quaternion with the given forward and up direction.
         * @param _forward A unit vector indicating the desired forward-direction.
         * @param _up A unit vector indicating the up-direction.
         * @param _out Optional quaternion to store the result in.
         */
        static ROTATION_LOOK_IN(_forward: Vector3, _up: Vector3, _out?: Quaternion): Quaternion;
        /**
         * Returns a quaternion that will rotate one vector to align with another.
         * @param _from The normalized direction vector to rotate from.
         * @param _to The normalized direction vector to rotate to.
         * @param _out Optional quaternion to store the result in.
         */
        static ROTATION_FROM_TO(_from: Vector3, _to: Vector3, _out?: Quaternion): Quaternion;
        /**
         * Returns a quaternion that rotates coordinates when multiplied by, using the angles given.
         * Rotation occurs around the axis in the order Z-Y-X.
         * @deprecated Use {@link ROTATION_EULER_ANGLES} instead.
         */
        static ROTATION(_eulerAngles: Vector3): Quaternion;
        /**
         * Returns a quaternion that rotates coordinates when multiplied by, using the axis and angle given.
         * Axis must be normalized. Angle is in degrees.
         * @deprecated Use {@link ROTATION_AXIS_ANGLE} instead.
         */
        static ROTATION(_axis: Vector3, _angle: number): Quaternion;
        /**
         * Returns a quaternion that rotates coordinates when multiplied by, using the forward and up direction given.
         * @deprecated Use {@link ROTATION_LOOK_IN} instead.
         */
        static ROTATION(_forward: Vector3, _up: Vector3): Quaternion;
        /**
         * Computes and returns the product of two passed quaternions.
         * @param _out Optional quaternion to store the result in.
         */
        static PRODUCT(_left: Quaternion, _right: Quaternion, _out?: Quaternion): Quaternion;
        /**
         * Computes and returns the inverse of a passed quaternion.
         * Quaternion is assumed to be normalized.
         * @param _out Optional quaternion to store the result in.
         */
        static INVERSE(_quaternion: Quaternion, _out?: Quaternion): Quaternion;
        /**
         * Computes and returns the conjugate of a passed quaternion.
         * @param _out Optional quaternion to store the result in.
         */
        static CONJUGATE(_quaternion: Quaternion, _out?: Quaternion): Quaternion;
        /**
         * Returns the dot product of two quaternions.
         */
        static DOT(_a: Quaternion, _b: Quaternion): number;
        /**
         * Performs a linear interpolation between two quaternions. Result should be normalized afterwards to represent a valid rotation.
         * @param _a - the first operand.
         * @param _b - the second operand.
         * @param _t - interpolation amount, in the range [0-1], between the two inputs.
         * @param _out - (optional) the receiving quaternion.
         * @returns `_out` or a new quaternion if none is provided.
         * @source https://github.com/toji/gl-matrix
         */
        static LERP(_a: Readonly<Quaternion>, _b: Readonly<Quaternion>, _t: number, _out?: Quaternion): Quaternion;
        static LERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
        /**
         * Performs a spherical linear interpolation between two quaternions.
         * @param _a - the first operand.
         * @param _b - the second operand.
         * @param _t - interpolation amount, in the range [0-1], between the two inputs.
         * @param _out - (optional) the receiving quaternion.
         * @returns `_out` or a new quaternion if none is provided.
         * @source https://github.com/toji/gl-matrix
         */
        static SLERP(_a: Readonly<Quaternion>, _b: Readonly<Quaternion>, _t: number, _out?: Quaternion): Quaternion;
        static SLERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
        /**
         * Return the angle in degrees between the two given quaternions.
         */
        static ANGLE(_from: Quaternion, _to: Quaternion): number;
        /**
         * Performs a spherical linear interpolation between two quaternion arrays.
         * @param _a - the first operand.
         * @param _aOffset - the offset into the first operand.
         * @param _b - the second operand.
         * @param _bOffset - the offset into the second operand.
         * @param _t - interpolation amount, in the range [0-1], between the two inputs.
         * @param _out - the receiving quaternion array.
         * @param _outOffset - the offset into the receiving quaternion array.
         * @returns `out`
         * @source https://github.com/toji/gl-matrix
         */
        static SLERP_ARRAY<T extends {
            [n: number]: number;
        }>(_a: Readonly<T>, _aOffset: number, _b: Readonly<T>, _bOffset: number, _t: number, _out: T, _outOffset: number): T;
        /**
         * Normalize a quaternion array.
         * @param _a - quaternion array to normalize.
         * @param _aOffset - the offset into the quaternion array.
         * @param _out - the receiving quaternion array.
         * @param _outOffset - the offset into the receiving quaternion array.
         * @returns `out`
         * @source https://github.com/toji/gl-matrix
         */
        static NORMALIZE_ARRAY<T extends {
            [n: number]: number;
        }>(_a: Readonly<T>, _aOffset: number, _out: T, _outOffset: number): T;
        /**
         * Negates the given quaternion.
         */
        static negate(_q: Quaternion): void;
        get isArrayConvertible(): true;
        /**
         * Creates and returns a clone of this quaternion.
         */
        get clone(): Quaternion;
        /**
         * - get: return the euler angle representation of the rotation in degrees.
         * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate.
         * - set: set the euler angle representation of the rotation in degrees.
         */
        get eulerAngles(): Vector3;
        set eulerAngles(_eulerAngles: Vector3);
        /**
         * Copies the given quaternion.
         * @returns A reference to this quaternion.
         */
        copy(_original: Quaternion): Quaternion;
        /**
         * Resets the quaternion to the identity-quaternion and clears cache. Used by the recycler to reset.
         */
        recycle(): void;
        /**
         * Sets the components of this quaternion.
         * @returns A reference to this quaternion.
         */
        set(_x: number, _y: number, _z: number, _w: number): Quaternion;
        /**
         * Returns true if this quaternion is equal to the given quaternion within the given tolerance.
         */
        equals(_compare: Quaternion, _tolerance?: number): boolean;
        /**
         * Normalizes this quaternion to a length of 1 (a unit quaternion) making it a valid rotation representation.
         * @returns A reference to this quaternion.
         */
        normalize(): Quaternion;
        /**
         * Negates this quaternion.
         * @returns A reference to this quaternion.
         */
        negate(): Quaternion;
        /**
         * Invert this quaternion.
         * Quaternion is assumed to be normalized.
         * @returns A reference to this quaternion.
         */
        invert(): Quaternion;
        /**
         * Conjugates this quaternion and returns it.
         * @returns A reference to this quaternion.
         */
        conjugate(): Quaternion;
        /**
         * Multiply this quaternion with the given quaternion.
         * @returns A reference to this quaternion.
         */
        multiply(_quaternion: Quaternion, _fromLeft?: boolean): Quaternion;
        /**
         * Premultiply this quaternion with the given quaternion.
         * @returns A reference to this quaternion.
         */
        premultiply(_quaternion: Quaternion): Quaternion;
        /**
         * Returns a formatted string representation of this quaternion
         */
        toString(): string;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Quaternion>;
        mutate(_mutator: Mutator): void;
        protected reduceMutator(_mutator: Mutator): void;
        private resetCache;
    }
}
declare namespace FudgeCore {
    /**
     * Class for creating random values, supporting Javascript's Math.random and a deterministig pseudo-random number generator (PRNG)
     * that can be fed with a seed and then returns a reproducable set of random numbers (if the precision of Javascript allows)
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Random {
        static default: Random;
        private generate;
        /**
         * Create an instance of {@link Random}.
         * If a seed is given, LFIB4 is used as generator, reproducing a series of numbers from that seed.
         * If a function producing values between 0 and 1 is given, it will be used as generator.
         */
        constructor(_seedOrFunction?: number | Function);
        /**
         * Returns a normed random number, thus in the range of [0, 1[
         */
        getNorm(): number;
        /**
         * Returns a random number in the range of given [_min, _max[
         */
        getRange(_min: number, _max: number): number;
        /**
         * Returns a random integer number in the range of given floored [_min, _max[
         */
        getRangeFloored(_min: number, _max: number): number;
        /**
         * Returns true or false randomly
         */
        getBoolean(): boolean;
        /**
         * Returns -1 or 1 randomly
         */
        getSign(): number;
        /**
         * Returns a randomly selected index into the given array
         */
        getIndex<T>(_array: Array<T>): number;
        /**
         * Returns a randomly selected element of the given array
         */
        getElement<T>(_array: Array<T>): T;
        /**
         * Removes a randomly selected element from the given array and returns it
         */
        splice<T>(_array: Array<T>): T;
        /**
         * Returns a randomly selected key from the given Map-instance
         */
        getKey<T, U>(_map: Map<T, U>): T;
        /**
         * Returns a randomly selected property name from the given object
         */
        getPropertyName<T>(_object: T): keyof T;
        /**
         * Returns a randomly selected symbol from the given object, if symbols are used as keys
         */
        getPropertySymbol<T>(_object: T): symbol;
        /**
         * Returns a random three-dimensional vector in the limits of the box defined by the vectors given as [_corner0, _corner1[
         */
        getVector3(_corner0: Vector3, _corner1: Vector3): Vector3;
        /**
         * Returns a random two-dimensional vector in the limits of the rectangle defined by the vectors given as [_corner0, _corner1[
         */
        getVector2(_corner0: Vector2, _corner1: Vector2): Vector2;
        /**
         * Returns a color with its r, g, b values set to random numbers in the range of [0, 1[.
         */
        getColor(): Color;
    }
    /**
     * Standard {@link Random}-instance using Math.random().
     */
    const random: Random;
}
declare namespace FudgeCore {
    interface Vector3Like {
        x: number;
        y: number;
        z: number;
    }
    /**
     * Stores and manipulates a threedimensional vector comprised of the components x, y and z
     * ```text
     *            +y
     *             |__ +x
     *            /
     *          +z
     * ```
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019-2022 | Jonas Plotzky, HFU, 2023-2025
     */
    class Vector3 extends Mutable implements Serializable, Recycable, ArrayConvertible {
        /**
         * Array of the keys of a vector. Allows to translate an index (0, 1, 2) to a key ("x", "y", "z") or to iterate over a vector.
         */
        static readonly keys: readonly ["x", "y", "z"];
        x: number;
        y: number;
        z: number;
        constructor(_x?: number, _y?: number, _z?: number);
        /**
         * Creates and returns a vector with the given length pointing in x-direction
         */
        static X(_scale?: number): Vector3;
        /**
         * Creates and returns a vector with the given length pointing in y-direction
         */
        static Y(_scale?: number): Vector3;
        /**
         * Creates and returns a vector with the given length pointing in z-direction
         */
        static Z(_scale?: number): Vector3;
        /**
         * Creates and returns a vector with the value 0 on each axis
         */
        static ZERO(): Vector3;
        /**
         * Creates and returns a vector of the given size on each of the three axis
         */
        static ONE(_scale?: number): Vector3;
        /**
         * Creates and returns a vector through transformation of the given vector by the given matrix or rotation quaternion.
         * @param _out Optional vector to store the result in.
         */
        static TRANSFORMATION(_vector: Vector3, _transform: Matrix4x4 | Quaternion, _includeTranslation?: boolean, _out?: Vector3): Vector3;
        /**
         * Creates and returns a vector which is a copy of the given vector scaled to the given length.
         * @param _out Optional vector to store the result in.
         */
        static NORMALIZATION(_vector: Vector3, _length?: number, _out?: Vector3): Vector3;
        /**
         * Returns the result of the addition of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static SUM(_a: Vector3, _b: Vector3, _out?: Vector3): Vector3;
        /**
         * Returns the result of the subtraction of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static DIFFERENCE(_minuend: Vector3, _subtrahend: Vector3, _out?: Vector3): Vector3;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor.
         * @param _out Optional vector to store the result in.
         */
        static SCALE(_vector: Vector3, _scaling: number, _out?: Vector3): Vector3;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor.
         * @param _out Optional vector to store the result in.
         */
        static NEGATION(_vector: Vector3, _out?: Vector3): Vector3;
        /**
         * Divides the dividend by the divisor component by component and returns the result.
         * @param _out Optional vector to store the result in.
         */
        static RATIO(_dividend: Vector3, _divisor: Vector3, _out?: Vector3): Vector3;
        /**
         * Computes the crossproduct of 2 vectors.
         * @param _out Optional vector to store the result in.
         */
        static CROSS(_a: Vector3, _b: Vector3, _out?: Vector3): Vector3;
        /**
         * Computes the dotproduct of 2 vectors.
         */
        static DOT(_a: Readonly<Vector3Like>, _b: Readonly<Vector3Like>): number;
        /**
         * Calculates and returns the reflection of the incoming vector at the given normal vector. The length of normal should be 1.
         * ```text
         * _________________________
         *           /|\
         * incoming / | \ reflection
         *         /  |  \
         *          normal
         * ```
         * @param _out Optional vector to store the result in.
         */
        static REFLECTION(_incoming: Vector3, _normal: Vector3, _out?: Vector3): Vector3;
        /**
         * Creates a cartesian vector from geographic coordinates.
         * @param _out Optional vector to store the result in.
         */
        static GEO(_longitude?: number, _latitude?: number, _magnitude?: number, _out?: Vector3): Vector3;
        /**
         * Return the angle in degrees between the two given vectors.
         */
        static ANGLE(_from: Vector3, _to: Vector3): number;
        /**
         * Return the projection of a onto b.
         * @param _out Optional vector to store the result in.
         */
        static PROJECTION(_a: Vector3, _b: Vector3, _out?: Vector3): Vector3;
        /**
         * Performs a linear interpolation between between two vectors. When t is 0 the result is a, when t is 1 the result is b.
         * @param _a - the first operand.
         * @param _b - the second operand.
         * @param _t - interpolation amount, in the range [0-1], between the two inputs.
         * @param _out - (optional) the receiving vector.
         * @returns `_out` or a new vector if none is provided.
         * @source https://github.com/toji/gl-matrix
         */
        static LERP(_a: Readonly<Vector3>, _b: Readonly<Vector3>, _t: number, _out?: Vector3): Vector3;
        static LERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
        /**
         * Performs a spherical linear interpolation between two vectors.
         * @param _a - the first operand.
         * @param _b - the second operand.
         * @param _t - interpolation amount, in the range [0-1], between the two inputs.
         * @param _out - (optional) the receiving vector.
         * @returns `_out` or a new vector if none is provided.
         * @source https://github.com/toji/gl-matrix
         */
        static SLERP(_a: Readonly<Vector3>, _b: Readonly<Vector3>, _t: number, _out?: Vector3): Vector3;
        static SLERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
        /**
         * Smoothly interpolates between two vectors based on a critically damped spring model.
         * Allows to smooth toward a moving target with an ease-in/ease-out motion maintaining a continuous velocity.
         * Does not overshoot.
         * @param _current - The current value.
         * @param _target - The target value.
         * @param _velocity - The velocity at which the value is moving. This value is **modified** by the function and must be maintained in the outside context.
         * @param _smoothTime - The time it would take for the value to reach the target if it were moving at maximum velocity for the entire duration. When following a moving target the smooth time equals the lag time allowing to calculate the `lag distance = target velocity * smooth time`.
         * @param _timeFrame - The elapsed time since the last call to the function.
         * @param _maxSpeed - An optional maximum speed that limits the velocity of the value. Defaults to Infinity.
         * @param _out Optional vector to store the result in.
         * @source from Andrew Kirmse, Game Programming Gems 4, Chapter 1.10
         */
        static SMOOTHDAMP(_current: Vector3, _target: Vector3, _velocity: Vector3, _smoothTime: number, _timeFrame: number, _maxSpeed?: number, _out?: Vector3): Vector3;
        get isArrayConvertible(): true;
        /**
         * Returns the length of the vector
         */
        get magnitude(): number;
        /**
         * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
         */
        get magnitudeSquared(): number;
        /**
         * - get: Returns a geographic representation of this vector
         * - set: Adjusts the cartesian values of this vector to represent the given as geographic coordinates
         */
        get geo(): Geo3;
        set geo(_geo: Geo3);
        /**
         * Creates and returns a clone of this vector.
         */
        get clone(): Vector3;
        /**
         * Copies the components of the given vector into this vector.
         * @returns A reference to this vector.
         */
        copy(_original: Vector3): Vector3;
        /**
         * Sets the components of this vector and returns it.
         * @returns A reference to this vector.
         */
        set(_x?: number, _y?: number, _z?: number): Vector3;
        recycle(): void;
        /**
         * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
         * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
         */
        equals(_compare: Vector3, _tolerance?: number): boolean;
        /**
         * Returns true if the position described by this is within a cube with the opposite corners 1 and 2.
         */
        isInsideCube(_corner1: Vector3, _corner2: Vector3): boolean;
        /**
         * Returns true if the position described by this is within a sphere with the given center and radius.
         */
        isInsideSphere(_center: Vector3, _radius: number): boolean;
        /**
         * Returns the distance bewtween this vector and the given vector.
         */
        getDistance(_to: Vector3): number;
        /**
         * Adds the given vector to this vector.
         * @returns A reference to this vector.
         */
        add(_addend: Vector3): Vector3;
        /**
         * Subtracts the given vector from this vector.
         * @returns A reference to this vector.
         */
        subtract(_subtrahend: Vector3): Vector3;
        /**
         * Scales this vector by the given scalar.
         * @returns A reference to this vector.
         */
        scale(_scalar: number): Vector3;
        /**
         * Negates this vector by flipping the signs of its components
         * @returns A reference to this vector.
         */
        negate(): Vector3;
        /**
         * Normalizes this to the given length, 1 by default
         * @returns A reference to this vector.
         */
        normalize(_length?: number): Vector3;
        /**
         * Reflects this vector at a given normal. See {@link Vector3.REFLECTION}.
         * @returns A reference to this vector.
         */
        reflect(_normal: Vector3): Vector3;
        /**
         * Projects this vector onto the given vector.
         * @returns A reference to this vector.
         */
        project(_on: Vector3): Vector3;
        /**
         * Transforms this vector by the given matrix or rotation quaternion.
         * Including or exluding the translation if a matrix is passed.
         * Including is the default, excluding will only rotate and scale this vector.
         * @returns A reference to this vector.
         */
        transform(_transform: Matrix4x4 | Quaternion, _includeTranslation?: boolean): Vector3;
        /**
         * Shuffles the components of this vector.
         * @returns A reference to this vector.
         */
        shuffle(): Vector3;
        /**
         * For each dimension, moves the component to the minimum of this and the given vector.
         * @returns A reference to this vector.
         */
        min(_compare: Vector3): Vector3;
        /**
         * For each dimension, moves the component to the maximum of this and the given vector.
         * @returns A reference to this vector.
         */
        max(_compare: Vector3): Vector3;
        /**
         * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
         * @param _out - (optional) the receiving vector.
         * @returns `_out` or a new vector if none is provided.
         */
        map(_function: (_value: number, _index: number, _component: "x" | "y" | "z", _vector: Vector3) => number, _out?: Vector3): Vector3;
        /**
         * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector3.map} but mutates this vector instead of creating a new one.
         * @returns A reference to this vector.
         */
        apply(_function: (_value: number, _index: number, _component: "x" | "y" | "z", _vector: Vector3) => number): Vector3;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        } = number[]>(_out?: T, _offset?: number): T;
        /**
         * Drops the z-component and returns a Vector2 consisting of the x- and y-components.
         * @param _out Optional vector to store the result in.
         */
        toVector2(_out?: Vector2): Vector2;
        /**
         * Returns a formatted string representation of this vector
         */
        toString(): string;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Vector3>;
        mutate(_mutator: Mutator): void;
        getMutator(): Mutator;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Stores and manipulates a fourdimensional vector comprised of the components x, y, z and w.
     * @authors Jonas Plotzky, HFU, 2023
     */
    class Vector4 extends Mutable implements Serializable, Recycable, ArrayConvertible {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        /**
         * Creates and returns a vector which is a copy of the given vector scaled to the given length.
         * @param _out Optional vector to store the result in.
         */
        static NORMALIZATION(_vector: Vector4, _length?: number, _out?: Vector4): Vector4;
        /**
         * Returns the result of the addition of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static SUM(_a: Vector4, _b: Vector4, _out?: Vector4): Vector4;
        /**
         * Returns the result of the subtraction of two vectors.
         * @param _out Optional vector to store the result in.
         */
        static DIFFERENCE(_minuend: Vector4, _subtrahend: Vector4, _out?: Vector4): Vector4;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor.
         * @param _out Optional vector to store the result in.
         */
        static SCALE(_vector: Vector4, _scaling: number, _out?: Vector4): Vector4;
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor.
         * @param _out Optional vector to store the result in.
         */
        static NEGATION(_vector: Vector4, _out?: Vector4): Vector4;
        /**
         * Computes the dotproduct of 2 vectors.
         */
        static DOT(_a: Vector4, _b: Vector4): number;
        get isArrayConvertible(): true;
        /**
         * The magnitude (length) of the vector.
         */
        get magnitude(): number;
        /**
         * The squared magnitude (length) of the vector. Faster for simple proximity evaluation.
         */
        get magnitudeSquared(): number;
        /**
         * Creates and returns a clone of this vector.
         */
        get clone(): Vector4;
        /**
         * Copies the components of the given vector into this vector.
         * @returns A reference to this vector.
         */
        copy(_original: Vector4): Vector4;
        /**
         * Sets the components of this vector and returns it.
         * @returns A reference to this vector.
         */
        set(_x: number, _y: number, _z: number, _w: number): Vector4;
        recycle(): void;
        /**
         * Returns true if this vector is equal to the given vector within the given tolerance.
         */
        equals(_compare: Vector4, _tolerance?: number): boolean;
        /**
         * Adds the given vector to this vector.
         * @returns A reference to this vector.
         */
        add(_addend: Vector4): Vector4;
        /**
         * Subtracts the given vector from this vector.
         * @returns A reference to this vector.
         */
        subtract(_subtrahend: Vector4): Vector4;
        /**
         * Scales this vector by the given scalar.
         * @returns A reference to this vector.
         */
        scale(_scalar: number): Vector4;
        /**
         * Negates this vector by flipping the signs of its components
         * @returns A reference to this vector.
         */
        negate(): Vector4;
        /**
         * Normalizes this vector to the given length, 1 by default.
         * @returns A reference to this vector.
         */
        normalize(_length?: number): Vector4;
        /**
         * For each dimension, moves the component to the minimum of this and the given vector.
         * @returns A reference to this vector.
         */
        min(_compare: Vector4): Vector4;
        /**
         * For each dimension, moves the component to the maximum of this and the given vector.
         * @returns A reference to this vector.
         */
        max(_compare: Vector4): Vector4;
        /**
         * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
         * @param _out Optional vector to store the result in.
         */
        map(_function: (_value: number, _index: number, _component: "x" | "y" | "z" | "w", _vector: Vector4) => number, _out?: Vector4): Vector4;
        /**
         * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector4.map} but mutates this vector instead of creating a new one.
         * @returns A reference to this vector.
         */
        apply(_function: (_value: number, _index: number, _component: "x" | "y" | "z" | "w", _vector: Vector4) => number): Vector4;
        fromArray(_array: ArrayLike<number>, _offset?: number): this;
        toArray<T extends {
            [n: number]: number;
        }>(_out?: T, _offset?: number): T;
        /**
         * Drops the z-component and w-component and returns a Vector2 consisting of the x- and y-components.
         * @param _out Optional vector to store the result in.
         */
        toVector2(_out?: Vector2): Vector2;
        /**
         * Drops the w-component and returns a Vector3 consisting of the x-, y- and z-components.
         * @param _out Optional vector to store the result in.
         */
        toVector3(_out?: Vector3): Vector3;
        /**
         * Returns a formatted string representation of this vector.
         */
        toString(): string;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Vector4>;
        mutate(_mutator: Mutator): void;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Describes a face of a {@link Mesh} by referencing three {@link Vertices} with their indizes
     * and calculates face normals.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class Face {
        indices: number[];
        angles: number[];
        normalUnscaled: Vector3;
        normal: Vector3;
        private vertices;
        constructor(_vertices: Vertices, _index0: number, _index1: number, _index2: number);
        /**
         * Returns the position of the vertex referenced by the given index
         */
        getPosition(_index: number): Vector3;
        /**
         * must be coplanar
         */
        isInside(_point: Vector3): boolean;
        private calculateNormals;
    }
}
declare namespace FudgeCore {
    /**
     * Generate a simple cube with edges of length 1, each face consisting of two trigons
     * ```text
     *       (12) 4____7  (11)
     *       (8) 0/__3/| (10)
     *       (15) ||5_||6 (14)
     *       (9) 1|/_2|/ (13)
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshCube extends Mesh {
        static readonly iSubclass: number;
        constructor(_name?: string);
    }
}
declare namespace FudgeCore {
    /**
     * Generate a flat polygon. All trigons share vertex 0, so careful design is required to create concave polygons.
     * Vertex 0 is also associated with the face normal.
     * ```text
     *             0
     *           1╱|╲  4 ...
     *            ╲|_╲╱
     *            2   3
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021-2022
     */
    class MeshPolygon extends Mesh {
        static readonly iSubclass: number;
        protected static shapeDefault: Vector2[];
        protected shape: MutableArray<Vector2>;
        protected fitTexture: boolean;
        constructor(_name?: string, _shape?: Vector2[], _fitTexture?: boolean);
        protected get minVertices(): number;
        /**
         * Create this mesh from the given vertices.
         */
        create(_shape?: Vector2[], _fitTexture?: boolean): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Generates an extrusion of a polygon by a series of transformations
     * ```text
     *                      ____
     * Polygon         ____╱╲   ╲                             y
     * Transform 0  → ╱ ╲__╲_╲___╲ ← Transform 2          z __│
     * (base)         ╲_╱__╱ ╱   ╱   (lid)                     ╲
     *     Transform 1  →  ╲╱___╱                               x
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021-2022
     */
    class MeshExtrusion extends MeshPolygon {
        static readonly iSubclass: number;
        protected static mtxDefaults: Matrix4x4[];
        private mtxTransforms;
        constructor(_name?: string, _vertices?: Vector2[], _mtxTransforms?: Matrix4x4[], _fitTexture?: boolean);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
        private extrude;
    }
}
declare namespace FudgeCore {
    const MeshFBX_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Mesh;
    /**
     * A mesh loaded from an FBX-File.
     * @authors Matthias Roming, HFU, 2023 | Jonas Plotzky, HFU, 2023
     */
    export class MeshFBX extends MeshFBX_base {
        iMesh: number;
        load(_url?: RequestInfo, _iMesh?: number): Promise<MeshFBX>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        private getDataIndex;
        private createBones;
    }
    export {};
}
declare namespace FudgeCore {
    /** Allows to create custom meshes from given Data */
    class MeshFromData extends Mesh {
        protected verticesToSet: Float32Array;
        protected textureUVsToSet: Float32Array;
        protected indicesToSet: Uint16Array;
        protected faceNormalsToSet: Float32Array;
        constructor(_vertices: Float32Array, _textureUVs: Float32Array, _indices: Uint16Array, _faceNormals: Float32Array);
        protected createVertices(): Float32Array;
        protected createTextureUVs(): Float32Array;
        protected createIndices(): Uint16Array;
        protected createFlatNormals(): Float32Array;
    }
}
declare namespace FudgeCore {
    const MeshGLTF_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Mesh;
    /**
     * A {@link Mesh} loaded from a glTF-File.
     * @authors Jonas Plotzky, HFU, 2024
     */
    export class MeshGLTF extends MeshGLTF_base {
        iPrimitive: number;
        load(_url?: RequestInfo, _name?: string, _iPrimitive?: number): Promise<MeshGLTF>;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
    }
    export {};
}
declare namespace FudgeCore {
    const MeshOBJ_base: (abstract new (...args: any[]) => SerializableResourceExternal) & typeof Mesh;
    /**
     * A mesh loaded from an OBJ-file.
     * Simple Wavefront OBJ import. Takes a wavefront obj string. To Load from a file url, use the
     * static LOAD Method. Currently only works with triangulated Meshes
     * (activate 'Geomentry → Triangulate Faces' in Blenders obj exporter)
     * @todo Load Materials, Support Quads
     * @authors Simon Storl-Schulke 2021 | Luis Keck, HFU, 2021 | Jirka Dell'Oro-Friedl, HFU, 2021-2022 | Matthias Roming, HFU, 2023 | Jonas Plotzky, HFU, 2023
     */
    export class MeshOBJ extends MeshOBJ_base {
        load(_url?: RequestInfo): Promise<MeshOBJ>;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Generate a simple pyramid with edges at the base of length 1 and a height of 1. The sides consisting of one, the base of two trigons
     * ```text
     *               4
     *              /\`.
     *            3/__\_\ 2
     *           0/____\/1
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshPyramid extends Mesh {
        static readonly iSubclass: number;
        constructor(_name?: string);
    }
}
declare namespace FudgeCore {
    /**
     * Generate a simple quad with edges of length 1, the face consisting of two trigons
     * ```text
     *        0 __ 3
     *         |_\|
     *        1    2
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019-2022
     */
    class MeshQuad extends MeshPolygon {
        static readonly iSubclass: number;
        protected static shape: Vector2[];
        constructor(_name?: string);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * This function type takes x and z as Parameters and returns a number between -1 and 1 to be used as a heightmap.
     * x * z * 2 represent the amout of faces which are created. As a result you get 1 vertex more in each direction (x and z axis)
     * The y-component of the resulting mesh may be moved to values between 0 and a maximum height.
     * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021-2022
     */
    type HeightMapFunction = (x: number, z: number) => number;
    /**
     * Information about the vertical projection of a given position onto the terrain
     */
    class TerrainInfo {
        /** the position of the point vertically projected on the terrain in world coordinates */
        position: Vector3;
        /** the normal of the face of the terrain under the point in world coordinates */
        normal: Vector3;
        /** vertical distance of the point to the terrain, negative if below */
        distance: number;
        /** the position in face coordinates */
        positionFace: Vector3;
        /** the index of the face the position is inside */
        index: number;
        /** the grid coordinates of the quad the face belongs to */
        grid: Vector2;
    }
    /**
     * A terrain spreads out in the x-z-plane, y is the height derived from the heightmap function.
     * The terrain is always 1 in size in all dimensions, fitting into the unit-cube.
     * Resolution determines the number of quads in x and z dimension, scale the factor applied to the x,z-coordinates passed to the heightmap function.
     * Standard function is the simplex noise implemented with FUDGE, but another function can be given.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021-2022 | Simon Storl-Schulke, HFU, 2020 | Moritz Beaugrand, HFU, 2021
     */
    class MeshTerrain extends Mesh {
        static readonly iSubclass: number;
        protected resolution: Vector2;
        protected scale: Vector2;
        protected seed: number;
        protected heightMapFunction: HeightMapFunction;
        constructor(_name?: string, _resolution?: Vector2, _scaleInput?: Vector2, _functionOrSeed?: HeightMapFunction | number);
        /**
         * Create this mesh from the given parameters
         */
        create(_resolution?: Vector2, _scaleInput?: Vector2, _functionOrSeed?: HeightMapFunction | number): void;
        /**
         * Returns information about the vertical projection of the given position onto the terrain.
         * Pass the overall world transformation of the terrain if the position is given in world coordinates.
         * If at hand, pass the inverse too to avoid unnecessary calculation.
         */
        getTerrainInfo(_position: Vector3, _mtxWorld?: Matrix4x4, _mtxInverse?: Matrix4x4): TerrainInfo;
        /**
         * Returns the grid coordinates of the quad the given face belongs to.
         */
        getGridFromFaceIndex(_index: number): Vector2;
        /**
         * Returns the indices of the two faces forming the quad the given grid position belongs to.
         */
        getFaceIndicesFromGrid(_grid: Vector2): number[];
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
    }
}
declare namespace FudgeCore {
    /**
     * Generates a planar Grid and applies a Heightmap-Function to it.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021 | Moritz Beaugrand, HFU, 2020
     */
    class MeshRelief extends MeshTerrain {
        #private;
        static readonly iSubclass: number;
        constructor(_name?: string, _texture?: TextureImage);
        private static createHeightMapFunction;
        private static textureToClampedArray;
        /**
         * The texture to be used as the heightmap.
         * **Caution!** Setting this causes the mesh to be recreated which can be an expensive operation.
         */
        get texture(): TextureImage;
        set texture(_texture: TextureImage);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Generates a rotation of a polygon around the y-axis
     * ```text
     *                     y
     *                  _  ↑ 0_1
     *                 │   │→x │2
     *                  ╲  │  ╱3
     *                  ╱  │  ╲
     *                 ╱___│___╲4
     *                      5
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021-2022
     */
    class MeshRotation extends Mesh {
        static readonly iSubclass: number;
        protected static verticesDefault: Vector2[];
        protected shape: MutableArray<Vector2>;
        protected longitudes: number;
        constructor(_name?: string, _shape?: Vector2[], _longitudes?: number);
        protected get minVertices(): number;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected rotate(_shape: Vector2[], _longitudes: number): void;
    }
}
declare namespace FudgeCore {
    /**
     * Generate a UV Sphere with a given number of sectors and stacks (clamped at 128*128)
     * Implementation based on http://www.songho.ca/opengl/gl_sphere.html
     * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshSphere extends MeshRotation {
        static readonly iSubclass: number;
        private latitudes;
        constructor(_name?: string, _longitudes?: number, _latitudes?: number);
        /**
         * Create this sphere with a given number of longitudes and latitudes
         */
        create(_longitudes?: number, _latitudes?: number): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
     * Generate two quads placed back to back, the one facing in negative Z-direction is textured reversed
     * ```text
     *        0 __ 3
     *         |__|
     *        1    2
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshSprite extends Mesh {
        static readonly iSubclass: number;
        constructor(_name?: string);
        get verticesFlat(): Float32Array;
        get indicesFlat(): Uint16Array;
    }
}
declare namespace FudgeCore {
    /**
     * Generate a torus with a given ring radius, tube radius and the number of major- and minor segments
     * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshTorus extends MeshRotation {
        static readonly iSubclass: number;
        private latitudes;
        private radiusRing;
        private radiusTube;
        constructor(_name?: string, _radiusRing?: number, _radiusTube?: number, _longitudes?: number, _latitudes?: number);
        private static getShape;
        /**
         * Create this torus from the given parameters
         */
        create(_radiusRing?: number, _radiusTube?: number, _longitudes?: number, _latitudes?: number): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected reduceMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    enum QUADSPLIT {
        PLANAR = 0,
        AT_0 = 1,
        AT_1 = 2
    }
    /**
     * A surface created with four vertices which immediately creates none, one or two {@link Face}s depending on vertices at identical positions.
     * ```text
     * QUADSPLIT:  PLANAR                  AT_0                     AT_1
     *             0 _ 3                   0 _ 3                    0 _ 3
     *              |\|                     |\|                      |/|
     *             1 ‾ 2                   1 ‾ 2                    1 ‾ 2
     *  shared last vertex 2      last vertices 2 + 3      last vertices 3 + 0
     *
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class Quad {
        #private;
        faces: Face[];
        constructor(_vertices: Vertices, _index0: number, _index1: number, _index2: number, _index3: number, _split?: QUADSPLIT);
        get split(): QUADSPLIT;
    }
}
declare namespace FudgeCore {
    interface Bone {
        index: number;
        weight: number;
    }
    /**
     * Represents a vertex of a mesh with extended information such as the uv coordinates and the vertex normal.
     * It may refer to another vertex via an index into some array, in which case the position and the normal are stored there.
     * This way, vertex position and normal is a 1:1 association, vertex to texture coordinates a 1:n association.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class Vertex {
        position: Vector3;
        uv: Vector2 | null;
        normal: Vector3;
        color: Color | null;
        tangent: Vector4 | null;
        referTo: number;
        bones: Bone[];
        /**
         * Represents a vertex of a mesh with extended information such as the uv coordinates the vertex normal and its tangents.
         * It may refer to another vertex via an index into some array, in which case the position and the normal are stored there.
         * This way, vertex position and normal is a 1:1 association, vertex to texture coordinates a 1:n association.
       * @authors Jirka Dell'Oro-Friedl, HFU, 2022
         */
        constructor(_positionOrIndex: Vector3 | number, _uv?: Vector2, _normal?: Vector3, _tangent?: Vector4, _color?: Color, _bones?: Bone[]);
    }
}
declare namespace FudgeCore {
    /**
     * Array with extended functionality to serve as a {@link Vertex}-cloud.
     * Accessors yield position or normal also for vertices referencing other vertices
     * @authors Jirka Dell'Oro-Friedl, HFU, 2022
     */
    class Vertices extends Array<Vertex> {
        /**
         * Returns the subset of vertices that do not refer to other vertices
         */
        get originals(): Array<Vertex>;
        /**
         * returns the position associated with the vertex addressed, resolving references between vertices
         */
        position(_index: number): Vector3;
        /**
         * returns the normal associated with the vertex addressed, resolving references between vertices
         */
        normal(_index: number): Vector3;
        /**
         * returns the tangent associated with the vertex addressed
         */
        tangent(_index: number): Vector4;
        /**
         * returns the uv-coordinates associated with the vertex addressed
         */
        uv(_index: number): Vector2;
        /**
         * returns the color associated with the vertex addressed
         */
        color(_index: number): Color;
        /**
         * returns the bones associated with the vertex addressed, resolving references between vertices
         */
        bones(_index: number): Bone[];
    }
}
declare namespace FudgeCore {
}
declare namespace FudgeCore {
    /**
     * Enables this node to access the waypoint grid established through {@link ComponentWaypoint}s and their {@link Connection}s,
     * find a path through them and even walk down the path.
     * @author Lukas Scheuerle, HFU, 2024
     */
    export class ComponentWalker extends Component {
        #private;
        static readonly iSubclass: number;
        /** The speed the walker should move with. Corresponds to units/s. */
        speed: number;
        constructor();
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        /**
         * Teleports (moves instantly) to the _target Waypoint.
         * @param _target
         * @returns a Promise that resolves immediately.
         */
        moveTo(_target: Waypoint): Promise<void>;
        /**
         * Moves the walker from the _start to the _end Waypoint.
         * Teleports (moves instantly) to the _start point, then moves through the waypoint connections to the _end point.
         * @param _start
         * @param _end
         * @param _rotate Rotates the walker to look in the direction of the waypoint
         * @returns a Promise that resolves when the _end point is reached. Rejects if _end can't be reached (no path found).
         */
        moveTo(_start: Waypoint, _end: Waypoint, _rotate?: boolean): Promise<void>;
        /** Takes care of the moving algorithm by calculating the next step and moving along this step */
        protected moving(): void;
        /** find the path between two given waypoints */
        protected getPath(_start: Waypoint, _end: Waypoint): PathingNode[];
        /**
         * Checks whether a connection is usable by this specific walker.
         * **Always returns true, unless overwritten in a custom Walker subclass.**
         * Can be used to influence the pathfinding algorithm for custom waypoint / connection systems.
         * @param _connection A connection to check
         * @returns true if the connection is usable by this walker, false if not
         */
        protected isConnectionUsable(_connection: Connection): boolean;
        /**
         * Calculates the new distance based on a connection.
         * **Always returns the plain connections cost unless overwritten in a custom walker subclass.**
         * Can be used to influence the pathfinding algorithm for custom waypoint / connection systems.
         * @param _connection A connection to check
         * @returns the amount of cost a connection encurs to the current walker or 0 if cost is negative.
         */
        protected calculateConnectionCost(_connection: Connection): number;
        private pathingNodeToPath;
        private rotateTowards;
    }
    /**
     * An internal interface to manage pathing data inside the Walker
     */
    interface PathingNode {
        waypoint: Waypoint;
        distance: number;
        previous: PathingNode;
        previousConnection: Connection;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Unifies Waypoints of the pathing algorithms
     * @author Lukas Scheuerle, HFU, 2024
     */
    interface Waypoint {
        connections: Connection[];
        mtxLocal: Matrix4x4;
        mtxWorld: Matrix4x4;
        isActive: boolean;
    }
    /**
     * Sets a position that a {@link ComponentWalker} can use as a target point.
     * Implements {@link Waypoint}.
     * Registers itself to a static list of all available waypoints
     * @author Lukas Scheuerle, HFU, 2024
     */
    class ComponentWaypoint extends Component implements Waypoint {
        #private;
        static readonly iSubclass: number;
        mtxLocal: Matrix4x4;
        constructor(_mtxInit?: Matrix4x4, _connections?: Connection[]);
        /** All the waypoints that are currently loaded in the scene. **Do not edit, treat as readonly!** */
        static get waypoints(): ComponentWaypoint[];
        /**
         * A shorthand to create a connection between two {@link ComponentWaypoint}s
         * @param _start The {@link ComponentWaypoint} from which to start the connection.
         * @param _end The {@link ComponentWaypoint} to which the connection leads.
         * @param _cost The cost of the connection. The higher the value, the less likely it is to be taken. Cannot be negative.
         * @param _speedModifier How fast the connection can be walked on. Defaults to 1
         * @param _bothWays If true, creates a connection in both directions. Default: false
         */
        static addConnection(_start: ComponentWaypoint, _end: ComponentWaypoint, _cost: number, _speedModifier?: number, _bothWays?: boolean): void;
        get isActive(): boolean;
        get connections(): Connection[];
        /** The current world position of the Waypoint. Returns a new Matrix without connection to the Waypoint */
        get mtxWorld(): Matrix4x4;
        /** Adds a new {@link Connection} to this waypoint */
        addConnection(_connection: Connection): void;
        /** Removes a {@link Connection} from this waypoint */
        removeConnection(_connection: Connection): void;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        drawGizmos(): void;
        /** An internal function to help the deserializaztion process. */
        private serializedWaypointToWaypoint;
    }
}
declare namespace FudgeCore {
    /**
     * A directed connection between two waypoints
     * @author Lukas Scheuerle, HFU, 2024
     */
    interface Connection {
        /** The start / origin waypoint of this connection. */
        start: Waypoint;
        /** The end / target waypoint of this connection. */
        end: Waypoint;
        /** The cost of the connection, the higher the less likely to be taken. Cannot be negative. */
        cost: number;
        /** Modifies the speed that a walker can walk past this connection by multiplying the speed with this value. Needs to be >0 */
        speedModifier: number;
    }
}
declare namespace FudgeCore {
    /**
     * Defines automatic adjustment of the collider
     */
    enum BODY_INIT {
        /** Collider uses the pivot of the mesh for initilialization */
        TO_MESH = 0,
        /** Collider uses the transform of the node for initilialization */
        TO_NODE = 1,
        /** Collider uses its own pivot for initilialization */
        TO_PIVOT = 2
    }
    /**
     * Acts as the physical representation of the {@link Node} it's attached to.
     * It's the connection between the FUDGE rendered world and the Physics world.
     * For the physics to correctly get the transformations rotations need to be applied with from left = true.
     * Or rotations need to happen before scaling.
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class ComponentRigidbody extends Component {
        #private;
        static readonly iSubclass: number;
        private static mapBodyType;
        /** Transformation of the collider relative to the node's transform. Once set mostly remains constant.
         * If altered, {@link isInitialized} must be reset to false to recreate the collider in the next {@link Render.prepare}
         */
        mtxPivot: Matrix4x4;
        /**
         * Vertices that build a convex mesh (form that is in itself closed). Needs to set in the construction of the rb if none of the standard colliders is used.
         * Untested and not yet fully supported by serialization and mutation.
         */
        convexMesh: Float32Array;
        /** Collisions with rigidbodies happening to this body, can be used to build a custom onCollisionStay functionality. */
        collisions: ComponentRigidbody[];
        /** Triggers that are currently triggering this body */
        triggerings: ComponentRigidbody[];
        /**
         * The groups this object collides with. Groups must be writen in form of
         *  e.g. collisionMask = {@link COLLISION_GROUP.DEFAULT} | {@link COLLISION_GROUP}.... and so on to collide with multiple groups.
         */
        collisionMask: number;
        /**
         * Automatic adjustment of the pivot when {@link Render.prepare} is called according to {@link BODY_INIT}
         */
        initialization: BODY_INIT;
        /** Marks if collider was initialized. Reset to false to initialize again e.g. after manipulation of mtxPivot */
        isInitialized: boolean;
        /** Creating a new rigidbody with a weight in kg, a physics type (default = dynamic), a collider type what physical form has the collider, to what group does it belong, is there a transform Matrix that should be used, and is the collider defined as a group of points that represent a convex mesh. */
        constructor(_mass?: number, _type?: BODY_TYPE, _colliderType?: COLLIDER_TYPE, _group?: COLLISION_GROUP, _mtxTransform?: Matrix4x4, _convexMesh?: Float32Array);
        get id(): number;
        /** Used for calculation of the geometrical relationship of node and collider by {@link Render}*/
        get mtxPivotInverse(): Matrix4x4;
        /** Used for calculation of the geometrical relationship of node and collider by {@link Render}*/
        get mtxPivotUnscaled(): Matrix4x4;
        /** Retrieve the body type. See {@link BODY_TYPE} */
        get typeBody(): BODY_TYPE;
        /** Set the body type. See {@link BODY_TYPE} */
        set typeBody(_value: BODY_TYPE);
        /** The shape that represents the {@link Node} in the physical world. Default is a Cube. */
        get typeCollider(): COLLIDER_TYPE;
        set typeCollider(_value: COLLIDER_TYPE);
        /** The collision group this {@link Node} belongs to it's the default group normally which means it physically collides with every group besides trigger. */
        get collisionGroup(): COLLISION_GROUP;
        set collisionGroup(_value: COLLISION_GROUP);
        /** Marking the Body as a trigger therefore not influencing the collision system but only sending triggerEvents */
        get isTrigger(): boolean;
        set isTrigger(_value: boolean);
        /**
         * Returns the physical weight of the {@link Node}
         */
        get mass(): number;
        /**
         * Setting the physical weight of the {@link Node} in kg
         */
        set mass(_value: number);
        /** Drag of linear movement. A Body does slow down even on a surface without friction. */
        get dampTranslation(): number;
        set dampTranslation(_value: number);
        /** Drag of rotation. */
        get dampRotation(): number;
        set dampRotation(_value: number);
        /** The factor this rigidbody reacts rotations that happen in the physical world. 0 to lock rotation this axis. */
        get effectRotation(): Vector3;
        set effectRotation(_effect: Vector3);
        /** The factor this rigidbody reacts to world gravity. Default = 1 e.g. 1*9.81 m/s. */
        get effectGravity(): number;
        set effectGravity(_effect: number);
        /**
         * Get the friction of the rigidbody, which is the factor of sliding resistance of this rigidbody on surfaces
         */
        get friction(): number;
        /**
         * Set the friction of the rigidbody, which is the factor of  sliding resistance of this rigidbody on surfaces
         */
        set friction(_friction: number);
        /**
         * Get the restitution of the rigidbody, which is the factor of bounciness of this rigidbody on surfaces
         */
        get restitution(): number;
        /**
         * Set the restitution of the rigidbody, which is the factor of bounciness of this rigidbody on surfaces
         */
        set restitution(_restitution: number);
        /**
         * Returns the rigidbody in the form the physics engine is using it, should not be used unless a functionality
         * is not provided through the FUDGE Integration.
         */
        getOimoRigidbody(): OIMO.RigidBody;
        /** Rotating the rigidbody therefore changing it's rotation over time directly in physics. This way physics is changing instead of transform.
         *  But you are able to incremental changing it instead of a direct rotation.  Although it's always prefered to use forces in physics.
         */
        rotateBody(_rotationChange: Vector3): void;
        /** Translating the rigidbody therefore changing it's place over time directly in physics. This way physics is changing instead of transform.
         *  But you are able to incrementally changing it instead of a direct position. Although it's always prefered to use forces in physics.
         */
        translateBody(_translationChange: Vector3): void;
        /**
         * Get the current POSITION of the {@link Node} in the physical space
         */
        getPosition(): Vector3;
        /**
         * Sets the current POSITION of the {@link Node} in the physical space
         */
        setPosition(_value: Vector3): void;
        /**
         * Get the current ROTATION of the {@link Node} in the physical space. Note this range from -pi to pi, so -90 to 90.
         */
        getRotation(): Vector3;
        /**
         * Sets the current ROTATION of the {@link Node} in the physical space, in degree.
         */
        setRotation(_value: Vector3 | Quaternion): void;
        /** Get the current SCALING in the physical space. */
        getScaling(): Vector3;
        /** Scaling requires the collider to be completely recreated anew */
        setScaling(_value: Vector3): void;
        /**
         * Initializes the rigidbody according to its initialization setting to match the mesh, the node or its own pivot matrix
         */
        initialize(): void;
        /**
        * Get the current VELOCITY of the {@link Node}
        */
        getVelocity(): Vector3;
        /**
         * Sets the current VELOCITY of the {@link Node}
         */
        setVelocity(_value: Vector3): void;
        /**
         * Get the current ANGULAR - VELOCITY of the {@link Node}
         */
        getAngularVelocity(): Vector3;
        /**
         * Sets the current ANGULAR - VELOCITY of the {@link Node}
         */
        setAngularVelocity(_value: Vector3): void;
        /**
        * Applies a continous FORCE at the center of the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS.
        * The force is measured in newton, 1kg needs about 10 Newton to fight against gravity.
        */
        applyForce(_force: Vector3): void;
        /**
        * Applies a continous FORCE at a specific point in the world to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        */
        applyForceAtPoint(_force: Vector3, _worldPoint: Vector3): void;
        /**
        * Applies a continous ROTATIONAL FORCE (Torque) to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        */
        applyTorque(_rotationalForce: Vector3): void;
        /**
        * Applies a instant FORCE at a point/rigidbodycenter to the RIGIDBODY in the three dimensions. Considering the rigidbod's MASS
        * Influencing the angular speed and the linear speed.
        */
        applyImpulseAtPoint(_impulse: Vector3, _worldPoint?: Vector3): void;
        /**
        * Applies a instant FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        * Only influencing it's speed not rotation.
        */
        applyLinearImpulse(_impulse: Vector3): void;
        /**
         * Applies a instant ROTATIONAL-FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
         * Only influencing it's rotation.
         */
        applyAngularImpulse(_rotationalImpulse: Vector3): void;
        /**
         * Changing the VELOCITY of the RIGIDBODY. Only influencing the linear speed not angular
         */
        addVelocity(_value: Vector3): void;
        /**
         * Changing the VELOCITY of the RIGIDBODY. Only influencing the angular speed not the linear
         */
        addAngularVelocity(_value: Vector3): void;
        /**
         * De- / Activate the rigidbodies auto-sleeping function.
         * If activated the rigidbody will automatically sleep when needed, increasing performance.
         * If deactivated the rigidbody gets stopped from sleeping when movement is too minimal. Decreasing performance, for rarely more precise physics results
         */
        activateAutoSleep(_on: boolean): void;
        /**
         * Sends a ray through this specific body ignoring the rest of the world and checks if this body was hit by the ray,
         * returning info about the hit. Provides the same functionality and information a regular raycast does but the ray is only testing against this specific body.
         */
        raycastThisBody(_origin: Vector3, _direction: Vector3, _length: number, _debugDraw?: boolean): RayHitInfo;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        /** Change properties by an associative array */
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutator(): Mutator;
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        protected reduceMutator(_mutator: Mutator): void;
        private hndEvent;
        private create;
        /** Creates the actual OimoPhysics Rigidbody out of informations the FUDGE Component has. */
        private createRigidbody;
        /** Creates a collider a shape that represents the object in the physical world.  */
        private createCollider;
        /** Creating a shape that represents a in itself closed form, out of the given vertices. */
        private createConvexGeometryCollider;
        /** Internal implementation of vertices that construct a pyramid. The vertices of the implemented pyramid mesh can be used too. But they are halfed and double sided, so it's more performant to use this. */
        private createPyramidVertices;
        /** Adding this ComponentRigidbody to the Physiscs.world giving the oimoPhysics system the information needed */
        private addRigidbodyToWorld;
        /** Capture only events that are broadcast to this node from an ancestor. Don't capture events that get send to descendants. */
        private hndNodeDeactivate;
        /** Removing this ComponentRigidbody from the Physiscs.world taking the informations from the oimoPhysics system */
        private removeRigidbodyFromWorld;
        private collisionCenterPoint;
        private collisionEnter;
        private collisionExit;
        /**
        * Trigger EnteringEvent Callback, automatically called by OIMO Physics within their calculations.
        * Since the event does not know which body is the trigger iniator, the event can be listened to
        * on either the trigger or the triggered. (This is only possible with the FUDGE OIMO Fork!)
        */
        private triggerEnter;
        /**
        * Trigger LeavingEvent Callback, automatically called by OIMO Physics within their calculations.
        * Since the event does not know which body is the trigger iniator, the event can be listened to
        * on either the trigger or the triggered. (This is only possible with the FUDGE OIMO Fork!)
        */
        private triggerExit;
    }
}
declare namespace FudgeCore {
    /** Internal class for holding data about physics debug vertices.*/
    class PhysicsDebugVertexBuffer {
        gl: WebGL2RenderingContext;
        numVertices: number;
        attribs: Array<PhysicsDebugVertexAttribute>;
        indices: Array<number>;
        offsets: Array<number>;
        stride: number;
        buffer: WebGLBuffer;
        dataLength: number;
        /** Setup the rendering context for this buffer and create the actual buffer for this context. */
        constructor(_renderingContext: WebGL2RenderingContext);
        /** Fill the bound buffer with data. Used at buffer initialization */
        setData(_array: Array<number>): void;
        /** Set Shader Attributes informations by getting their position in the shader, setting the offset, stride and size. For later use in the binding process */
        setAttribs(_attribs: Array<PhysicsDebugVertexAttribute>): void;
        /** Get the position of the attribute in the shader */
        loadAttribIndices(_program: PhysicsDebugShader): void;
        /** Enable a attribute in a shader for this context, */
        bindAttribs(): void;
    }
    /** Internal class for holding data about PhysicsDebugVertexBuffers */
    class PhysicsDebugIndexBuffer {
        gl: WebGL2RenderingContext;
        buffer: WebGLBuffer;
        count: number;
        /** Setup the rendering context for this buffer and create the actual buffer for this context. */
        constructor(_renderingContext: WebGL2RenderingContext);
        /** Fill the bound buffer with data amount. Used at buffer initialization */
        setData(_array: Array<number>): void;
        /** The actual DrawCall for physicsDebugDraw Buffers. This is where the information from the debug is actually drawn. */
        draw(_mode?: number, _count?: number): void;
    }
    /** Internal class for managing data about webGL Attributes */
    class PhysicsDebugVertexAttribute {
        float32Count: number;
        name: string;
        constructor(_float32Count: number, _name: string);
    }
    /** Internal class for Shaders used only by the physics debugDraw */
    class PhysicsDebugShader {
        gl: WebGL2RenderingContext;
        program: WebGLProgram;
        vertexShader: WebGLShader;
        fragmentShader: WebGLShader;
        uniformLocationMap: Map<string, WebGLUniformLocation>;
        /** Introduce the FUDGE Rendering Context to this class, creating a program and vertex/fragment shader in this context */
        constructor(_renderingContext: WebGL2RenderingContext);
        /** Take glsl shaders as strings and compile them, attaching the compiled shaders to a program thats used by this rendering context. */
        compile(_vertexSource: string, _fragmentSource: string): void;
        /** Get index of a attribute in a shader in this program */
        getAttribIndex(_name: string): number;
        /** Get the location of a uniform in a shader in this program */
        getUniformLocation(_name: string): WebGLUniformLocation;
        /** Get all indices for every attribute in the shaders of this program */
        getAttribIndices(_attribs: Array<PhysicsDebugVertexAttribute>): Array<number>;
        /** Tell the FUDGE Rendering Context to use this program to draw. */
        use(): void;
        /** Compile a shader out of a string and validate it. */
        compileShader(_shader: WebGLShader, _source: string): void;
    }
    /** Internal Class used to draw debugInformations about the physics simulation onto the renderContext. No user interaction needed.
     * @author Marko Fehrenbach, HFU 2020 //Based on OimoPhysics Haxe DebugDrawDemo
     */
    class PhysicsDebugDraw extends RenderWebGL {
        oimoDebugDraw: OIMO.DebugDraw;
        style: OIMO.DebugDrawStyle;
        gl: WebGL2RenderingContext;
        program: WebGLProgram;
        shader: PhysicsDebugShader;
        pointVBO: PhysicsDebugVertexBuffer;
        pointIBO: PhysicsDebugIndexBuffer;
        lineVBO: PhysicsDebugVertexBuffer;
        lineIBO: PhysicsDebugIndexBuffer;
        triVBO: PhysicsDebugVertexBuffer;
        triIBO: PhysicsDebugIndexBuffer;
        pointData: Array<number>;
        pointIboData: Array<number>;
        numPointData: number;
        lineData: Array<number>;
        lineIboData: Array<number>;
        numLineData: number;
        triData: Array<number>;
        triIboData: Array<number>;
        numTriData: number;
        /** Creating the debug for physics in FUDGE. Tell it to draw only wireframe objects, since FUDGE is handling rendering of the objects besides physics.
         * Override OimoPhysics Functions with own rendering. Initialize buffers and connect them with the context for later use. */
        constructor();
        /** Receive the current DebugMode from the physics settings and set the OimoPhysics.DebugDraw booleans to show only certain informations.
         * Needed since some debug informations exclude others, and can't be drawn at the same time, by OimoPhysics. And for users it provides more readability
         * to debug only what they need and is commonly debugged.
         */
        setDebugMode(_mode?: PHYSICS_DEBUGMODE): void;
        /** Creating the empty render buffers. Defining the attributes used in shaders.
         * Needs to create empty buffers to already have them ready to draw later on, linking is only possible with existing buffers. */
        initializeBuffers(): void;
        /** Before OimoPhysics.world is filling the debug. Make sure the buffers are reset. Also receiving the debugMode from settings and updating the current projection for the vertexShader. */
        clearBuffers(): void;
        /** After OimoPhysics.world filled the debug. Rendering calls. Setting this program to be used by the FUDGE rendering context. And draw each updated buffer and resetting them. */
        drawBuffers(): void;
        /** Drawing the ray into the debugDraw Call. By using the overwritten line rendering functions and drawing a point (pointSize defined in the shader) at the end of the ray. */
        debugRay(_origin: Vector3, _end: Vector3, _color: Color): void;
        /** Overriding the existing functions from OimoPhysics.DebugDraw without actually inherit from the class, to avoid compiler problems.
         * Overriding them to receive debugInformations in the format the physic engine provides them but handling the rendering in the fudge context. */
        private initializeOverride;
        /** The source code (string) of the in physicsDebug used very simple vertexShader.
         *  Handling the projection (which includes, view/world[is always identity in this case]/projection in FUDGE). Increasing the size of single points drawn.
         *  And transfer position color to the fragmentShader. */
        private vertexShaderSource;
        /** The source code (string) of the in physicsDebug used super simple fragmentShader. Unlit - only colorizing the drawn pixels, normals/position are given to make it expandable */
        private fragmentShaderSource;
    }
}
declare namespace FudgeCore {
    /**
     * A physical connection between two bodies with a defined axe of translation and rotation. Two Degrees of Freedom in the defined axis.
     * Two RigidBodies need to be defined to use it. A motor can be defined for rotation and translation, along with spring settings.
     *
     * ```text
     *          JointHolder - bodyAnchor
     *                    ┌───┐
     *                    │   │
     *           <────────│   │──────> tied body, sliding on axis = 1st degree of freedom
     *                    │   │        rotating around axis = 2nd degree of freedom
     *                    └───┘
     * ```
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class JointCylindrical extends JointAxial {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.CylindricalJoint;
        protected config: OIMO.CylindricalJointConfig;
        protected motor: OIMO.TranslationalLimitMotor;
        /** Creating a cylindrical joint between two ComponentRigidbodies moving on one axis and rotating around another bound on a local anchorpoint. */
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axis?: Vector3, _localAnchor?: Vector3);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        set springDamping(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        set springFrequency(_value: number);
        /**
        * The damping of the spring. 1 equals completly damped. Influencing TORQUE / ROTATION
        */
        get springDampingRotation(): number;
        set springDampingRotation(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. Influencing TORQUE / ROTATION
        */
        get springFrequencyRotation(): number;
        set springFrequencyRotation(_value: number);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get maxRotor(): number;
        set maxRotor(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get minRotor(): number;
        set minRotor(_value: number);
        /**
          * The target rotational speed of the motor in m/s.
         */
        get rotorSpeed(): number;
        set rotorSpeed(_value: number);
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get rotorTorque(): number;
        set rotorTorque(_value: number);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        set maxMotor(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        set minMotor(_value: number);
        set motorSpeed(_value: number);
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled.
         */
        get motorForce(): number;
        set motorForce(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutator(): Mutator;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
       * A physical connection between two bodies with a defined axe movement.
       * Used to create a sliding joint along one axis. Two RigidBodies need to be defined to use it.
       * A motor can be defined to move the connected along the defined axis. Great to construct standard springs or physical sliders.
       *
       * ```text
       *          JointHolder - bodyAnchor
       *                    ┌───┐
       *                    │   │
       *           <────────│   │──────> tied body, sliding on one Axis, 1 Degree of Freedom
       *                    │   │
       *                    └───┘
       * ```
       * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
       */
    class JointPrismatic extends JointAxial {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.PrismaticJoint;
        protected config: OIMO.PrismaticJointConfig;
        protected motor: OIMO.TranslationalLimitMotor;
        /** Creating a prismatic joint between two ComponentRigidbodies only moving on one axis bound on a local anchorpoint. */
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axis?: Vector3, _localAnchor?: Vector3);
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled. This is the force that the motor is using to hold the position, or reach it if a motorSpeed is defined.
         */
        get motorForce(): number;
        set motorForce(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        /** Actual creation of a joint in the OimoPhysics system */
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
      * A physical connection between two bodies, designed to simulate behaviour within a real body. It has two axis, a swing and twist axis, and also the perpendicular axis,
      * similar to a Spherical joint, but more restrictive in it's angles and only two degrees of freedom. Two RigidBodies need to be defined to use it. Mostly used to create humanlike joints that behave like a
      * lifeless body.
      * ```text
      *
      *                      anchor - it can twist on one axis and swing on another
      *                            │
      *         z            ┌───┐ │ ┌───┐
      *         ↑            │   │ ↓ │   │        e.g. z = TwistAxis, it can rotate in-itself around this axis
      *    -x ←─┼─→ x        │   │ x │   │        e.g. x = SwingAxis, it can rotate anchored around the base on this axis
      *         ↓            │   │   │   │
      *        -z            └───┘   └───┘         e.g. you can twist the leg in-itself to a certain degree,
      *                                                     but also rotate it forward/backward/left/right to a certain degree
      *                bodyAnchor          bodyTied
      *              (e.g. pelvis)         (e.g. upper-leg)
      *
      * ```
      * Twist equals a rotation around a point without moving on an axis.
      * Swing equals a rotation on a point with a moving local axis.
       * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
      */
    class JointRagdoll extends Joint {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.RagdollJoint;
        protected config: OIMO.RagdollJointConfig;
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axisFirst?: Vector3, _axisSecond?: Vector3, _localAnchor?: Vector3);
        /**
         * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axisFirst(): Vector3;
        set axisFirst(_value: Vector3);
        /**
        * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
        *  When changed after initialization the joint needs to be reconnected.
        */
        get axisSecond(): Vector3;
        set axisSecond(_value: Vector3);
        /**
         * The maximum angle of rotation along the first axis. Value needs to be positive. Changes do rebuild the joint
         */
        get maxAngleFirstAxis(): number;
        set maxAngleFirstAxis(_value: number);
        /**
         * The maximum angle of rotation along the second axis. Value needs to be positive. Changes do rebuild the joint
         */
        get maxAngleSecondAxis(): number;
        set maxAngleSecondAxis(_value: number);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingTwist(): number;
        set springDampingTwist(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencyTwist(): number;
        set springFrequencyTwist(_value: number);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingSwing(): number;
        set springDampingSwing(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencySwing(): number;
        set springFrequencySwing(_value: number);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get maxMotorTwist(): number;
        set maxMotorTwist(_value: number);
        /**
         * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get minMotorTwist(): number;
        set minMotorTwist(_value: number);
        /**
          * The target rotational speed of the motor in m/s.
         */
        get motorSpeedTwist(): number;
        set motorSpeedTwist(_value: number);
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get motorTorqueTwist(): number;
        set motorTorqueTwist(_value: number);
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutator(): Mutator;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
       * A physical connection between two bodies with a defined axe of rotation. Also known as HINGE joint.
       * Two RigidBodies need to be defined to use it. A motor can be defined to rotate the connected along the defined axis.
       *
       * ```text
       *                  rotation axis, 1st Degree of freedom
       *                    ↑
       *               ┌───┐│┌────┐
       *               │   │││    │
       *               │   │││    │
       *               │   │││    │
       *               └───┘│└────┘
       *                    │
       *      bodyAnchor         bodyTied
       *   (e.g. Doorhinge)       (e.g. Door)
       * ```
       * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
       */
    class JointRevolute extends JointAxial {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.RevoluteJoint;
        protected config: OIMO.RevoluteJointConfig;
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axis?: Vector3, _localAnchor?: Vector3);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        set maxMotor(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        set minMotor(_value: number);
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled.
         */
        get motorTorque(): number;
        set motorTorque(_value: number);
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
       * A physical connection between two bodies with three Degrees of Freedom, also known as ball and socket joint. Two bodies connected at their anchor but free to rotate.
       * Used for things like the connection of bones in the human shoulder (if simplified, else better use JointRagdoll). Two RigidBodies need to be defined to use it. Only spring settings can be defined.
       * 3 Degrees are swing horizontal, swing vertical and twist.
       *
       * ```text
       *              JointHolder
       *         z      bodyAnchor (e.g. Human-Shoulder)
       *      y  ↑
       *        \|          ───(●───
       *  -x <---|---> x           bodyTied
       *         |\                (e.g. Upper-Arm)
       *         ↓ -y
       *        -z
       * ```
       * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
       */
    class JointSpherical extends Joint {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.SphericalJoint;
        protected config: OIMO.SphericalJointConfig;
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _localAnchor?: Vector3);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping(): number;
        set springDamping(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency(): number;
        set springFrequency(_value: number);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        getMutator(): Mutator;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
       * A physical connection between two bodies with two defined axis (normally e.g. (0,0,1) and rotation(1,0,0)), they share the same anchor and have free rotation, but transfer the twist.
       * In reality used in cars to transfer the more stable stationary force on the velocity axis to the bumping, damped moving wheel. Two RigidBodies need to be defined to use it.
       * The two motors can be defined for the two rotation axis, along with springs.
       * ```text
       *
       *                      anchor - twist is transfered between bodies
       *         z                   |
       *         ↑            -----  |  ------------
       *         |           |     | ↓ |            |
       *  -x <---|---> x     |     | x |            |           e.g. wheel can still turn up/down,
       *         |           |     |   |            |           left right but transfering it's rotation on to the wheel-axis.
       *         ↓            -----     ------------
       *        -z
       *                 attachedRB          connectedRB
       *                (e.g. wheel)       (e.g. wheel-axis)
       * ```
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
       */
    class JointUniversal extends Joint {
        #private;
        static readonly iSubclass: number;
        protected joint: OIMO.UniversalJoint;
        protected config: OIMO.UniversalJointConfig;
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _axisFirst?: Vector3, _axisSecond?: Vector3, _localAnchor?: Vector3);
        /**
         * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axisFirst(): Vector3;
        set axisFirst(_value: Vector3);
        /**
        * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
        *  When changed after initialization the joint needs to be reconnected.
        */
        get axisSecond(): Vector3;
        set axisSecond(_value: Vector3);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingFirst(): number;
        set springDampingFirst(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencyFirst(): number;
        set springFrequencyFirst(_value: number);
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingSecond(): number;
        set springDampingSecond(_value: number);
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencySecond(): number;
        set springFrequencySecond(_value: number);
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get maxRotorFirst(): number;
        set maxRotorFirst(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get minRotorFirst(): number;
        set minRotorFirst(_value: number);
        /**
          * The target rotational speed of the motor in m/s.
         */
        get rotorSpeedFirst(): number;
        set rotorSpeedFirst(_value: number);
        /**
         * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get rotorTorqueFirst(): number;
        set rotorTorqueFirst(_value: number);
        /**
         * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get maxRotorSecond(): number;
        set maxRotorSecond(_value: number);
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get minRotorSecond(): number;
        set minRotorSecond(_value: number);
        /**
          * The target rotational speed of the motor in m/s.
         */
        get rotorSpeedSecond(): number;
        set rotorSpeedSecond(_value: number);
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get rotorTorqueSecond(): number;
        set rotorTorqueSecond(_value: number);
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): Promise<void>;
        getMutator(): Mutator;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
       * A physical connection between two bodies with no movement.
       * Best way to simulate convex objects like a chair seat connected to chair legs.
       * The actual anchor point does not matter that much, only in very specific edge cases.
       * Because welding means they simply do not disconnect. (unless you add Breakability)
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
       */
    class JointWelding extends Joint {
        static readonly iSubclass: number;
        protected joint: OIMO.GenericJoint;
        protected config: OIMO.GenericJointConfig;
        constructor(_bodyAnchor?: ComponentRigidbody, _bodyTied?: ComponentRigidbody, _localAnchor?: Vector3);
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable>;
        protected constructJoint(): void;
    }
}
declare namespace FudgeCore {
    /**
      * Manages the OIMO physics engine for FUDGE. Multiple instances may be created, one is active at a time.
      * All methods are static and use the currently active instance. At startup, a default instance is created and become the active instance
      * Attaching a {@link ComponentRigidbody} to a {@link Node} places a physics collider in the physics instance active at that time.
      * @author Marko Fehrenbach, HFU 2020
      */
    class Physics {
        #private;
        /** The SETTINGS that apply to the physical world. Ranging from things like sleeping, collisionShapeThickness and others */
        static settings: PhysicsSettings;
        private static ƒactive;
        private oimoWorld;
        private bodyList;
        private jointList;
        constructor();
        /**
         * Define the currently active Physics instance
         */
        static set activeInstance(_physics: Physics);
        /** Get the currently active Physics instance */
        static get activeInstance(): Physics;
        static get debugDraw(): PhysicsDebugDraw;
        static get mainCam(): ComponentCamera;
        /**
        * Cast a RAY into the physical world from a origin point in a certain direction. Receiving informations about the hit object and the
        * hit point. Do not specify a _group to raycast the whole world, else only bodies within the specific group can be hit.
        */
        static raycast(_origin: Vector3, _direction: Vector3, _length?: number, _debugDraw?: boolean, _group?: COLLISION_GROUP): RayHitInfo;
        /**
        * Simulates the physical world. _deltaTime is the amount of time between physical steps in seconds. Default is {@link Loop.timeFrameGame} / 1000 to run in sync with the {@link Loop}.
        * The maximum value is 1/30 of a second, to have more consistent frame calculations.
        */
        static simulate(_deltaTime?: number): void;
        /**
         * Draw information about the currently active instance using the {@link ComponentCamera} given
         */
        static draw(_cmpCamera: ComponentCamera, _mode?: PHYSICS_DEBUGMODE): void;
        /**
          * Adjusts the transforms of the {@link ComponentRigidbody}s in the given branch to match their nodes or meshes
          */
        static adjustTransforms(_branch: Node, _toMesh?: boolean): void;
        /**
        * Get the applied gravitational force of the active instance. Default earth gravity = 9.81 m/s
        */
        static getGravity(): Vector3;
        /**
        * Set the applied gravitational force of the active instance. Default earth gravity = 9.81 m/s
        */
        static setGravity(_value: Vector3): void;
        /**
        * Add a new OIMO Rigidbody to the active instance, happens automatically when adding a FUDGE Rigidbody Component.
        */
        static addRigidbody(_cmpRB: ComponentRigidbody): void;
        /**
        * Remove the OIMO Rigidbody to the active instance, happens automatically when removing a FUDGE Rigidbody Component
        */
        static removeRigidbody(_cmpRB: ComponentRigidbody): void;
        /**
        * Add a new OIMO Joint/Constraint to the active instance, happens automatically when adding a FUDGE Joint Component
        */
        static addJoint(_cmpJoint: Joint): void;
        /**
        * Called internally to inform the physics system that a joint has a change of core properties and needs to be recreated.
        */
        static changeJointStatus(_cmpJoint: Joint): void;
        /**
          * Remove the OIMO Joint/Constraint to the active instance, happens automatically when removing a FUDGE Joint Component
          */
        static removeJoint(_cmpJoint: Joint): void;
        /** Returns all the ComponentRigidbodies that are known to the active instance. */
        static getBodyList(): ComponentRigidbody[];
        /** Giving a ComponentRigidbody a specific identification number so it can be referenced in the loading process. And removed rb's can receive a new id. */
        static distributeBodyID(): number;
        /**
         * Connect all joints that are not connected yet. Used internally no user interaction needed. This functionality is called and needed to make sure joints connect/disconnect
         * if any of the two paired ComponentRigidbodies change.
         */
        static connectJoints(): void;
        /** Remove all oimo joints and rigidbodies, so that they can be reused in another world  */
        static cleanup(): void;
        /** Internal function to calculate the endpoint of mathematical ray. By adding the multiplied direction to the origin.
           * Used because OimoPhysics defines ray by start/end. But GameEngines commonly use origin/direction.
           */
        private static getRayEndPoint;
        /** Internal function to get the distance in which a ray hit by subtracting points from each other and get the square root of the squared product of each component. */
        private static getRayDistance;
        /** Returns the actual used world of the OIMO physics engine. No user interaction needed - Only for advanced users that need to access it directly */
        getOimoWorld(): OIMO.World;
    }
}
declare namespace FudgeCore {
    /**
     * Defines a threedimensional box by two corner-points, one with minimal values and one with maximum values
     */
    class Box implements Recycable {
        min: Vector3;
        max: Vector3;
        constructor(_min?: Vector3, _max?: Vector3);
        /**
         * Define the corners of this box, standard values are Infinity for min, and -Infinity for max,
         * creating an impossible inverted box that can not contain any points
         */
        set(_min?: Vector3, _max?: Vector3): void;
        /**
         * Expand the box if necessary to include the given point
         */
        expand(_include: Vector3): void;
        recycle(): void;
    }
}
declare namespace FudgeCore {
    /**
     * Stores information provided by {@link Render}-picking e.g. using {@link Picker} and provides methods for further calculation of positions and normals etc.
     *
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class Pick {
        #private;
        node: Node;
        zBuffer: number;
        color: Color;
        textureUV: Vector2;
        gizmo?: Gizmo;
        constructor(_node: Node);
        /**
         * Accessor to calculate and store world position of intersection of {@link Ray} and {@link Mesh} only when used.
         */
        get posWorld(): Vector3;
        /**
         * Accessor to calculate and store position in mesh-space of intersection of {@link Ray} and {@link Mesh} only when used.
         */
        get posMesh(): Vector3;
        /**
         * Accessor to calculate and store the face normal in world-space at the point of intersection of {@link Ray} and {@link Mesh} only when used.
         */
        get normal(): Vector3;
        /**
         * Called solely by the renderer to enable calculation of the world coordinates of this {@link Pick}
         */
        set mtxViewToWorld(_mtxViewToWorld: Matrix4x4);
    }
}
declare namespace FudgeCore {
    /**
     * Provides static methods for picking using {@link Render}
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class Picker {
        /**
         * Takes a ray plus min and max values for the near and far planes to construct the picker-camera,
         * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
         */
        static pickRay(_nodes: readonly Node[], _ray: Ray, _min: number, _max: number): Pick[];
        static pickRay(_gizmos: readonly Gizmo[], _ray: Ray, _min: number, _max: number): Pick[];
        /**
         * Takes a camera and a point on its virtual normed projection plane (distance 1) to construct the picker-camera,
         * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
         */
        static pickCamera(_nodes: readonly Node[], _cmpCamera: ComponentCamera, _posProjection: Vector2): Pick[];
        static pickCamera(_nodes: readonly Gizmo[], _cmpCamera: ComponentCamera, _posProjection: Vector2): Pick[];
        /**
         * Takes the camera of the given viewport and a point the client surface to construct the picker-camera,
         * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
         */
        static pickViewport(_viewport: Viewport, _posClient: Vector2): Pick[];
    }
}
declare namespace FudgeCore {
    /**
     * Defined by an origin and a direction of type {@link Pick}, rays are used to calculate picking and intersections
     * @authors Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class Ray {
        origin: Vector3;
        direction: Vector3;
        /** TODO: support length */
        length: number;
        constructor(_direction?: Vector3, _origin?: Vector3, _length?: number);
        /**
         * Returns the point of intersection of this ray with a plane defined by
         * the given point of origin and the planes normal. All values and calculations
         * must be relative to the same coordinate system, preferably the world
         */
        intersectPlane(_origin: Vector3, _normal: Vector3): Vector3;
        /**
         * Returns the point of intersection of this ray with a plane defined by the face.
         * All values and calculations must be relative to the same coordinate system, preferably the world
         */
        intersectFacePlane(_face: Face): Vector3;
        /**
         * Returns the shortest distance from the ray to the given target point.
         * All values and calculations must be relative to the same coordinate system, preferably the world.
         */
        getDistance(_target: Vector3): Vector3;
        /**
         * Transform the ray by the given matrix
         */
        transform(_mtxTransform: Matrix4x4): void;
        /**
         * Returns a readable string representation of this ray
         */
        toString(): string;
    }
}
declare namespace FudgeCore {
    /**
     * The interface to render visual aids in the editor. Implemented by {@link Component}s. Can be used on its own to draw and pick visual aids independent of a scene graph.
     */
    interface Gizmo {
        node?: Node;
        /**
         * Implement this to draw visual aids inside the editors render view. Use {@link Gizmos} inside the override to draw stuff.
         */
        drawGizmos?(_cmpCamera?: ComponentCamera, _picking?: boolean): void;
        /**
         * See {@link drawGizmos}. Only displayed while the corresponding node is selected.
         */
        drawGizmosSelected?(_cmpCamera?: ComponentCamera): void;
    }
    /**
     * The gizmos drawing interface. {@link Component}s can use this to draw visual aids inside {@link Component.drawGizmos} and {@link Component.drawGizmosSelected}.
     */
    abstract class Gizmos {
        #private;
        /**
         * The default opacity of occluded gizmo parts. Use this to control the visibility of gizmos behind objects.
         * Set to 0 to make occluded gizmo parts disappear. Set to 1 to make occluded gizmo parts fully visible.
         */
        private static alphaOccluded;
        private static readonly arrayBuffer;
        private static pickId;
        private static readonly posIcons;
        private static get wireCircle();
        private static get wireSphere();
        private static get wireCone();
        private static get wireCube();
        /**
         * Draws the given gizmos from the point of view of the given camera.
         */
        static draw(_gizmos: Gizmo[], _cmpCamera: ComponentCamera, _selected?: Node[]): void;
        /**
         * Picks all gizmos in the line of sight and returns an unsorted array of {@link Pick}s each associated with the gizmo the pick ray hit.
         */
        static pick(_gizmos: readonly Gizmos[], _cmpCamera: ComponentCamera): Pick[];
        /**
         * Draws a camera frustum for the given parameters. The frustum is oriented along the z-axis, with the tip of the truncated pyramid at the origin.
         */
        static drawWireFrustum(_aspect: number, _fov: number, _near: number, _far: number, _direction: FIELD_OF_VIEW, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a wireframe cube. The cube has a side-length of 1 and is centered around the origin.
         */
        static drawWireCube(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a wireframe sphere. The sphere has a diameter of 1 and is centered around the origin.
         */
        static drawWireSphere(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a cone with a height and diameter of 1. The cone is oriented along the z-axis with the tip at the origin.
         */
        static drawWireCone(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a circle with a diameter of 1. The circle lies in the x-y plane, with its center at the origin.
         */
        static drawWireCircle(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws lines between each pair of the given vertices.
         * Vertices are paired sequentially, so for example, lines will be drawn between vertices 0 and 1, 2 and 3, 4 and 5, etc.
         */
        static drawLines(_vertices: Vector3[], _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a wireframe mesh.
         */
        static drawWireMesh(_mesh: Mesh, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws an arrow at the given world position, facing in the given forward-direction with the given length and width.
         * Size refers to the size of the arrow head: the height of the pyramid; the size of the cube; the diameter of the sphere.
         * @param _forward A unit vector indicating the desired forward-direction.
         * @param _up A unit vector indicating the up-direction.
         */
        static drawArrow(_position: Vector3, _color: Color, _forward: Vector3, _up: Vector3, _length: number, _width: number, _size: number, _head?: typeof MeshCube | typeof MeshPyramid | typeof MeshSphere | null, _alphaOccluded?: number): void;
        /**
         * Draws a solid cube.
         */
        static drawCube(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a solid sphere.
         */
        static drawSphere(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a solid quad.
         */
        static drawQuad(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a solid double sided quad.
         */
        static drawSprite(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a solid pyramid.
         */
        static drawPyramid(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws a solid mesh.
         */
        static drawMesh(_mesh: Mesh, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        /**
         * Draws an icon from a {@link Texture} on a {@link MeshQuad}. The icon is affected by the given transform and color.
         */
        static drawIcon(_texture: Texture, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded?: number): void;
        private static bufferColor;
        private static bufferMatrix;
        private static drawGizmos;
        private static drawElementsTrianlges;
        private static drawElementsLines;
        private static drawArrays;
        private static getMesh;
        private static pickGizmos;
    }
}
declare namespace FudgeCore {
    type MapLightTypeToLightList = Map<LIGHT_TYPE, RecycableArray<ComponentLight>>;
    interface RenderPrepareOptions {
        ignorePhysics?: boolean;
    }
    /**
     * The main interface to the render engine, here WebGL (see superclass {@link RenderWebGL} and the RenderInjectors
     */
    abstract class Render extends RenderWebGL {
        #private;
        static rectClip: Rectangle;
        static pickBuffer: Int32Array;
        static readonly nodesPhysics: RecycableArray<Node>;
        static readonly componentsPick: RecycableArray<ComponentPick>;
        static readonly lights: MapLightTypeToLightList;
        private static readonly nodesSimple;
        private static readonly nodesAlpha;
        private static readonly componentsSkeleton;
        private static timestampUpdate;
        /**
         * Recursively iterates over the branch starting with the node given, recalculates all world transforms,
         * collects all lights and feeds the renderbuffers with the neccessary node and component data to draw a frame. Sorts nodes for different
         * render passes.
         * @param _recalculate - set true to force recalculation of all world transforms in the given branch, even if their local transforms haven't changed
         */
        static prepare(_branch: Node, _options?: RenderPrepareOptions, _recalculate?: boolean): void;
        static addLights(_cmpLights: readonly ComponentLight[]): void;
        /**
         * Draws the scene from the point of view of the given camera
         */
        static draw(_cmpCamera: ComponentCamera): void;
        private static prepareBranch;
        private static transformByPhysics;
    }
}
declare namespace FudgeCore {
    interface RenderBuffers {
        vao?: WebGLVertexArrayObject;
        indices?: WebGLBuffer;
        positions?: WebGLBuffer;
        normals?: WebGLBuffer;
        textureUVs?: WebGLBuffer;
        colors?: WebGLBuffer;
        tangents?: WebGLBuffer;
        bones?: WebGLBuffer;
        weights?: WebGLBuffer;
        nIndices?: number;
    }
    /**
     * Inserted into a {@link Mesh}, an instance of this class calculates and represents the mesh data in the form needed by the render engine
     */
    class RenderMesh {
        #private;
        buffers: RenderBuffers;
        mesh: Mesh;
        constructor(_mesh: Mesh);
        get positions(): Float32Array;
        set positions(_vertices: Float32Array);
        get indices(): Uint16Array;
        set indices(_indices: Uint16Array);
        get normals(): Float32Array;
        set normals(_normals: Float32Array);
        get tangents(): Float32Array;
        set tangents(_tangents: Float32Array);
        get textureUVs(): Float32Array;
        set textureUVs(_textureUVs: Float32Array);
        get colors(): Float32Array;
        set colors(_colors: Float32Array);
        get bones(): Uint8Array;
        set bones(_iBones: Uint8Array);
        get weights(): Float32Array;
        set weights(_weights: Float32Array);
        /**
         * Clears this render mesh and all its buffers
         */
        clear(): void;
    }
}
declare namespace FudgeCore {
    /**
     * Controls the rendering of a branch, using the given {@link ComponentCamera},
     * and the propagation of the rendered image from the offscreen renderbuffer to the target canvas
     * through a series of {@link Framing} objects. The stages involved are in order of rendering
     * {@link Render}.viewport -> {@link Viewport}.source -> {@link Viewport}.destination -> DOM-Canvas -> Client(CSS)
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019-2022 | Jonas Plotzky, HFU, 2023
     * @link https://github.com/hs-furtwangen/FUDGE/wiki/Viewport
     */
    class Viewport extends EventTargetUnified {
        #private;
        private static focus;
        name: string;
        camera: ComponentCamera;
        rectSource: Rectangle;
        rectDestination: Rectangle;
        frameClientToCanvas: FramingScaled;
        frameCanvasToDestination: FramingComplex;
        frameDestinationToSource: FramingScaled;
        frameSourceToRender: FramingScaled;
        adjustingFrames: boolean;
        adjustingCamera: boolean;
        physicsDebugMode: PHYSICS_DEBUGMODE;
        gizmosEnabled: boolean;
        gizmosSelected: Node[];
        gizmosFilter: {
            [_gizmo: string]: boolean;
        };
        componentsPick: RecycableArray<ComponentPick>;
        /**
         * Returns true if this viewport currently has focus and thus receives keyboard events
         */
        get hasFocus(): boolean;
        /**
         * Retrieve the destination canvas
         */
        get canvas(): HTMLCanvasElement;
        /**
         * Retrieve the 2D-context attached to the destination canvas
         */
        get context(): CanvasRenderingContext2D;
        /**
         * The rectangle of the canvas area in CSS pixels. Use this to access the canvas width and height,
         * but without incuring browser internal garbage collection.
         *
         * Adjusted internally by {@link adjustFrames}, do not modify.
         */
        get rectCanvas(): Rectangle;
        /**
         * The rectangle of the canvas area as displayed (considering css). Use this to access canvas clientWidth and clientHeight,
         * but without incuring browser internal garbage collection.
         *
         * Adjusted automatically on canvas resize, do not modify.
         */
        get rectClient(): Rectangle;
        /**
         * Connects the viewport to the given canvas to render the given branch to using the given camera-component, and names the viewport as given.
         */
        initialize(_name: string, _branch: Node, _camera: ComponentCamera, _canvas: HTMLCanvasElement): void;
        /**
         * Disconnect the resize observer from the canvas to allow garbage collection of the viewport.
         */
        disconnect(): void;
        /**
         * Retrieve the size of the destination canvas as a rectangle, x and y are always 0.
         * @deprecated Use {@link rectCanvas} instead.
         */
        getCanvasRectangle(): Rectangle;
        /**
         * Retrieve the client rectangle the canvas is displayed and fit in, x and y are always 0.
         * @deprecated Use {@link rectClient} instead.
         */
        getClientRectangle(): Rectangle;
        /**
         * Set the branch to be drawn in the viewport.
         */
        setBranch(_branch: Node): void;
        /**
         * Retrieve the branch this viewport renders
         */
        getBranch(): Node;
        /**
         * Draw this viewport displaying its branch. By default, the transforms in the branch are recalculated first.
         * Pass `false` if calculation was already done for this frame
         */
        draw(_prepareBranch?: boolean): void;
        /**
        * Adjusts all frames and the camera to fit the current size of the canvas. Prepares the branch for rendering.
        */
        prepare(_prepareBranch?: boolean): void;
        /**
         * Prepares all nodes in the branch for rendering by updating their world transforms and supplying the gpu renderbuffers with the neccessary node and component data to draw a frame.
         */
        prepareBranch(): void;
        /**
         * Performs a pick on all {@link ComponentPick}s in the branch of this viewport
         * using a ray from its camera through the client coordinates given in the event.
         * Dispatches the event to all nodes hit.
         * If {@link PICK.CAMERA} was chosen as the method to pick, a pick property gets added to the event,
         * which holds the detailed information, but is overwritten for each node.
         */
        dispatchPointerEvent(_event: PointerEvent): void;
        /**
         * Adjust all frames involved in the rendering process from the display area in the client up to the renderer canvas.
         */
        adjustFrames(): void;
        /**
         * Adjust the camera parameters to fit the rendering into the render viewport.
         */
        adjustCamera(): void;
        /**
         * Returns a {@link Ray} in world coordinates from this camera through the point given in client space
         */
        getRayFromClient(_point: Vector2): Ray;
        /**
         * Returns a point on the client rectangle matching the projection of the given point in world space
         */
        pointWorldToClient(_position: Vector3): Vector2;
        /**
         * Returns a point on the source-rectangle matching the given point on the client rectangle
         */
        pointClientToSource(_client: Vector2): Vector2;
        /**
         * Returns a point on the render-rectangle matching the given point on the source rectangle
         */
        pointSourceToRender(_source: Vector2): Vector2;
        /**
         * Returns a point on the render-rectangle matching the given point on the client rectangle
         */
        pointClientToRender(_client: Vector2): Vector2;
        /**
         * Returns a point on a projection surface in the hypothetical distance of 1 to the camera
         * matching the given point on the client rectangle
         * TODO: examine, if this should be a camera-method. Current implementation is for central-projection
         */
        pointClientToProjection(_client: Vector2): Vector2;
        /**
         * Returns a point in the client rectangle matching the given point in normed clipspace rectangle,
         * which stretches from -1 to 1 in both dimensions, y pointing up
         */
        pointClipToClient(_normed: Vector2): Vector2;
        /**
         * Returns a point in the client rectangle matching the given point in normed clipspace rectangle,
         * which stretches from -1 to 1 in both dimensions, y pointing up
         */
        pointClipToCanvas(_normed: Vector2): Vector2;
        /**
         * Returns a point in the browser page matching the given point of the viewport
         */
        pointClientToScreen(_client: Vector2): Vector2;
        /**
         * Returns all the gizmos in the branch of this viewport that are active, filtered by {@link gizmosFilter}
         */
        getGizmos(_nodes?: Node[]): Gizmo[];
    }
}
declare namespace FudgeCore {
    /**
     * Different xr session modes available. Could be expand with more modes in the future.
     * @authors Valentin Schmidberger, HFU, 2022 | Jonas Plotzky, HFU, 2023
     */
    enum XR_SESSION_MODE {
        IMMERSIVE_VR = "immersive-vr"
    }
    /**
     * Different reference vr-spaces available, creator has to check if the space is supported with its device.
     * Could be expand with more available space types in the future.
     */
    enum XR_REFERENCE_SPACE {
        VIEWER = "viewer",
        LOCAL = "local"
    }
    /**
     * XRViewport (webXR)-extension of Viewport, to displaying its branch on Head Mounted and AR (not implemted yet) Devices
     */
    class XRViewport extends Viewport {
        private static xrViewportInstance;
        vrDevice: ComponentVRDevice;
        session: XRSession;
        referenceSpace: XRReferenceSpace;
        private useVRController;
        constructor();
        /**
         * To retrieve private static instance of xr viewport, readonly.
         */
        static get default(): XRViewport;
        /**
          * Connects the viewport to the given canvas to render the given branch to using the given camera-component, and names the viewport as given.
          */
        initialize(_name: string, _branch: Node, _cameraXR: ComponentVRDevice, _canvas: HTMLCanvasElement): void;
        /**
         * The VR Session is initialized here, also VR - Controller are initialized, if boolean is true.
         * Creator has to call FrameRequestXR after this Method to run the viewport in virtual reality.
         */
        initializeVR(_vrSessionMode?: XR_SESSION_MODE, _vrReferenceSpaceType?: XR_REFERENCE_SPACE, _vrController?: boolean): Promise<void>;
        /**
         * The AR session could be initialized here. Up till now not implemented.
         */
        initializeAR(_arSessionMode?: XR_SESSION_MODE, _arReferenceSpaceType?: XR_REFERENCE_SPACE): Promise<void>;
        /**
         * Draw the xr viewport displaying its branch. By default, the transforms in the branch are recalculated first.
         * Pass `false` if calculation was already done for this frame
         * Called from loop method {@link Loop} again with the xrFrame parameter handover, as soon as FRAME_REQUEST_XR is called from creator.
         */
        draw(_prepareBranch?: boolean, _xrFrame?: XRFrame): void;
        /**
         * Move the reference space to set the initial position/orientation of the vr device in accordance to the node the vr device is attached to.
         */
        private initializeReferenceSpace;
        private setControllerConfigs;
    }
}
declare namespace FudgeCore {
    interface MapFilenameToContent {
        [filename: string]: string;
    }
    /**
     * Handles file transfer from a FUDGE-Browserapp to the local filesystem without a local server.
     * Saves to the download-path given by the browser, loads from the player's choice.
     */
    class FileIoBrowserLocal extends EventTargetStatic {
        private static selector;
        /**
         * Open file select dialog to load files from local filesystem into browser application.
         */
        static load(_multiple?: boolean): Promise<MapFilenameToContent>;
        /**
         * Open a file download dialog to save files to local filesystem.
         */
        static save(_toSave: MapFilenameToContent, _type?: string): Promise<MapFilenameToContent>;
        /**
         * Load the the files referenced in {@link FileList} into the provided {@link MapFilenameToContent}
         */
        static loadFiles(_fileList: FileList, _loaded: MapFilenameToContent): Promise<void>;
        private static handleFileSelect;
    }
}
declare namespace FudgeCore {
    /**
     * Mutable array of {@link Mutable}s. The {@link Mutator}s of the entries are included as array in the {@link Mutator}
     * @author Jirka Dell'Oro-Friedl, HFU, 2021
     */
    class MutableArray<T extends Mutable> extends Array<T> {
        #private;
        constructor(_type: new () => T, ..._args: T[]);
        get type(): new () => T;
        /**
         * Rearrange the entries of the array according to the given sequence of indices
         */
        rearrange(_sequence: number[]): void;
        /**
         * Returns an associative array with this arrays elements corresponding types as string-values
         */
        getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes;
        /**
         * Returns an array with each elements mutator by invoking {@link Mutable.getMutator} on them
         */
        getMutator(): Mutator;
        /**
         * See {@link Mutable.getMutatorForUserInterface}
         */
        getMutatorForUserInterface(): Mutator;
        /**
         * Mutate the elements of this array defined by the _mutator by invoking {@link Mutable.mutate} on it
         */
        mutate(_mutator: Mutator): void | Promise<void>;
        /**
         * Updates the values of the given mutator according to the current state of the instance
         */
        updateMutator(_mutator: Mutator): void;
    }
}
declare namespace FudgeCore {
    /**
       * Decorator to mark properties of a {@link Serializable} for automatic serialization and editor configuration.
       *
       * **Editor Configuration:**
       * Specify a type (constructor) for an attribute within a class's {@link Metadata | metadata}.
       * This allows the intended type of an attribute to be known by the editor (at runtime), making it:
       * - A valid drop target (e.g., for objects like {@link Node}, {@link Texture}, {@link Mesh}).
       * - Display the appropriate input element, even if the attribute has not been set (`undefined`).
       *
       * **Serialization:**
       * The automatic serialization occurs after an instance's {@link Serializable.serialize} / {@link Serializable.deserialize} method was called.
       * - Primitives and enums will be serialized as is.
       * - {@link Serializable}s will be serialized nested.
       * - {@link SerializableResource}s will be serialized via their resource id and fetched with it from the project when deserialized.
       * - {@link Node}s will be serialized as a path connecting them through the hierarchy, if found. During deserialization, the path will be unwound to find the instance in the current hierarchy. They will be available ***after*** {@link EVENT.GRAPH_DESERIALIZED} / {@link EVENT.GRAPH_INSTANTIATED} was broadcast through the hierarchy. Node references can only be serialized from a {@link Component}.
       *
       * **Example:**
       * ```typescript
       * import ƒ = FudgeCore;
       *
       * @ƒ.serialize
       * export class MyScript extends ƒ.ComponentScript {
       *   #size: number = 1;
       *
       *   @ƒ.serialize(String) // display a string in the editor
       *   public info: string;
       *
       *   @ƒ.serialize(ƒ.Vector3) // display a vector in the editor
       *   public position: ƒ.Vector3 = new ƒ.Vector3(1, 2, 3);
       *
       *   @ƒ.serialize(ƒ.Material) // drop a material inside the editor to reference it
       *   public resource: ƒ.Material;
       *
       *   @ƒ.serialize(ƒ.Node) // drop a node inside the editor to reference it
       *   public reference: ƒ.Node
       *
       *   @ƒ.serialize(Number) // display a number in the editor
       *   public get size(): number {
       *     return this.#size;
       *   }
       *
       *   // define a setter to allow writing to size, or omit it to leave the property read-only
       *   public set size(_size: number) {
       *     this.#size = _size;
       *   }
       * }
       * ```
       *
       * **Side effects:**
       * * Attributes with a specified type will always be included in the {@link Mutator base-mutator}
       * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects
       * will be displayed via their {@link toString} method in the editor.
       * * Decorated getters will be made enumerable, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
       *
       * @author Jonas Plotzky, HFU, 2024-2025
       */
    function serialize(_value: abstract new (...args: General[]) => Serializable, _context: ClassDecoratorContext): void;
    function serialize<T, C extends abstract new (...args: General[]) => T>(_constructor: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;
    function serialize<T extends Number | String | Boolean>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
    function serialize<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
}
declare namespace FBX {
    /**
     * Reader to read data from an array buffer more conveniently.
     * It saves a current offset which is updated when data is read due to its bytelength.
     * despite getSequence it is mostly a copy of the reference: https://github.com/picode7/binary-reader
     * @author Matthias Roming, HFU, 2023
     */
    class BufferReader {
        offset: number;
        readonly view: DataView;
        constructor(_buffer: ArrayBufferLike);
        getChar(_offset?: number): string;
        getBool(_offset?: number): boolean;
        getUint8(_offset?: number): number;
        getUint32(_offset?: number): number;
        getUint64(_offset?: number): bigint;
        getInt16(_offset?: number): number;
        getInt32(_offset?: number): number;
        getInt64(_offset?: number): bigint;
        getFloat32(_offset?: number): number;
        getFloat64(_offset?: number): number;
        getString(_length: number, _offset?: number): string;
        getSequence<T extends number | bigint>(_getter: () => T, _length: number, _offset?: number): Generator<T>;
    }
}
declare namespace FBX {
    /**
     * Interface to represent fbx files containing its documents, definitions, objects and connections.
     * Its objects are devided in all and the different object types.
     * @author Matthias Roming, HFU, 2023
     */
    export interface FBX {
        documents: Document[];
        definitions?: Definitions;
        objects: {
            all: Object[];
            models: Model[];
            geometries: Geometry[];
            poses: Object[];
            materials: Material[];
            textures: Texture[];
            animStacks: Object[];
        };
        connections: Connection[];
    }
    interface ObjectBase {
        uid: number;
        name: string;
        type?: string;
        subtype?: string;
        children?: Object[];
        parents?: Object[];
        loaded: boolean;
        load: () => Object;
    }
    /**
     * Interface to represent fbx-objects.
     * All fields other than uid, name, type, subtype, children and parents are loaded with the load-method.
     * Each object can be interpreted as an explicit fbx object type defined in FudgeCore.FBX. Explicit types have been defined
     * with the help of following reference:
     * https://archive.blender.org/wiki/index.php/User:Mont29/Foundation/FBX_File_Structure/#Some_Specific_Property_Types
     * @author Matthias Roming, HFU, 2023
     * @ignore
     */
    export interface Object extends ObjectBase {
        [name: string]: NodeProperty | {
            [name: string]: NodeProperty;
        } | Property70 | Object | Object[] | (() => Object);
    }
    export interface Document extends ObjectBase {
        SourceObject?: undefined;
        ActiveAnimStackName?: string;
        RootNode?: number;
    }
    export interface NodeAttribute extends ObjectBase {
        TypeFlags?: string;
    }
    export interface Geometry extends ObjectBase {
        GeometryVersion?: number;
        Vertices?: Float32Array;
        PolygonVertexIndex?: Int32Array;
        LayerElementNormal?: LayerElementNormal;
        LayerElementUV?: LayerElementUV;
        LayerElementMaterial?: LayerElementMaterial;
    }
    export interface Model extends ObjectBase {
        Version?: number;
        LclTranslation?: FudgeCore.Vector3 | AnimCurveNode;
        LclRotation?: FudgeCore.Vector3 | AnimCurveNode;
        LclScaling?: FudgeCore.Vector3 | AnimCurveNode;
        PreRotation?: FudgeCore.Vector3;
        PostRotation?: FudgeCore.Vector3;
        ScalingOffset?: FudgeCore.Vector3;
        ScalingPivot?: FudgeCore.Vector3;
        RotationOffset?: FudgeCore.Vector3;
        RotationPivot?: FudgeCore.Vector3;
        InheritType?: number;
        EulerOrder?: string;
        currentUVSet?: string;
    }
    export interface Material extends ObjectBase {
        Version?: number;
        ShadingModel?: string;
        Diffuse?: FudgeCore.Vector3;
        DiffuseColor?: FudgeCore.Vector3 | Texture;
        DiffuseFactor?: number;
        Ambient?: FudgeCore.Vector3;
        AmbientColor?: FudgeCore.Vector3 | Texture;
        Shininess?: number;
        ShininessExponent?: FudgeCore.Vector3 | Texture;
        Specular?: FudgeCore.Vector3;
        SpecularColor?: FudgeCore.Vector3 | Texture;
        SpecularFactor?: number;
        Reflectivity?: number;
        ReflectionFactor?: number;
        Opacity?: number;
        TransparencyFactor?: number;
        Emissive?: FudgeCore.Vector3;
        NormalMap?: Texture;
    }
    export interface Deformer extends ObjectBase {
        Version?: number;
        SkinningType?: string;
    }
    export interface SubDeformer extends ObjectBase {
        Version?: number;
        Transform?: Float32Array;
        TransformLink?: Float32Array;
        Indexes?: Uint16Array;
        Weights?: Float32Array;
    }
    export interface Texture extends ObjectBase {
        FileName?: string;
        RelativeFilename?: string;
        ModelUVScaling?: number;
        ModelUVTranslation?: number;
        UVSet?: string;
    }
    export interface Video extends ObjectBase {
        FileName?: string;
        RelativeFilename?: string;
        UseMipMap?: number;
        Content?: Uint8Array;
    }
    export interface AnimCurveNode extends ObjectBase {
        dX?: number | AnimCurve;
        dY?: number | AnimCurve;
        dZ?: number | AnimCurve;
    }
    export interface AnimCurve extends ObjectBase {
        KeyVer?: number;
        Default?: number;
        KeyTime?: BigInt64Array;
        KeyValueFloat?: Float32Array;
    }
    export interface LayerElement {
        Name: string;
        Version: number;
        MappingInformationType: string;
        ReferenceInformationType: string;
    }
    export interface LayerElementNormal extends LayerElement {
        Normals: Float32Array;
        NormalsW: Float32Array;
        NormalsIndex?: Uint16Array;
    }
    export interface LayerElementUV extends LayerElement {
        UV?: Float32Array;
        UVIndex?: Uint16Array;
    }
    export interface LayerElementMaterial extends LayerElement {
        Materials?: number;
    }
    export enum MAPPING_INFORMATION_TYPE {
        BY_VERTEX = 0,
        BY_POLYGON = 1,
        BY_POLYGON_VERTEX = 2,
        BY_EDGE = 3,
        ALL_SAME = 4
    }
    export enum REFERENCE_INFORMATION_TYPE {
        DIRECT = 0,
        INDEX_TO_DIRECT = 1
    }
    export interface Connection {
        parentUID: number;
        childUID: number;
        propertyName: string;
    }
    export interface Definitions {
        version: number;
        objectTypes: ObjectType[];
    }
    export interface ObjectType {
        name: string;
        count: number;
        propertyTemplate: PropertyTemplate;
    }
    export interface PropertyTemplate {
        [propertyName: string]: Property70;
        name: string;
    }
    export {};
}
declare namespace FudgeCore {
    /**
     * Asset loader for Filmbox files.
     * @author Matthias Roming, HFU, 2023
     */
    class FBXLoader {
        #private;
        private static loaders;
        readonly fbx: FBX.FBX;
        readonly nodes: FBX.Node[];
        readonly uri: string;
        constructor(_buffer: ArrayBuffer, _uri: string);
        private static get defaultMaterial();
        private static get defaultSkinMaterial();
        static LOAD(_uri: string): Promise<FBXLoader>;
        getScene(_index?: number): Promise<Graph>;
        getNode(_index: number): Promise<Node>;
        getMesh(_index: number): Promise<MeshFBX>;
        getMaterial(_index: number): Promise<Material>;
        getTexture(_index: number): Promise<Texture>;
        /**
         * Retriefs the skeleton containing the given limb node.
         */
        getSkeleton(_fbxLimbNode: FBX.Model): Promise<ComponentSkeleton>;
        getAnimation(_index: number): Promise<Animation>;
        /**
         * fetched from three.js, adapted to FUDGE and optimized
         * https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/FBXLoader.js
         * line 3950
         */
        private generateTransform;
        private getTransformVector;
        private getAnimationVector3;
        private getOrdered;
    }
}
declare namespace FBX {
    /**
     * Interface to represent fbx-nodes containing its name, children and properties.
     * Children and properites are lazy.
     * @author Matthias Roming, HFU, 2023
     */
    class Node {
        #private;
        name: string;
        private loadProperties;
        private loadChildren;
        constructor(_name: string, _loadProperties: () => NodeProperty[], _loadChildren: () => Node[]);
        get properties(): NodeProperty[];
        get children(): Node[];
    }
    type Property70 = boolean | number | string | FudgeCore.Vector3;
    type NodeProperty = boolean | number | string | Uint8Array | Uint16Array | Float32Array;
    enum ARRAY_ENCODING {
        UNCOMPRESSED = 0,
        COMPRESSED = 1
    }
}
declare namespace FBX {
    /**
     * Loads an fbx file from its fbx-node array which may be retrieved by parseNodesFromBinary.
     * @author Matthias Roming, HFU, 2023
     */
    function loadFromNodes(_nodes: Node[]): FBX;
}
declare namespace FBX {
    /**
     * Parses fbx-nodes array from a binary fbx-file.
     * despite the lazy node implementation it is mostly a copy of the reference: https://github.com/picode7/fbx-parser
     * @author Matthias Roming, HFU, 2023
     */
    function parseNodesFromBinary(_buffer: ArrayBuffer): Node[];
}
declare namespace GLTF {
    type GlTfId = number;
    /**
     * An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `accessor.sparse.count`. Indices **MUST** strictly increase.
     */
    interface AccessorSparseIndices {
        /**
         * The index of the buffer view with sparse indices. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined. The buffer view and the optional `byteOffset` **MUST** be aligned to the `componentType` byte length.
         */
        "bufferView": GlTfId;
        /**
         * The offset relative to the start of the buffer view in bytes.
         */
        "byteOffset"?: number;
        /**
         * The indices data type.
         */
        "componentType": COMPONENT_TYPE.UNSIGNED_BYTE | COMPONENT_TYPE.UNSIGNED_SHORT | COMPONENT_TYPE.UNSIGNED_INT;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * An object pointing to a buffer view containing the deviating accessor values. The number of elements is equal to `accessor.sparse.count` times number of components. The elements have the same component type as the base accessor. The elements are tightly packed. Data **MUST** be aligned following the same rules as the base accessor.
     */
    interface AccessorSparseValues {
        /**
         * The index of the bufferView with sparse values. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined.
         */
        "bufferView": GlTfId;
        /**
         * The offset relative to the start of the bufferView in bytes.
         */
        "byteOffset"?: number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * Sparse storage of accessor values that deviate from their initialization value.
     */
    interface AccessorSparse {
        /**
         * Number of deviating accessor values stored in the sparse array.
         */
        "count": number;
        /**
         * An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `count`. Indices **MUST** strictly increase.
         */
        "indices": AccessorSparseIndices;
        /**
         * An object pointing to a buffer view containing the deviating accessor values.
         */
        "values": AccessorSparseValues;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A typed view into a buffer view that contains raw binary data.
     */
    interface Accessor {
        /**
         * The index of the bufferView.
         */
        "bufferView"?: GlTfId;
        /**
         * The offset relative to the start of the buffer view in bytes.
         */
        "byteOffset"?: number;
        /**
         * The datatype of the accessor's components.
         */
        "componentType": COMPONENT_TYPE;
        /**
         * Specifies whether integer data values are normalized before usage.
         */
        "normalized"?: boolean;
        /**
         * The number of elements referenced by this accessor.
         */
        "count": number;
        /**
         * Specifies if the accessor's elements are scalars, vectors, or matrices.
         */
        "type": ACCESSOR_TYPE;
        /**
         * Maximum value of each component in this accessor.
         */
        "max"?: number[];
        /**
         * Minimum value of each component in this accessor.
         */
        "min"?: number[];
        /**
         * Sparse storage of elements that deviate from their initialization value.
         */
        "sparse"?: AccessorSparse;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#accessor-data-types
     */
    enum COMPONENT_TYPE {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        UNSIGNED_INT = 5125,
        FLOAT = 5126
    }
    enum ACCESSOR_TYPE {
        SCALAR = "SCALAR",
        VEC2 = "VEC2",
        VEC3 = "VEC3",
        VEC4 = "VEC4",
        MAT2 = "MAT2",
        MAT3 = "MAT3",
        MAT4 = "MAT4"
    }
    /**
     * The descriptor of the animated property.
     */
    interface AnimationChannelTarget {
        /**
         * The index of the node to animate. When undefined, the animated object **MAY** be defined by an extension.
         */
        "node"?: GlTfId;
        /**
         * The name of the node's TRS property to animate, or the `"weights"` of the Morph Targets it instantiates. For the `"translation"` property, the values that are provided by the sampler are the translation along the X, Y, and Z axes. For the `"rotation"` property, the values are a quaternion in the order (x, y, z, w), where w is the scalar. For the `"scale"` property, the values are the scaling factors along the X, Y, and Z axes.
         */
        "path": "translation" | "rotation" | "scale" | "weights";
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * An animation channel combines an animation sampler with a target property being animated.
     */
    interface AnimationChannel {
        /**
         * The index of a sampler in this animation used to compute the value for the target.
         */
        "sampler": GlTfId;
        /**
         * The descriptor of the animated property.
         */
        "target": AnimationChannelTarget;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.
     */
    interface AnimationSampler {
        /**
         * The index of an accessor containing keyframe timestamps.
         */
        "input": GlTfId;
        /**
         * Interpolation algorithm.
         */
        "interpolation"?: "LINEAR" | "STEP" | "CUBICSPLINE";
        /**
         * The index of an accessor, containing keyframe output values.
         */
        "output": GlTfId;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A keyframe animation.
     */
    interface Animation {
        /**
         * An array of animation channels. An animation channel combines an animation sampler with a target property being animated. Different channels of the same animation **MUST NOT** have the same targets.
         */
        "channels": AnimationChannel[];
        /**
         * An array of animation samplers. An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.
         */
        "samplers": AnimationSampler[];
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * Metadata about the glTF asset.
     */
    interface Asset {
        /**
         * A copyright message suitable for display to credit the content creator.
         */
        "copyright"?: string;
        /**
         * Tool that generated this glTF model.  Useful for debugging.
         */
        "generator"?: string;
        /**
         * The glTF version in the form of `<major>.<minor>` that this asset targets.
         */
        "version": string;
        /**
         * The minimum glTF version in the form of `<major>.<minor>` that this asset targets. This property **MUST NOT** be greater than the asset version.
         */
        "minVersion"?: string;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A buffer points to binary geometry, animation, or skins.
     */
    interface Buffer {
        /**
         * The URI (or IRI) of the buffer.
         */
        "uri"?: string;
        /**
         * The length of the buffer in bytes.
         */
        "byteLength": number;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A view into a buffer generally representing a subset of the buffer.
     */
    interface BufferView {
        /**
         * The index of the buffer.
         */
        "buffer": GlTfId;
        /**
         * The offset into the buffer in bytes.
         */
        "byteOffset"?: number;
        /**
         * The length of the bufferView in bytes.
         */
        "byteLength": number;
        /**
         * The stride, in bytes.
         */
        "byteStride"?: number;
        /**
         * The hint representing the intended GPU buffer type to use with this buffer view.
         */
        "target"?: number | number | number;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * An orthographic camera containing properties to create an orthographic projection matrix.
     */
    interface CameraOrthographic {
        /**
         * The floating-point horizontal magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative.
         */
        "xmag": number;
        /**
         * The floating-point vertical magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative.
         */
        "ymag": number;
        /**
         * The floating-point distance to the far clipping plane. This value **MUST NOT** be equal to zero. `zfar` **MUST** be greater than `znear`.
         */
        "zfar": number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        "znear": number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A perspective camera containing properties to create a perspective projection matrix.
     */
    interface CameraPerspective {
        /**
         * The floating-point aspect ratio of the field of view.
         */
        "aspectRatio"?: number;
        /**
         * The floating-point vertical field of view in radians. This value **SHOULD** be less than π.
         */
        "yfov": number;
        /**
         * The floating-point distance to the far clipping plane.
         */
        "zfar"?: number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        "znear": number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A camera's projection.  A node **MAY** reference a camera to apply a transform to place the camera in the scene.
     */
    interface Camera {
        /**
         * An orthographic camera containing properties to create an orthographic projection matrix. This property **MUST NOT** be defined when `perspective` is defined.
         */
        "orthographic"?: CameraOrthographic;
        /**
         * A perspective camera containing properties to create a perspective projection matrix. This property **MUST NOT** be defined when `orthographic` is defined.
         */
        "perspective"?: CameraPerspective;
        /**
         * Specifies if the camera uses a perspective or orthographic projection.
         */
        "type": any | any | string;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * Image data used to create a texture. Image **MAY** be referenced by an URI (or IRI) or a buffer view index.
     */
    interface Image {
        /**
         * The URI (or IRI) of the image.
         */
        "uri"?: string;
        /**
         * The image's media type. This field **MUST** be defined when `bufferView` is defined.
         */
        "mimeType"?: any | any | string;
        /**
         * The index of the bufferView that contains the image. This field **MUST NOT** be defined when `uri` is defined.
         */
        "bufferView"?: GlTfId;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * Reference to a texture.
     */
    interface TextureInfo {
        /**
         * The index of the texture.
         */
        "index": GlTfId;
        /**
         * The set index of texture's TEXCOORD attribute used for texture coordinate mapping.
         */
        "texCoord"?: number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.
     */
    interface MaterialPbrMetallicRoughness {
        /**
         * The factors for the base color of the material.
         */
        "baseColorFactor"?: number[];
        /**
         * The base color texture.
         */
        "baseColorTexture"?: TextureInfo;
        /**
         * The factor for the metalness of the material.
         */
        "metallicFactor"?: number;
        /**
         * The factor for the roughness of the material.
         */
        "roughnessFactor"?: number;
        /**
         * The metallic-roughness texture.
         */
        "metallicRoughnessTexture"?: TextureInfo;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    interface MaterialNormalTextureInfo {
        "index"?: any;
        "texCoord"?: any;
        /**
         * The scalar parameter applied to each normal vector of the normal texture.
         */
        "scale"?: number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    interface MaterialOcclusionTextureInfo {
        "index"?: any;
        "texCoord"?: any;
        /**
         * A scalar multiplier controlling the amount of occlusion applied.
         */
        "strength"?: number;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * The material appearance of a primitive.
     */
    interface Material {
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        /**
         * A set of parameter values that are used to define the metallic-roughness material model from Physically Based Rendering (PBR) methodology. When undefined, all the default values of `pbrMetallicRoughness` **MUST** apply.
         */
        "pbrMetallicRoughness"?: MaterialPbrMetallicRoughness;
        /**
         * The tangent space normal texture.
         */
        "normalTexture"?: MaterialNormalTextureInfo;
        /**
         * The occlusion texture.
         */
        "occlusionTexture"?: MaterialOcclusionTextureInfo;
        /**
         * The emissive texture.
         */
        "emissiveTexture"?: TextureInfo;
        /**
         * The factors for the emissive color of the material.
         */
        "emissiveFactor"?: number[];
        /**
         * The alpha rendering mode of the material.
         */
        "alphaMode"?: "OPAQUE" | "MASK" | "BLEND";
        /**
         * The alpha cutoff value of the material.
         */
        "alphaCutoff"?: number;
        /**
         * Specifies whether the material is double sided.
         */
        "doubleSided"?: boolean;
        [k: string]: any;
    }
    /**
     * Geometry to be rendered with the given material.
     */
    interface MeshPrimitive {
        /**
         * A plain JSON object, where each key corresponds to a mesh attribute semantic and each value is the index of the accessor containing attribute's data.
         */
        "attributes": {
            [k: string]: GlTfId;
        };
        /**
         * The index of the accessor that contains the vertex indices.
         */
        "indices"?: GlTfId;
        /**
         * The index of the material to apply to this primitive when rendering.
         */
        "material"?: GlTfId;
        /**
         * The topology type of primitives to render.
         */
        "mode"?: MESH_PRIMITIVE_MODE;
        /**
         * An array of morph targets.
         */
        "targets"?: {
            [k: string]: GlTfId;
        }[];
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    enum MESH_PRIMITIVE_MODE {
        POINTS = 0,
        LINES = 1,
        LINE_LOOP = 2,
        LINE_STRIP = 3,
        TRIANGLES = 4,
        TRIANGLE_STRIP = 5,
        TRIANGLE_FAN = 6
    }
    /**
     * A set of primitives to be rendered.  Its global transform is defined by a node that references it.
     */
    interface Mesh {
        /**
         * An array of primitives, each defining geometry to be rendered.
         */
        "primitives": MeshPrimitive[];
        /**
         * Array of weights to be applied to the morph targets. The number of array elements **MUST** match the number of morph targets.
         */
        "weights"?: number[];
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` **MUST** contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node **MAY** have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), `matrix` **MUST NOT** be present.
     */
    interface Node {
        /**
         * The index of the camera referenced by this node.
         */
        "camera"?: GlTfId;
        /**
         * The indices of this node's children.
         */
        "children"?: GlTfId[];
        /**
         * The index of the skin referenced by this node.
         */
        "skin"?: GlTfId;
        /**
         * A floating-point 4x4 transformation matrix stored in column-major order.
         */
        "matrix"?: number[];
        /**
         * The index of the mesh in this node.
         */
        "mesh"?: GlTfId;
        /**
         * The node's unit quaternion rotation in the order (x, y, z, w), where w is the scalar.
         */
        "rotation"?: number[];
        /**
         * The node's non-uniform scale, given as the scaling factors along the x, y, and z axes.
         */
        "scale"?: number[];
        /**
         * The node's translation along the x, y, and z axes.
         */
        "translation"?: number[];
        /**
         * The weights of the instantiated morph target. The number of array elements **MUST** match the number of morph targets of the referenced mesh. When defined, `mesh` **MUST** also be defined.
         */
        "weights"?: number[];
        "name"?: string;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
        /**
         * Custom property set by FUDGE loader. Not part of glTF standard 2.0.
         */
        isAnimated?: boolean;
        /**
         * Custom property set by FUDGE loader. Not part of glTF standard 2.0.
         */
        parent?: number;
        /**
         * Path from the root node to this node.
         * Custom property set by FUDGE loader. Not part of glTF standard 2.0.
         */
        path?: number[];
    }
    /**
     * Texture sampler properties for filtering and wrapping modes.
     */
    interface Sampler {
        /**
         * Magnification filter.
         */
        "magFilter"?: WebGL2RenderingContext["NEAREST"] | WebGL2RenderingContext["LINEAR"];
        /**
         * Minification filter.
         */
        "minFilter"?: WebGL2RenderingContext["NEAREST"] | WebGL2RenderingContext["LINEAR"] | WebGL2RenderingContext["NEAREST_MIPMAP_NEAREST"] | WebGL2RenderingContext["LINEAR_MIPMAP_NEAREST"] | WebGL2RenderingContext["NEAREST_MIPMAP_LINEAR"] | WebGL2RenderingContext["LINEAR_MIPMAP_LINEAR"];
        /**
         * S (U) wrapping mode.
         */
        "wrapS"?: WebGL2RenderingContext["CLAMP_TO_EDGE"] | WebGL2RenderingContext["MIRRORED_REPEAT"] | WebGL2RenderingContext["REPEAT"];
        /**
         * T (V) wrapping mode.
         */
        "wrapT"?: WebGL2RenderingContext["CLAMP_TO_EDGE"] | WebGL2RenderingContext["MIRRORED_REPEAT"] | WebGL2RenderingContext["REPEAT"];
        "name"?: string;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * The root nodes of a scene.
     */
    interface Scene {
        /**
         * The indices of each root node.
         */
        "nodes"?: GlTfId[];
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * Joints and matrices defining a skin.
     */
    interface Skin {
        /**
         * The index of the accessor containing the floating-point 4x4 inverse-bind matrices.
         */
        "inverseBindMatrices"?: GlTfId;
        /**
         * The index of the node used as a skeleton root.
         */
        "skeleton"?: GlTfId;
        /**
         * Indices of skeleton nodes, used as joints in this skin.
         */
        "joints": GlTfId[];
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * A texture and its sampler.
     */
    interface Texture {
        /**
         * The index of the sampler used by this texture. When undefined, a sampler with repeat wrapping and auto filtering **SHOULD** be used.
         */
        "sampler"?: GlTfId;
        /**
         * The index of the image used by this texture. When undefined, an extension or other mechanism **SHOULD** supply an alternate texture source, otherwise behavior is undefined.
         */
        "source"?: GlTfId;
        "name"?: any;
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
    /**
     * The root object for a glTF asset.
     */
    interface GlTf {
        /**
         * Names of glTF extensions used in this asset.
         */
        "extensionsUsed"?: string[];
        /**
         * Names of glTF extensions required to properly load this asset.
         */
        "extensionsRequired"?: string[];
        /**
         * An array of accessors.
         */
        "accessors"?: Accessor[];
        /**
         * An array of keyframe animations.
         */
        "animations"?: Animation[];
        /**
         * Metadata about the glTF asset.
         */
        "asset": Asset;
        /**
         * An array of buffers.
         */
        "buffers"?: Buffer[];
        /**
         * An array of bufferViews.
         */
        "bufferViews"?: BufferView[];
        /**
         * An array of cameras.
         */
        "cameras"?: Camera[];
        /**
         * An array of images.
         */
        "images"?: Image[];
        /**
         * An array of materials.
         */
        "materials"?: Material[];
        /**
         * An array of meshes.
         */
        "meshes"?: Mesh[];
        /**
         * An array of nodes.
         */
        "nodes"?: Node[];
        /**
         * An array of samplers.
         */
        "samplers"?: Sampler[];
        /**
         * The index of the default scene.
         */
        "scene"?: GlTfId;
        /**
         * An array of scenes.
         */
        "scenes"?: Scene[];
        /**
         * An array of skins.
         */
        "skins"?: Skin[];
        /**
         * An array of textures.
         */
        "textures"?: Texture[];
        "extensions"?: any;
        "extras"?: any;
        [k: string]: any;
    }
}
declare namespace FudgeCore {
    /**
     * Asset loader for gl Transfer Format files.
     * @authors Matthias Roming, HFU, 2022 | Jonas Plotzky, HFU, 2023-2025
     */
    class GLTFLoader {
        #private;
        private static loaders;
        private constructor();
        private static get defaultMaterial();
        private static get defaultSkinMaterial();
        /**
         * Returns a {@link GLTFLoader} instance for the given url or null if the url can't be resolved.
         */
        static LOAD(_url: string, _registerResources?: boolean): Promise<GLTFLoader>;
        private static checkCompatibility;
        private static preProcess;
        /**
         * Returns the glTF file name.
         */
        get name(): string;
        /**
         * Returns new instances of all resources of the given type.
         */
        loadResources<T extends SerializableResourceExternal>(_class: new () => T): Promise<T[]>;
        /**
         * Returns a {@link Graph} for the given scene name or the default scene if no name is given.
         */
        getGraph(_name?: string): Promise<Graph>;
        /**
         * Returns a {@link Graph} for the given scene index or the default scene if no index is given.
         */
        getGraph(_iScene?: number): Promise<Graph>;
        /**
         * Returns the first {@link Animation} with the given animation name.
         */
        getAnimation(_name: string): Promise<Animation>;
        /**
         * Returns the {@link Animation} for the given animation index.
         */
        getAnimation(_iAnimation: number): Promise<Animation>;
        getAnimationNew(_iAnimation: number | string, _animationOut?: AnimationSystem.Animation): Promise<AnimationSystem.Animation>;
        /**
         * Returns the first {@link MeshGLTF} with the given name.
         */
        getMesh(_name: string, _iPrimitive?: number): Promise<Mesh>;
        /**
         * Returns the {@link MeshGLTF} for the given mesh index and primitive index.
         */
        getMesh(_iMesh: number, _iPrimitive?: number): Promise<Mesh>;
        /**
         * Returns the first {@link MaterialGLTF} with the given material name.
         */
        getMaterial(_name: string): Promise<Material>;
        /**
         * Returns the {@link Material} for the given material index.
         */
        getMaterial(_iMaterial: number): Promise<Material>;
        /**
         * Returns the {@link Texture} for the given texture index.
         */
        getTexture(_iTexture: number): Promise<Texture>;
        toString(): string;
        /**
         * Returns the {@link Node} for the given index.
         */
        private getNodeByIndex;
        /**
        * Returns the {@link ComponentSkeleton} for the given skeleton index.
        */
        private getSkeletonByIndex;
        /**
         * Returns the {@link ComponentCamera} for the given camera index.
         */
        private getCameraByIndex;
        private getIndex;
        private getBufferData;
        private getBufferViewData;
        private getBuffer;
        private getAnimationSequence;
        private toInternInterpolation;
    }
}
declare namespace FudgeCore {
    let shaderSources: {
        [source: string]: string;
    };
}
declare namespace FudgeCore {
    /**
     * Interface to access data from a WebGl shaderprogram.
     * This should always mirror the (static) interface of {@link Shader}. It exposes the static members of Shader in an instance-based way. e.g.:
     * ```typescript
     * let shader: ShaderInterface;
     * ```
     * can take values of type
     * ```typescript
     * typeof Shader | ShaderInteface
     * ```
     */
    interface ShaderInterface {
        define: string[];
        program: WebGLProgram;
        uniforms: {
            [name: string]: WebGLUniformLocation;
        };
        /** Returns the vertex shader source code for the render engine */
        getVertexShaderSource(): string;
        /** Returns the fragment shader source code for the render engine */
        getFragmentShaderSource(): string;
    }
    /**
     * Static superclass for the representation of WebGl shaderprograms.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    abstract class Shader {
        /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
        static readonly baseClass: typeof Shader;
        /** list of all the subclasses derived from this class, if they registered properly*/
        static readonly subclasses: typeof Shader[];
        static define: string[];
        static program: WebGLProgram;
        static uniforms: {
            [name: string]: WebGLUniformLocation;
        };
        /** The type of coat that can be used with this shader to create a material */
        static getCoat(): typeof Coat;
        /** Returns the vertex shader source code for the render engine */
        static getVertexShaderSource(): string;
        /** Returns the fragment shader source code for the render engine */
        static getFragmentShaderSource(): string;
        protected static registerSubclass(_subclass: typeof Shader): number;
        protected static insertDefines(_shader: string, _defines: string[]): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderAmbientOcclusion extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderBloom extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderFlat extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderFlatSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderFlatTextured extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderFlatTexturedSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGizmo extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGizmoTextured extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGouraud extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGouraudSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGouraudTextured extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderGouraudTexturedSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderLit extends Shader {
        static readonly iSubclass: number;
        static define: string[];
    }
}
declare namespace FudgeCore {
    abstract class ShaderLitSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
    }
}
declare namespace FudgeCore {
    abstract class ShaderLitTextured extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderLitTexturedSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderMatCap extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderOutline extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhong extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhongSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhongTextured extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhongTexturedNormals extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhongTexturedNormalsSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPhongTexturedSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPick extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderPickTextured extends Shader {
        static define: string[];
        static getVertexShaderSource(): string;
        static getFragmentShaderSource(): string;
    }
}
declare namespace FudgeCore {
    abstract class ShaderToon extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
    abstract class ShaderToonSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
    abstract class ShaderToonTextured extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
    abstract class ShaderToonTexturedSkin extends Shader {
        static readonly iSubclass: number;
        static define: string[];
        static getCoat(): typeof Coat;
    }
}
declare namespace FudgeCore {
    class TextureDefault extends TextureBase64 {
        static color: TextureBase64;
        static normal: TextureBase64;
        static toon: TextureBase64;
        static iconLight: TextureBase64;
        static iconCamera: TextureBase64;
        static iconAudio: TextureBase64;
        private static getColor;
        private static getNormal;
        private static getToon;
        private static getIconLight;
        private static getIconCamera;
        private static getIconAudio;
    }
}
declare namespace FudgeCore {
    /**
     * Determines the mode a loop runs in
     */
    enum LOOP_MODE {
        /** Loop cycles controlled by window.requestAnimationFrame */
        FRAME_REQUEST = "frameRequest",
        /** Loop cycles controlled by xrSession.requestAnimationFrame */
        FRAME_REQUEST_XR = "frameRequestXR",
        /** Loop cycles with the given framerate in {@link Time.game} */
        TIME_GAME = "timeGame",
        /** Loop cycles with the given framerate in realtime, independent of {@link Time.game} */
        TIME_REAL = "timeReal"
    }
    /**
     * Core loop of a FUDGE application. Initializes automatically and must be started explicitly.
     * It then fires {@link EVENT.LOOP_FRAME} to all added listeners at each frame
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Loop extends EventTargetStatic {
        private static ƒTimeStartGame;
        private static ƒTimeStartReal;
        private static ƒTimeFrameGame;
        private static ƒTimeFrameReal;
        private static ƒTimeFrameStartGame;
        private static ƒTimeFrameStartReal;
        private static ƒTimeLastFrameGameAvg;
        private static ƒTimeLastFrameRealAvg;
        private static ƒFrames;
        private static running;
        private static mode;
        private static idIntervall;
        private static idRequest;
        private static fpsDesired;
        private static framesToAverage;
        private static syncWithAnimationFrame;
        /** The gametime the loop was started, overwritten at each start */
        static get timeStartGame(): number;
        /** The realtime the loop was started, overwritten at each start */
        static get timeStartReal(): number;
        /** The gametime elapsed since the last loop cycle */
        static get timeFrameGame(): number;
        /** The realtime elapsed since the last loop cycle */
        static get timeFrameReal(): number;
        /** The gametime the last loop cycle started*/
        static get timeFrameStartGame(): number;
        /** The realtime the last loop cycle started*/
        static get timeFrameStartReal(): number;
        /** The average number of frames per second in gametime */
        static get fpsGameAverage(): number;
        /** The average number of frames per second in realtime */
        static get fpsRealAverage(): number;
        /** The number of frames triggered so far */
        static get frames(): number;
        /**
         * Starts the loop with the given mode and fps.
         * The default for _mode is FRAME_REQUEST, see {@link LOOP_MODE}, hooking the loop to the browser's animation frame.
         * Is only applicable in TIME-modes.
         * _syncWithAnimationFrame is experimental and only applicable in TIME-modes, deferring the loop-cycle until the next possible animation frame.
         */
        static start(_mode?: LOOP_MODE, _fps?: number, _syncWithAnimationFrame?: boolean): void;
        /**
         * Stops the loop
         */
        static stop(): void;
        /**
         * Continue running the loop
         */
        static continue(): void;
        private static loop;
        private static loopFrame;
        private static loopFrameXR;
        private static loopTime;
    }
}
declare namespace FudgeCore {
    interface TimeUnits {
        hours?: number;
        minutes?: number;
        seconds?: number;
        tenths?: number;
        hundreds?: number;
        thousands?: number;
        fraction?: number;
        asHours?: number;
        asMinutes?: number;
        asSeconds?: number;
    }
    interface Timers extends Object {
        [id: number]: Timer;
    }
    /**
     * Instances of this class generate a timestamp that correlates with the time elapsed since the start of the program but allows for resetting and scaling.
     * Supports {@link Timer}s similar to window.setInterval but with respect to the scaled time.
     * All time values are given in milliseconds
     *
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Time extends EventTargetUnified {
        /** Standard game time starting automatically with the application */
        static readonly game: Time;
        private start;
        private scale;
        private offset;
        private lastCallToElapsed;
        private timers;
        private idTimerAddedLast;
        constructor();
        /**
         * Returns representions of the time given in milliseconds in various formats defined in {@link TimeUnits}
         */
        static getUnits(_milliseconds: number): TimeUnits;
        /**
         * Retrieves the current scaled timestamp of this instance in milliseconds
         */
        get(): number;
        /**
         * Returns the remaining time to the given point of time
         */
        getRemainder(_to: number): number;
        /**
         * (Re-) Sets the timestamp of this instance
         * @param _time The timestamp to represent the current time (default 0.0)
         */
        set(_time?: number): void;
        /**
         * Sets the scaling of this time, allowing for slowmotion (<1) or fastforward (>1)
         * @param _scale The desired scaling (default 1.0)
         */
        setScale(_scale?: number): void;
        /**
         * Retrieves the current scaling of this time
         */
        getScale(): number;
        /**
         * Retrieves the offset of this time
         */
        getOffset(): number;
        /**
         * Retrieves the scaled time in milliseconds passed since the last call to this method
         * Automatically reset at every call to set(...) and setScale(...)
         */
        getElapsedSincePreviousCall(): number;
        /**
         * Returns a Promise<void> to be resolved after the time given. To be used with async/await
         */
        delay(_lapse: number): Promise<void>;
        /**
         * Stops and deletes all {@link Timer}s attached. Should be called before this Time-object leaves scope
         */
        clearAllTimers(): void;
        /**
         * Deletes {@link Timer} found using the internal id of the connected interval-object
         * @param _id
         */
        deleteTimerByItsInternalId(_id: number): void;
        /**
         * Installs a timer at this time object
         * @param _lapse The object-time to elapse between the calls to _callback
         * @param _count The number of calls desired, 0 = Infinite
         * @param _handler The function to call each the given lapse has elapsed
         * @param _arguments Additional parameters to pass to callback function
         */
        setTimer(_lapse: number, _count: number, _handler: TimerHandler, ..._arguments: Object[]): number;
        /**
         * This method is called internally by {@link Time} and {@link Timer} and must not be called otherwise
         */
        addTimer(_timer: Timer): number;
        /**
         * Deletes the timer with the id given by this time object
         */
        deleteTimer(_id: number): void;
        /**
         * Returns a reference to the timer with the given id or null if not found.
         */
        getTimer(_id: number): Timer;
        /**
         * Returns a copy of the list of timers currently installed on this time object
         */
        getTimers(): Timers;
        /**
         * Returns true if there are {@link Timers} installed to this
         */
        hasTimers(): boolean;
        /**
         * Recreates {@link Timer}s when scaling changes
         */
        private rescaleAllTimers;
    }
}
declare namespace FudgeCore {
    /**
     * Defines the signature of handler functions for {@link EventTimer}s, very similar to usual event handler
     */
    type TimerHandler = (_event: EventTimer) => void;
    /**
     * A {@link Timer}-instance internally uses window.setInterval to call a given handler with a given frequency a given number of times,
     * passing an {@link EventTimer}-instance with additional information and given arguments.
     * The frequency scales with the {@link Time}-instance the {@link Timer}-instance is attached to.
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Timer {
        active: boolean;
        count: number;
        private handler;
        private time;
        private elapse;
        private event;
        private timeoutReal;
        private idWindow;
        /**
         * Creates a {@link Timer} instance.
         * @param _time The {@link Time} instance, the timer attaches to
         * @param _elapse The time in milliseconds to elapse, to the next call of _handler, measured in _time
         * @param _count The desired number of calls to _handler, Timer deinstalls automatically after last call. Passing 0 invokes infinite calls
         * @param _handler The {@link TimerHandler} instance to call
         * @param _arguments Additional arguments to pass to _handler
         *
         * TODO: for proper handling and deletion, use Time.setTimer instead of instantiating timers yourself.
         */
        constructor(_time: Time, _elapse: number, _count: number, _handler: TimerHandler, ..._arguments: Object[]);
        /**
         * Returns the window-id of the timer, which was returned by setInterval
         */
        get id(): number;
        /**
         * Returns the time-intervall for calls to the handler
         */
        get lapse(): number;
        /**
         * Attaches a copy of this at its current state to the same {@link Time}-instance. Used internally when rescaling {@link Time}
         */
        installCopy(): Timer;
        /**
         * Clears the timer, removing it from the interval-timers handled by window
         */
        clear(): void;
    }
}
