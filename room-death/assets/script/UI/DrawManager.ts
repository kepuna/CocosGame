import EventManager from "../../runtime/EventManager";
import { CONTROLLER_ENUM, EVENT_ENUM } from "../enums/Enums";

const { ccclass, property, } = cc._decorator;

enum FADE_STATE_ENUM {
    IDLE = 'IDLE', // 什么也不做
    FADE_IN = 'FADE_IN',
    FADE_OUT = 'FADE_OUT',
}

export const DEFAULT_DURATION = 200

@ccclass
export class DrawManager extends cc.Component {
    private ctx: cc.Graphics
    private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
    private oldTime: number = 0
    private duration: number = DEFAULT_DURATION // 渐隐渐现动画时长
    private fadeResolve: (value: PromiseLike<null>) => void //  fadeResolve 类型是一个函数, 接收 PromiseLike类型的参数
    init() {
        // 添加 cc.Graphics 组件
        this.ctx = this.node.getComponent(cc.Graphics)
        if (!this.ctx) {
            this.ctx = this.node.addComponent(cc.Graphics)
        }
        this.setAlpha(1)
    }

    setAlpha(percent: number) {
        this.ctx.clear()
        this.ctx.rect(0, 0, cc.view.getVisibleSize().width, cc.view.getVisibleSize().height)
        this.ctx.fillColor = new cc.Color(0, 0, 0, 255 * percent)
        this.ctx.fill();
    }
    update() {
        const percent = (cc.director.getTotalTime() - this.oldTime) / this.duration
        // console.log(percent)
        // 判断当前的状态
        switch (this.state) {
            case FADE_STATE_ENUM.FADE_IN:
                if (percent < 1) {
                    this.setAlpha(percent)
                } else {
                    this.setAlpha(1)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeResolve(null)
                }
                break;
            case FADE_STATE_ENUM.FADE_OUT:
                if (percent < 1) {
                    this.setAlpha(1 - percent)
                } else {
                    this.setAlpha(0)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeResolve(null)
                }
                break;

            default:
                break;
        }
    }

    fadeIn(duration: number = DEFAULT_DURATION) {
        this.setAlpha(0)
        this.duration = duration
        this.state = FADE_STATE_ENUM.FADE_IN
        this.oldTime = cc.director.getTotalTime()

        return new Promise((resolve) => {
            this.fadeResolve = resolve
        })
    }

    fadeOut(duration: number = DEFAULT_DURATION) {
        this.setAlpha(1)
        this.duration = duration
        this.state = FADE_STATE_ENUM.FADE_OUT
        this.oldTime = cc.director.getTotalTime()
        return new Promise((resolve) => {
            this.fadeResolve = resolve
        })
    }

    mask() {
        this.setAlpha(1)
        return new Promise((resolve) => {
            setTimeout(resolve, DEFAULT_DURATION)
        })
    }

}
