namespace Script {
    import ƒ = FudgeCore;
    // export interface VisualizeEntity {
    //     //idle(): Promise<void>;
    //     attack(_ev: FightEvent): Promise<void>;
    //     move(_move: MoveData): Promise<void>;
    //     getHurt(_ev: FightEvent): Promise<void>;
    //     resist(): Promise<void>;
    //     useSpell(_ev: FightEvent): Promise<void>;
    //     showPreview(): Promise<void>;
    //     hidePreview(): Promise<void>;
    //     /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
    //     updateVisuals(): void;
    // }

    export class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {

        private entity: IEntity;
        private cmpAnimation: ƒ.ComponentAnimation;
        private cmpAudio: ComponentAudioMixed;
        public defaultAnimation: ƒ.Animation;
        //private grid: VisualizeGridNull;
        // TODO: remove this again when it's not needed anymore.
        private tmpText: HTMLDivElement;
        private tmpTextWrapper: HTMLDivElement;

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

            this.tmpText = createElementAdvanced("div", { classes: ["EntityOverlayInner"], innerHTML: "<span></span>" });
            this.tmpTextWrapper = createElementAdvanced("div", { classes: ["EntityOverlay"] });
            this.tmpTextWrapper.appendChild(this.tmpText);
            this.updateTmpText();

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = ƒ.Vector3.ONE(1.0);

            this.cmpAudio = new ComponentAudioMixed(undefined, false, false, undefined, AUDIO_CHANNEL.SOUNDS);
            this.addComponent(this.cmpAudio);

            this.addEventListener(ƒ.EVENT.NODE_ACTIVATE, this.addText);
            this.addEventListener(ƒ.EVENT.NODE_DEACTIVATE, this.removeText);

            EventBus.addEventListener(EVENT.RUN_END, this.eventListener);
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

        async move(_ev: FightEvent): Promise<void> {
            console.log("entity visualizer: move", { entity: _ev.detail.entity, oldPosition: _ev.detail.oldPosition, position: _ev.detail.position, direction: _ev.detail.direction, step: _ev.detail.step });
            await this.playAnimationIfPossible(ANIMATION.MOVE);
        }

        async useSpell(_ev: FightEvent): Promise<void> {
            console.log("entity visualizer: spell", { caster: this.entity, spell: _ev.trigger, targets: _ev.detail?.targets });
            await this.playAnimationIfPossible(ANIMATION.SPELL);
        }
        //#endregion

        //#region Something happened
        async getHurt(_ev: FightEvent): Promise<void> {
            this.showDamageNumber(_ev.detail.amount, _ev.detail.crit);
            await this.playAnimationIfPossible(ANIMATION.HURT);
        }
        async showDamageNumber(_amount: number, _crit: boolean, _heal: boolean = false) {
            const pos = viewport.pointWorldToClient(ƒ.Vector3.SUM(this.mtxWorld.translation, ƒ.Vector3.Z(0.0)));
            const element = createElementAdvanced("div", {
                classes: ["DamageNumber", _crit ? "Critical" : "Normal", _heal ? "heal" : "noheal", _amount === 0 ? "zero" : "nozero"], innerHTML: `${_amount}`,
                attributes: [["style", `left: ${pos.x}px; top: ${pos.y}px; --random: ${Math.random() * 2 - 1}`]]
            });

            document.getElementById("GameOverlayInfos").appendChild(element);
            setTimeout(() => { element.remove() }, 1200);
        }
        async getAffected(_ev: FightEvent): Promise<void> {
            await this.playAnimationIfPossible(ANIMATION.AFFECTED);
        }
        async getHealed(_ev: FightEvent): Promise<void> {
            this.showDamageNumber(_ev.detail.level, false, true);
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

            const pick = new PickSphere();
            pick.radius = 0.5;
            this.addComponent(pick);
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

        public async playAnimationIfPossible(_anim: ANIMATION | ƒ.Animation) {
            let animation: ƒ.Animation;
            let audio: ƒ.Audio;
            if (typeof _anim === "string") {
                if (!this.cmpAnimation) return this.showFallbackText(_anim);
                animation = AnimationLink.linkedAnimations.get(this.entity.id)?.get(_anim);
                if (!animation && this.entity.id.includes("Eumling")) animation = AnimationLink.linkedAnimations.get("defaultEumling")?.get(_anim);
                if (!animation) return this.showFallbackText(_anim);
                audio = chooseRandomElementsFromArray(AnimationLink.linkedAudio.get(this.entity.id)?.get(_anim), 1)[0];
                if (!audio && this.entity.id.includes("Eumling")) audio = chooseRandomElementsFromArray(AnimationLink.linkedAudio.get("defaultEumling")?.get(_anim), 1)[0];
            } else {
                animation = _anim;
            }
            this.cmpAnimation.animation = animation;
            this.cmpAnimation.time = 0;
            if (audio) {
                this.cmpAudio.setAudio(audio);
                this.cmpAudio.play(true);
                this.cmpAudio.loop = false;
            }
            // console.log({ totalTime: animation.totalTime });
            await waitMS(animation.totalTime);
            this.cmpAudio.play(false);
            this.cmpAnimation.animation = this.defaultAnimation; // TODO: check if we should instead default back to idle or nothing at all
            audio = chooseRandomElementsFromArray(AnimationLink.linkedAudio.get(this.entity.id)?.get(ANIMATION.IDLE), 1)[0];
            if (!audio && this.entity.id.includes("Eumling")) audio = chooseRandomElementsFromArray(AnimationLink.linkedAudio.get("defaultEumling")?.get(ANIMATION.IDLE), 1)[0];
            if (audio) {
                this.cmpAudio.setAudio(audio);
                this.cmpAudio.play(true);
                this.cmpAudio.loop = true;
            }
        }
        private async showFallbackText(_text: string) {
            let node = await getCloneNodeFromRegistry(_text);
            if (node) this.addChild(node);
            await waitMS(1000);
            if (node) this.removeChild(node);
        }

        static typeToName = new Map([
            [SPELL_TYPE.SHIELD, "IconDefenseUp.png"],
            [SPELL_TYPE.MIRROR, "IconSpiegel.png"],
            [SPELL_TYPE.THORNS, "IconDornen.png"],
            [SPELL_TYPE.VULNERABLE, "IconDefenseDown.png"],
            [SPELL_TYPE.SHIELD, "IconDefenseUp.png"],
            [SPELL_TYPE.STUN, "IconStun.png"],
            [SPELL_TYPE.UNTARGETABLE, "IconUntargetable.png"],
        ])
        textUpdater: number;
        public updateTmpText = () => {
            if (!this.tmpText) return;
            let effectObjects: HTMLElement[] = [];
            let index = 0;
            (<Entity>this.entity).activeEffects.forEach((value, type) => {
                if (value <= 0) return;
                effectObjects.push(createElementAdvanced("img", { attributes: [["src", `./Assets/UIElemente/InGameUI/${VisualizeEntity.typeToName.get(type)}`], ["alt", type], ["style", `--index: ${index++}`]] }))
            });
            effectObjects.push(createElementAdvanced("div", { innerHTML: `<span>${this.entity.currentHealth} / ${this.entity.health}</span>` }));
            this.tmpText.replaceChildren(...effectObjects);

            const pos = viewport.pointWorldToClient(ƒ.Vector3.SUM(this.mtxWorld.translation, ƒ.Vector3.Z(0.4)));
            this.tmpTextWrapper.style.left = pos.x + "px";
            this.tmpTextWrapper.style.top = pos.y + "px";
            this.textUpdater = requestAnimationFrame(this.updateTmpText);
        }

        // textUpdater: number;
        private addText = () => {
            document.getElementById("GameOverlayInfos").appendChild(this.tmpTextWrapper);
            requestAnimationFrame(this.updateTmpText);
        }
        private removeText = () => {
            this.tmpTextWrapper.remove();
            cancelAnimationFrame(this.textUpdater);
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
            EventBus.addEventListener(EVENT.ENTITY_HEALED, this.eventListener);
            EventBus.addEventListener(EVENT.ENTITY_DIES, this.eventListener);

            EventBus.addEventListener(EVENT.ENTITY_HURT, this.updateTmpText);
            EventBus.addEventListener(EVENT.ENTITY_AFFECTED, this.updateTmpText);
            EventBus.addEventListener(EVENT.ROUND_END, this.updateTmpText);
            EventBus.addEventListener(EVENT.ROUND_START, this.updateTmpText);
            EventBus.addEventListener(EVENT.ENTITY_MOVE, this.eventListener);
            EventBus.addEventListener(EVENT.EUMLING_LEVELUP, this.updateTmpText);
        }

        removeEventListeners() {
            EventBus.removeEventListener(EVENT.ENTITY_ATTACK, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_HURT, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_AFFECTED, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_DIES, this.eventListener);
            EventBus.removeEventListener(EVENT.ENTITY_MOVE, this.eventListener);

            EventBus.removeEventListener(EVENT.ENTITY_HURT, this.updateTmpText);
            EventBus.removeEventListener(EVENT.ENTITY_AFFECTED, this.updateTmpText);
            EventBus.removeEventListener(EVENT.ROUND_END, this.updateTmpText);
            EventBus.removeEventListener(EVENT.ROUND_START, this.updateTmpText);
            EventBus.removeEventListener(EVENT.EUMLING_LEVELUP, this.updateTmpText);
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
                    case EVENT.ENTITY_MOVE: {
                        await this.move(_ev)
                        break;
                    }
                }
            }
            if (_ev.target === this.entity) {
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
                    case EVENT.ENTITY_HEALED: {
                        await this.getHealed(_ev);
                        break;
                    }
                    case EVENT.ENTITY_DIES: {
                        await this.die(_ev);
                        break;
                    }
                }
            }
            // independent events
            switch (_ev.type) {
                case EVENT.RUN_END: {
                    this.removeEventListeners();
                    this.removeEventListener(ƒ.EVENT.NODE_ACTIVATE, this.addText);
                    this.removeEventListener(ƒ.EVENT.NODE_DEACTIVATE, this.removeText);
                    EventBus.removeEventListener(EVENT.RUN_END, this.eventListener);
                    break;
                }
                case EVENT.FIGHT_ENDED: {
                    this.removeEventListeners();
                    break;
                }
            }

            this.updateTmpText();
        }
    }
}