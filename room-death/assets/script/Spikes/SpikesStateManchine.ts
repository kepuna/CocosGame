

import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from "../enums/Enums";
import SpikesFourSubStateMachine from "./SpikesFourSubStateMachine";
import SpikesManager from "./SpikesManager";
import SpikesOneSubStateMachine from "./SpikesOneSubStateMachine";
import SpikesThreeSubStateMachine from "./SpikesThreeSubStateMachine";
import SpikesTwoSubStateMachine from "./SpikesTwoSubStateMachine";


const { ccclass, property } = cc._decorator;

@ccclass
export class SpikesStateManchine extends StateMachine {

    async init() {
        // animation 组件
        this.animationComponent = this.addComponent(cc.Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()
        await Promise.all(this.waitingList)
    }
    initParams() {
        // 两个参数： 当前点数 和 总点数
        this.params.set(PARAMS_NAME_ENUM.SKIKES_CURRENT_COUNT, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.SKIKES_TOTAL_COUNT, getInitParamsNumber())
    }
    initStateMachine() {
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
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
            const totalCount = this.getParams(PARAMS_NAME_ENUM.SKIKES_TOTAL_COUNT)
            if (totalCount) {
                if ((totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && clipName.includes('spikesone/two')) ||
                    (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO && clipName.includes('spikesone/three')) ||
                    (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE && clipName.includes('spikesone/four')) ||
                    (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR && clipName.includes('spikesone/five'))) {
                        this.node.getComponent(SpikesManager).backZero()
                }
            }
        })
    }

    run() {
        // 拿到当前地刺 总点数
        // 根据 totalCount 决定子状态是什么
        const totalCount = this.getParams(PARAMS_NAME_ENUM.SKIKES_TOTAL_COUNT)
        // console.log(totalCount, this.currentState)
        switch (this.currentState) {
            // 如果当前状态是 ONE状态
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):

                if (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                } else if (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
                } else if (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
                } else if (totalCount === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
                }
                else {
                    // 目的是触发 currentState的set方法，才能触发子状态机的run方法
                    this.currentState = this.currentState
                }
                break;
            default:
                this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                break;
        }
    }
}
