import EventManager from "../../runtime/EventManager";
import { EVENT_ENUM, SHAKE_TYPE_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export class ShakeManager extends cc.Component {
    private isShaking: boolean = false
    private oldTime: number = 0
    private oldPositon: { x: number, y: number } = { x: 0, y: 0 }
    private shakeType: SHAKE_TYPE_ENUM

    onLoad() {
        // 监听屏幕震动事件
        EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
    }

    onShake(type: SHAKE_TYPE_ENUM) {
        if (this.isShaking) {
            return
        }
        this.shakeType = type
        this.oldTime = cc.director.getTotalTime()
        this.isShaking = true
        // 震动结束之后，需要回到原位置，所以需要保存下原位置
        this.oldPositon.x = this.node.position.x
        this.oldPositon.y = this.node.position.y
    }

    stop() {
        this.isShaking = false
    }

    protected update(dt: number): void {
        if (this.isShaking) {
            const shakeAmount = 16//1.6 //振幅
            const duration = 200 //持续时间
            const frequency = 12 //频率
            const currentSecond = (cc.director.getTotalTime() - this.oldTime) / 1000 //当前时间
            const totalSecond = duration / 1000 //总时间
            const offset = shakeAmount * Math.sin(frequency * Math.PI * currentSecond) // 偏移
            // 震动偏移
            if (this.shakeType === SHAKE_TYPE_ENUM.TOP) {
                this.node.setPosition(this.oldPositon.x, this.oldPositon.y - offset)
            } else if (this.shakeType === SHAKE_TYPE_ENUM.BOTTOM) {
                this.node.setPosition(this.oldPositon.x, this.oldPositon.y + offset)
            } else if (this.shakeType === SHAKE_TYPE_ENUM.LEFT) {
                this.node.setPosition(this.oldPositon.x - offset, this.oldPositon.y)
            } else if (this.shakeType === SHAKE_TYPE_ENUM.RIGHT) {
                this.node.setPosition(this.oldPositon.x + offset, this.oldPositon.y)
            }
            if (currentSecond > totalSecond) {
                this.isShaking = false
                this.node.setPosition(this.oldPositon.x, this.oldPositon.y)
            }
        }
    }
}

