import EntityManager from "../../base/EntityManager";
import State from "../../base/State";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from "../enums/Enums";
import AirDeathSubStateMachine from "./AirDeathSubStateMachine";
import AttackSubStateMachine from "./AttackSubStateMachine";
import BlockFrontSubStateMachine from "./BlockFrontSubStateMachine";
import BlockTurnLeftSubStateMachine from "./BlockTurnLeftSubStateMachine";
import DeathSubStateMachine from "./DeathSubStateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";
import TurnLeftSubStateMachine from "./TurnLeftSubStateMachine";
import TurnRightSubStateMachine from "./TurnRightSubStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerStateMachine extends StateMachine {

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
        this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCK_FRONT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger()) // 攻击
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger()) // 地面死
        this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger()) // 地面死
    }
    initStateMachine() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnRightSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_FRONT, new BlockFrontSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, new BlockTurnLeftSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this))
    }

    initAnimationEvent() {
        // console.log("-----", this.animationComponent)
        // 动画结束的回调
        this.animationComponent.on(cc.Animation.EventType.FINISHED, () => {
            const currentClip = this.animationComponent.currentClip
            if (!currentClip) {
                console.log("Current Clip is Null")
                return
            }
            const clipName = currentClip.name
            const whiteList = ['block', 'turn', 'attack'] // 白名单
            if (whiteList.some(v => clipName.includes(v))) {
                // this.setParams(PARAMS_NAME_ENUM.IDLE, true) 
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }
    run() {
        switch (this.currentState) {

            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
            case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):

                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_FRONT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT)
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT)
                } else if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
                } else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
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
