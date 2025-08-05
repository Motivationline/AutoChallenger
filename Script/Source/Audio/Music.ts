namespace Script {
    import ƒ = FudgeCore;

    enum MUSIC_TITLE {
        COMBAT_INTRO,
        COMBAT_PICKUP,
        COMBAT_LOOP,
        SHOP_LOOP,
        TITLE_INTRO,
        TITLE_LOOP,
    }

    enum MUSIC {
        COMBAT,
        SHOP,
        TITLE,
    }

    export class MusicManager {
        sounds = new Map<MUSIC_TITLE, ComponentAudioMixed>(
            [
                [MUSIC_TITLE.COMBAT_INTRO, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Intro.opus"), false, false, undefined, AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.COMBAT_LOOP, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Loop.opus"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.COMBAT_PICKUP, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Pickup.opus"), false, false, undefined, AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.SHOP_LOOP, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Shop/Shop_Loop.opus"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.TITLE_INTRO, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Title/TitleMenu_Intro.opus"), false, false, undefined, AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.TITLE_LOOP, new ComponentAudioMixed(new ƒ.Audio("Assets/Music/Title/TitleMenu_Loop.opus"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
            ]
        )
        constructor() {
            for (let cmp of this.sounds.values()) [
                cmp.connect(true)
            ]

            this.addEventListeners();
            this.setupIntros();
            this.changeMusic(MUSIC.TITLE);
        }

        private setupIntros() {
            this.sounds.get(MUSIC_TITLE.TITLE_INTRO).addEventListener(ƒ.EVENT_AUDIO.ENDED, () => {
                if (this.activeMusic === MUSIC.TITLE) {
                    this.playTitle(MUSIC_TITLE.TITLE_LOOP);
                }
            });
            this.sounds.get(MUSIC_TITLE.COMBAT_INTRO).addEventListener(ƒ.EVENT_AUDIO.ENDED, () => {
                if (this.activeMusic === MUSIC.COMBAT) {
                    this.playTitle(MUSIC_TITLE.COMBAT_LOOP);
                    this.sounds.get(MUSIC_TITLE.SHOP_LOOP).play(true);
                    this.sounds.get(MUSIC_TITLE.SHOP_LOOP).volume = 0;
                }
            });
            // this.sounds.get(MUSIC_TITLE.COMBAT_PICKUP).addEventListener(ƒ.EVENT_AUDIO.ENDED, () => {
            //     if (this.activeMusic === MUSIC.COMBAT) {
            //         this.playTitle(MUSIC_TITLE.COMBAT_LOOP);
            //     }
            // });

        }

        activeMusic: MUSIC;
        activeComponent: ComponentAudioMixed;
        private changeMusic(_music: MUSIC) {
            if (this.activeMusic === _music) return;

            switch (_music) {
                case MUSIC.COMBAT: {
                    if (this.activeMusic === MUSIC.TITLE) {
                        this.playTitle(MUSIC_TITLE.COMBAT_INTRO, 1);
                    } else if (this.activeMusic === MUSIC.SHOP) {
                        this.sounds.get(MUSIC_TITLE.SHOP_LOOP).fadeTo(0, 1);
                        this.sounds.get(MUSIC_TITLE.COMBAT_PICKUP).play(true);
                        this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).volume = 0;
                        this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).play(true);
                        this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).fadeTo(1, 4);
                    }
                    break;
                }
                case MUSIC.SHOP: {
                    if (this.activeMusic !== MUSIC.COMBAT) return;
                    this.activeComponent.fadeTo(0, 1);
                    this.sounds.get(MUSIC_TITLE.SHOP_LOOP).fadeTo(1, 1);
                    break;
                }
                case MUSIC.TITLE: {
                    this.playTitle(MUSIC_TITLE.TITLE_INTRO, 1);
                    break;
                }
            }

            this.activeMusic = _music;
        }

        private playTitle(_title: MUSIC_TITLE, _fadeTime: number = 0.01) {
            console.log("play title", _title, this.activeComponent, _fadeTime);
            const cmp = this.sounds.get(_title);
            if (!cmp) return;
            cmp.play(true);
            this.activeComponent?.fadeTo(0, _fadeTime);
            cmp.volume = 0;
            cmp.fadeTo(1, _fadeTime);
            this.activeComponent = cmp;
        }

        addEventListeners() {
            EventBus.addEventListener(EVENT.RUN_PREPARE, () => { this.changeMusic(MUSIC.COMBAT) });
            EventBus.addEventListener(EVENT.SHOP_OPEN, () => { this.changeMusic(MUSIC.SHOP) });
            EventBus.addEventListener(EVENT.SHOP_CLOSE, () => { this.changeMusic(MUSIC.COMBAT) });
            EventBus.addEventListener(EVENT.RUN_END, () => { this.changeMusic(MUSIC.TITLE) });
        }
    }
}