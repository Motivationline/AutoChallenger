namespace Script {
    import ƒ = FudgeCore;
    export interface VisualizeEntity {
        //idle(): Promise<void>;
        attack(_ev: FightEvent): Promise<void>;
        move(_move: MoveData): Promise<void>;
        getHurt(_ev: FightEvent): Promise<void>;
        resist(): Promise<void>;
        useSpell(_ev: FightEvent): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): void;
    }

    export class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {

        private entity: IEntity;
        private cmpAnimation: ƒ.ComponentAnimation;
        private defaultAnimation: ƒ.Animation;
        //private grid: VisualizeGridNull;
        // TODO: remove this again when it's not needed anymore.
        private tmpText: ƒ.ComponentText;

        constructor(_entity: IEntity) {
            super("entity");
            this.entity = _entity;
            //get the correct
            console.log("ID: " + this.entity.id);
            this.loadModel(this.entity.id)

            // const entityMesh = new ƒ.ComponentMesh(VisualizeEntity.mesh);
            // const entityMat = new ƒ.ComponentMaterial(VisualizeEntity.material);
            // this.addComponent(entityMesh);
            // this.addComponent(entityMat);
            // entityMesh.mtxPivot.scale(ƒ.Vector3.ONE(this.size));
            // entityMat.clrPrimary.setCSS("white");

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = ƒ.Vector3.ONE(1.0);
            this.addEventListeners();
        }

        // async idle(): Promise<void> {
        //     // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
        //     await waitMS(200);
        // }

        //#region Do something
        async attack(_ev: FightEvent): Promise<void> {
            console.log("entity visualizer: attack", { attacker: this.entity, attack: _ev.trigger, targets: _ev.detail.targets });
            await this.playAnimationIfPossible(ANIMATION.ATTACK);
        }

        async move(/*_move: MoveData*/): Promise<void> {
            //this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3());
            console.log("entity visualizer: move");
            await this.playAnimationIfPossible(ANIMATION.MOVE);
        }

        async useSpell(_ev: FightEvent): Promise<void> {
            console.log("entity visualizer: spell", { caster: this.entity, spell: _ev.trigger, targets: _ev.detail?.targets });
            await this.playAnimationIfPossible(ANIMATION.SPELL);
        }
        //#endregion

        //#region Something happened
        async getHurt(_ev: FightEvent): Promise<void> {
            await this.playAnimationIfPossible(ANIMATION.HURT);
        }
        async getAffected(_ev: FightEvent): Promise<void> {
            await this.playAnimationIfPossible(ANIMATION.AFFECTED);
        }
        async die(_ev: FightEvent): Promise<void> {
            await this.playAnimationIfPossible(ANIMATION.DIE);
            // TODO: this is a temp, should probably better be done in the visualizer above this, not this one.
            // this.removeAllChildren();
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("hotpink");
            // await waitMS(1000);
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
        }
        async resist(): Promise<void> {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("gray");
            console.log("entity visualizer null: resisting", this.entity);
            await waitMS(200);
        }
        //#endregion
        async showPreview(): Promise<void> {
            console.log("entity visualizer null: show preview", this.entity);
            await waitMS(200);
        }

        async hidePreview(): Promise<void> {
            console.log("entity visualizer null: hide preview", this.entity);
            await waitMS(200);
        }

        async updateVisuals(): Promise<void> {
            //TODO: remove the Entity from Scene Graph if this is an enemy, Player should not be removed just repositioned in the next run
            // this.removeAllChildren();
            // console.log("entity visualizer null: updateVisuals", this.entity);
            // await waitMS(200);
        }


        async loadModel(_id: string) {
            let model: ƒ.Node = new ƒ.Node(_id);
            let original = DataLink.linkedNodes.get(_id);
            //if the model is not found use a placeholder
            try {
                await model.deserialize(original.serialize());
                this.cmpAnimation = model.getChild(0)?.getComponent(ƒ.ComponentAnimation);
                this.defaultAnimation = this.cmpAnimation?.animation;
            } catch (error) {
                model = this.givePlaceholderPls();
                console.warn(`Model with ID: ${_id} not found, using placeholder instead 👉👈`);
            }
            this.addChild(model);

            // TODO: this is a temp vis for all the info, we need to remove this
            let entityInfoGraph = DataLink.linkedNodes.get("entityInfo");
            let textNode: ƒ.Node = new ƒ.Node("text");
            await textNode.deserialize(entityInfoGraph.serialize());
            this.addChild(textNode);
            this.tmpText = textNode.getComponent(ƒ.ComponentText);
            this.updateTmpText();
        }

        //retuns a placeholder if needed
        givePlaceholderPls(): ƒ.Node {
            let placeholder: ƒ.Node = new ƒ.Node("Placeholder");
            let mesh: ƒ.Mesh = new ƒ.MeshCube("EntityMesh");
            let material: ƒ.Material = new ƒ.Material("EntityMat", ƒ.ShaderLitTextured);
            placeholder.addComponent(new ƒ.ComponentMesh(mesh));
            placeholder.addComponent(new ƒ.ComponentMaterial(material));
            placeholder.addComponent(new ƒ.ComponentTransform());
            return placeholder;
        }

        private async playAnimationIfPossible(_anim: ANIMATION) {
            if (!this.cmpAnimation) return this.showFallbackText(_anim);
            let animation = AnimationLink.linkedAnimations.get(this.entity.id)?.get(_anim);
            if (!animation) return this.showFallbackText(_anim);
            this.cmpAnimation.animation = animation;
            this.cmpAnimation.time = 0;
            console.log({ totalTime: animation.totalTime });
            await waitMS(animation.totalTime);
            this.cmpAnimation.animation = this.defaultAnimation; // TODO: check if we should instead default back to idle or nothing at all

        }
        private async showFallbackText(_text: string) {
            let node = await getCloneNodeFromRegistry(_text);
            if (node) this.addChild(node);
            await waitMS(1000);
            if (node) this.removeChild(node);
        }

        private updateTmpText = () => {
            if (!this.tmpText) return;
            console.log("updateTmpText", this.entity);
            let effectText = "";
            (<Entity>this.entity).activeEffects.forEach((value, type) => { if(value > 0) effectText += `${type}: ${value}\n`});
            effectText += `${this.entity.currentHealth} / ${this.entity.health} ♥️`;
            console.log(effectText);
            this.tmpText.texture.text = effectText;
        }

        // @Björn das Problem ist, dass wenn du es so aufrufst, du `this` verlierst.
        // um das zu fixen musst du eine lambda funktion benutzen, also private updatePosition = () => { this.move() }
        // wie es auch bei eventListener unten gemacht ist. Und der bekommt aktuell ja auch noch jedes Event mit, nicht nur das von der eigenen Entity.
        // In dem Fall kannst du es aber auch einfach in die eventListener/handleEvent Systematik unten mit einbauen, da wird das alles schon behandelt.
        private updatePosition(){
            //await this.move();
        }

        getEntity(): Readonly<IEntity> {
            return this.entity;
        }

        addEventListeners() {
            EventBus.addEventListener(EVENT.FIGHT_ENDED, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_ATTACK, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_HURT, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_AFFECTED, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_DIES, this.eventListener);

            EventBus.addEventListener(EVENT.ENTITY_HURT, this.updateTmpText);
            EventBus.addEventListener(EVENT.ENTITY_AFFECTED, this.updateTmpText);
            EventBus.addEventListener(EVENT.ROUND_END, this.updateTmpText);
            EventBus.addEventListener(EVENT.ROUND_START, this.updateTmpText);

            // @Björn besser EntityMove (ohne d) für die visuelle Darstellung nutzen. denk auch dran den wieder zu entfernen
            EventBus.addEventListener(EVENT.ENTITY_MOVED, this.updatePosition);
        }

        removeEventListeners() {
            EventBus.removeEventListener(EVENT.RUN_END, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_ATTACK, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_HURT, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_AFFECTED, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_DIES, this.eventListener);
        }

        eventListener = async (_ev: FightEvent) => {
            await this.handleEvent(_ev);
        }

        async handleEvent(_ev: FightEvent) {
            if (_ev.cause === this.entity) {
                // this entity is doing something
                switch (_ev.type) {
                    case EVENT.ENTITY_ATTACK: {
                        await this.attack(_ev);
                        break;
                    }
                    case EVENT.ENTITY_SPELL_BEFORE: {
                        await this.useSpell(_ev);
                        break;
                    }
                    // @Björn hier könntest du die move einbauen
                }
            } else if (_ev.target === this.entity) {
                // this entity is affected by something
                switch (_ev.type) {
                    case EVENT.ENTITY_HURT: {
                        await this.getHurt(_ev);
                        break;
                    }
                    case EVENT.ENTITY_AFFECTED: {
                        await this.getAffected(_ev);
                        break;
                    }
                    case EVENT.ENTITY_DIES: {
                        await this.die(_ev);
                        break;
                    }
                }
            } else {
                // independent events
                switch (_ev.type) {
                    case EVENT.RUN_END: {
                        this.removeEventListeners();
                        break;
                    }
                }
            }
        }
    }
}