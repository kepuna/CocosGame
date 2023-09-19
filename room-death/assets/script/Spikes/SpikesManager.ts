import { randomByLength } from "../../Utils/Utils";
import { StateMachine } from "../../base/StateMachine";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from "../enums/Enums";
import { ISpikes } from "../levels/Levels";
import { TILE_HEIGHT, TILE_WIDTH } from "../tile/TileManager";
import { SpikesStateManchine } from "./SpikesStateManchine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpikesManager extends cc.Component {
    id: string = randomByLength(12)
    x: number = 0
    y: number = 0
    // 状态机
    fsm: StateMachine

    private _count: number // 当前点数
    private _totalCount: number // 总点数
    type: ENTITY_TYPE_ENUM // 地刺的类型

    async init(params: ISpikes) {
        // 添加sprite组件
        const sprite = this.node.addComponent(cc.Sprite)
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
        sprite.node.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
        // 状态机
        this.fsm = this.addComponent(SpikesStateManchine)
        await this.fsm.init()

        this.x = params.x
        this.y = params.y
        this.type = params.type
        // 根据 type来决定totalCount
        this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
        this.count = params.count

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
    }

    get count() {
        return this._count
    }
    set count(newCount) {
        this._count = newCount
        // 每次调用 setParams 方法，都会调用到对应fsm的run方法
        // 这里调用的是 SpikesStateManchine 的run方法
        this.fsm.setParams(PARAMS_NAME_ENUM.SKIKES_CURRENT_COUNT, newCount)
    }
    get totalCount() {
        return this._totalCount
    }
    set totalCount(newCount) {
        this._totalCount = newCount
        // 每次调用 setParams 方法，都会调用到对应fsm的run方法
        // 这里调用的是 SpikesStateManchine 的run方法
        this.fsm.setParams(PARAMS_NAME_ENUM.SKIKES_TOTAL_COUNT, newCount)
    }

    onLoop() {
        if (this.count === this.totalCount) {
            this.count = 1
        } else {
            this.count++
        }
        this.onAttack()
    }
    onAttack() {
        if (!DataManager.Instance.player) {
            return
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player
        if (this.x === playerX && this.y === playerY && this.count === this.totalCount) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        }
    }
    backZero() {
        this.count = 0
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, -(this.y * TILE_HEIGHT))
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
    }
}

