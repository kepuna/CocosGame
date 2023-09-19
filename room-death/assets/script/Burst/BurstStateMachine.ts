
import State from "../../base/State";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;
const BASE_URL = 'ui/burst'

@ccclass
export class BurstStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(cc.Animation)
        this.initParams()
        this.initStateMachine()
        await Promise.all(this.waitingList)
    }
    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }
    initStateMachine() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
    }

    run() {
//  console.log('BurstStateMachine run------',this.currentState)
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
