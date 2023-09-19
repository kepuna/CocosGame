
import EntityManager from "../../base/EntityManager";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../enums/Enums";
import AttackSubStateMachine from "./AttackSubStateMachine";
import DeathSubStateMachine from "./DeathSubStateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";


const { ccclass, property } = cc._decorator;

@ccclass
export class WoodenSkeletonStateMachine extends StateMachine {

    async init() {
        // animation 组件
        // this.animationComponent = this.addComponent(cc.Animation)
        super.init()
        
        // 初始化参数
        this.initParams()
        // 初始化状态机
        this.initStateMachine()
        // 监听动画
        this.initAnimationEvent()
        await Promise.all(this.waitingList)
    }
    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    }
    initStateMachine() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    }

    initAnimationEvent() {
        // 动画结束的回调
        this.animationComponent.on(cc.Animation.EventType.FINISHED, () => {
            const currentClip = this.animationComponent.currentClip
            if (!currentClip) {
                console.log("Current Clip is Null")
                return
            }
            const clipName = currentClip.name
            const whiteList = ['attack'] // 白名单
            if (whiteList.some(v => clipName.includes(v))) {
                // 回到 idle状态
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }
    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):

                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK) // 攻击
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
                }

                else {
                    this.currentState = this.currentState // 目的是触发 currentState的set方法，才能触发子状态机的run方法
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                break;
        }
    }
}
