
import { SubStateMachine } from "../../base/SubStateMachine";
import { PARAMS_NAME_ENUM, SPIKE_COUNT_MAP_NUMBER_ENUM } from "../enums/Enums";

export default class SpikesSubStateMachine extends SubStateMachine {
    run() { // 实现父类 run方法
        // 拿到 currentCount 的参数值
        const currentCount = this.fsm.getParams(PARAMS_NAME_ENUM.SKIKES_CURRENT_COUNT)
        // console.log('000------',this)
        this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUMBER_ENUM[currentCount as number])
    }
}