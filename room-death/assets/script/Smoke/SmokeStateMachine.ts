

import EntityManager from "../../base/EntityManager";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../enums/Enums";
import DeathSubStateMachine from "./DeathSubStateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";


const { ccclass, property } = cc._decorator;

@ccclass
export class SmokeStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(cc.Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()
        await Promise.all(this.waitingList)
    }
    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }
    initStateMachine() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    }
    initAnimationEvent() {
        this.animationComponent.on(cc.Animation.EventType.FINISHED, () => {
            const clipName = this.animationComponent?.currentClip?.name
            const whiteList = ['idle'] // 白名单
            if (whiteList.some(v => clipName.includes(v))) { // idle状态动画播放完，变为death状态
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.DEATH
            }
        })
    }
    run() {
        // console.log(this.currentState)
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):

                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
                }

                else {
                    // 目的是触发 currentState的set方法，才能触发子状态机的run方法
                    this.currentState = this.currentState
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                break;
        }
    }
}
