/*
 * 1、需要知道 animationClip
 * 2、需要播放动画的能力
 */

import { sortSpriteFrame } from "../Utils/Utils";
import ResourceManager from "../runtime/ResourceManager";
import { StateMachine } from "./StateMachine";

const SECOND_FRAMES = 8  // 每秒帧数
export const ANIMATION_SPEED = 1 / SECOND_FRAMES

export interface IEvent {
    frame: number;
    func: string;
    params: string[];
}

export default class State {
    private animationClip: cc.AnimationClip = null;
    constructor(
        private fsm: StateMachine,
        private path: string,
        private wrapMode: cc.WrapMode = cc.WrapMode.Normal,
        private animationSpeed: number = ANIMATION_SPEED,
        private events: Array<IEvent> = []) {
        this.init()
    }
    async init() {
        const promise = ResourceManager.Instance.loadPlist(this.path)
        // console.log(promise)
        this.fsm.waitingList.push(promise)
        const spriteFrames = await promise

        if (spriteFrames && spriteFrames.length > 0) {
            // 对 spriteFrames 里的spriteFrame进行排序
            const sortSpriteFrames = sortSpriteFrame(spriteFrames)
            // 为animation组件添加动画剪辑，并设置动画的各个属性。
            // frames 这是一个 SpriteFrame 的数组； 每秒多少帧
            this.animationClip = cc.AnimationClip.createWithSpriteFrames(sortSpriteFrames, SECOND_FRAMES);
            this.animationClip.name = this.path
            this.animationClip.duration = spriteFrames.length * (this.animationSpeed ? this.animationSpeed : ANIMATION_SPEED) // 这个动画剪辑的周期
            this.animationClip.wrapMode = this.wrapMode
            for (const event of this.events) {
                this.animationClip.events.push(event)
            }
        } else {

            // 创建一个空的 SpriteFrame
            const emptySpriteFrame = new cc.SpriteFrame();
            // 创建一个空的动画剪辑
            this.animationClip = cc.AnimationClip.createWithSpriteFrames([emptySpriteFrame], SECOND_FRAMES);
            this.animationClip.name = this.path
            this.animationClip.duration = spriteFrames.length * ANIMATION_SPEED
        }
    }
    // 执行动画
    run() {
        // 判断当前动画的clip的名字，是否等于即将播放的clip的名字
        if (this.fsm.animationComponent?.currentClip?.name === this.animationClip.name) {
            return
        }
        this.fsm.animationComponent.addClip(this.animationClip);
        this.fsm.animationComponent.play(this.path);
    }
}