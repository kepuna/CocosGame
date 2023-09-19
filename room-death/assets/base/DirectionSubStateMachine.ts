/*
 * @Author       : jiajung
 * @Version      : V1.0
 * @Date         : 2023-09-01 15:12:36
 * @Description  : 
 */

import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../script/enums/Enums"
import { SubStateMachine } from "./SubStateMachine"

export default class DirectionSubStateMachine extends SubStateMachine {
    run(): void {
        // 根据方向参数来判断，当前子状态机应该使用哪个状态
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }
}