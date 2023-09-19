/*
 * @Author       : jiajung
 * @Version      : V1.0
 * @Date         : 2023-09-01 15:12:36
 * @Description  : 
 */

import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import State, { ANIMATION_SPEED } from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { DIRECTION_ENUM, SHAKE_TYPE_ENUM } from "../enums/Enums";

const BASE_URL = 'ui/player/attack'
export default class AttackSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(
            DIRECTION_ENUM.TOP,
            new State(fsm, `${BASE_URL}/top`, cc.WrapMode.Normal, ANIMATION_SPEED, [{
                frame: ANIMATION_SPEED * 4, // 第 四帧时触发事件
                func: 'onAttackShake', // 事件触发时调用的函数名称
                params: [SHAKE_TYPE_ENUM.TOP],
            }]))
        this.stateMachines.set(
            DIRECTION_ENUM.BOTTOM,
            new State(fsm, `${BASE_URL}/bottom`, cc.WrapMode.Normal, ANIMATION_SPEED, [
                {
                    frame: ANIMATION_SPEED * 4,
                    func: 'onAttackShake',
                    params: [SHAKE_TYPE_ENUM.BOTTOM],
                },
            ]),
        )
        this.stateMachines.set(
            DIRECTION_ENUM.LEFT,
            new State(fsm, `${BASE_URL}/left`, cc.WrapMode.Normal, ANIMATION_SPEED, [
                {
                    frame: ANIMATION_SPEED * 4,
                    func: 'onAttackShake', // 事件触发时调用的函数名称
                    params: [SHAKE_TYPE_ENUM.LEFT],
                },
            ]),
        )
        this.stateMachines.set(
            DIRECTION_ENUM.RIGHT,
            new State(fsm, `${BASE_URL}/right`, cc.WrapMode.Normal, ANIMATION_SPEED, [
                {
                    frame: ANIMATION_SPEED * 4,
                    func: 'onAttackShake',
                    params: [SHAKE_TYPE_ENUM.RIGHT],
                },
            ]),
        )
    }
}