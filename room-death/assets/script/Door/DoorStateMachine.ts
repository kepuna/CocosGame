
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../../base/StateMachine";
import { PARAMS_NAME_ENUM } from "../enums/Enums";
import DeathSubStateMachine from "./DeathSubStateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";



const { ccclass, property } = cc._decorator;

@ccclass
export class DoorStateMachine extends StateMachine {

    async init() {
        // animation 组件
        // this.animationComponent = this.addComponent(cc.Animation)
        super.init()
        // 初始化参数
        this.initParams()
        // 初始化状态机
        this.initStateMachine()

        await Promise.all(this.waitingList)
    }
    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }
    initStateMachine() {
        // 门只有2个状态
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
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
                    this.currentState = this.currentState // 目的是触发 currentState的set方法，才能触发子状态机的run方法
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                break;
        }
    }
}
