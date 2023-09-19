import EnemyManager from "../../base/EnemyManager";
import EntityManager from "../../base/EntityManager";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../enums/Enums";
import { IEntity } from "../levels/Levels";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WoodenSkeletonManager extends EnemyManager {

    private readonly speed = 1 / 10 // 移动速度

    async init(params: IEntity) {
 
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()
        super.init(params)

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
        this.onChangeDirection(true)
    }
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    }

    onAttack() {
        if (!DataManager.Instance.player || this.state === ENTITY_STATE_ENUM.DEATH) {
            return
        }
        const { targetX: playerX, targetY: playerY, state: playerState } = DataManager.Instance.player
        if ((this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
            (this.y === playerY && Math.abs(this.x - playerX) <= 1) &&
            (playerState !== ENTITY_STATE_ENUM.DEATH) &&
            (playerState !== ENTITY_STATE_ENUM.AIRDEATH)) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            // 通知玩家检测是否到死亡状态 (这里简单处理，通知玩家地面死)
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE
        }
    }
}

