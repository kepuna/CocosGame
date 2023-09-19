import EntityManager from "../../base/EntityManager";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../enums/Enums";
import { IEntity } from "../levels/Levels";
import { TILE_HEIGHT, TILE_WIDTH } from "../tile/TileManager";
import { BurstStateMachine } from "./BurstStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BurstManager extends EntityManager {

    async init(params: IEntity) {
        this.fsm = this.addComponent(BurstStateMachine)
        await this.fsm.init()
        super.init(params)
        this.node.setContentSize(TILE_WIDTH, TILE_HEIGHT)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
    }
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
    }

    onBurst() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
            return
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player
        if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK

        } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH
            // 地裂切换到死亡状态时，震动一下
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
            if (this.x === playerX && this.y === playerY) {
                EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
            }
        }
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
    }
}

