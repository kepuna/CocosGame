import { FSM_PARAMS_TYPE_ENUM } from "../script/enums/Enums";
import State from "./State";
import { SubStateMachine } from "./SubStateMachine";

const { ccclass, property } = cc._decorator;

type ParamsValueType = boolean | number

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: ParamsValueType
}
export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false
    }
}

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0
    }
}

@ccclass
export abstract class StateMachine extends cc.Component {

    // 当前State
    private _currentState: State | SubStateMachine = null
    // 有限状态机 参数列表
    params: Map<string, IParamsValue> = new Map()
    // 状态机列表
    stateMachines: Map<string, State | SubStateMachine> = new Map()
    // 动画组件
    animationComponent: cc.Animation = null
    // Promise list
    waitingList: Array<Promise<cc.SpriteFrame[]>> = []

    private _animationComponent: cc.Animation = null

    // get animationComponent() {
    //     if (this._animationComponent) {
    //         return this._animationComponent
    //     }
    //     return this.node.addComponent(cc.Animation)
    // }

    init() {
        // animation 组件
        this.animationComponent = this.addComponent(cc.Animation)
    }

    getParams(paramName: string) {
        if (this.params.has(paramName)) {
            return this.params.get(paramName).value
        }
    }
    setParams(paramName: string, value: ParamsValueType) {
        // console.log(this,paramName)
        if (this.params.has(paramName)) {
            this.params.get(paramName).value = value

            this.run()
            this.resetTrigger()
        }
    }

    // 重置触发器
    resetTrigger() {
        for (const [_, pValue] of this.params) {
            if (pValue.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
                pValue.value = false
            }
        }
    }

    get currentState() {
        return this._currentState
    }
    set currentState(newState) {
        this._currentState = newState
        this.currentState.run()
    }
    // 交给每个子类去实现
    // abstract init(): void
    abstract run(): void
}
