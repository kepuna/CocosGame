import { randomByLength } from "../Utils/Utils";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from "../script/enums/Enums";
import { IEntity } from "../script/levels/Levels";
import { PlayerStateMachine } from "../script/player/PlayerStateMachine";
import { TILE_HEIGHT, TILE_WIDTH } from "../script/tile/TileManager";
import { StateMachine } from "./StateMachine";
import { SubStateMachine } from "./SubStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EntityManager extends cc.Component {
    // 实体唯一标识
    public id: string = randomByLength(12)
    // 实体x，y 
    public x: number = 0
    public y: number = 0
    // 实体类型：PLAYER、SKELETON_xxx、DOOR、SPIKES_xxx、BURST、SMOKE...
    public type: ENTITY_TYPE_ENUM
    // 状态机（负责管理和切换状态）
    public fsm: StateMachine


    // 实体方向：TOP、BOTTOM、LEFT、RIGHT 
    private _direction: DIRECTION_ENUM
    // 实体状态：IDLE、TURN_xxx、BLOCK_xxx、ATTACK、DEATH ...
    private _state: ENTITY_STATE_ENUM

    async init(params: IEntity) {
        // 添加sprite组件
        this.addSpriteComponent()
        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.direction = params.direction
        this.state = params.state
    }
    onDestroy() { }

    get direction() {
        return this._direction
    }
    set direction(newDirection) {
        if (newDirection) {
            this._direction = newDirection
            this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[newDirection])
        }
    }

    get state() {
        return this._state
    }
    set state(newState) {
        if (newState) {
            this._state = newState
            this.fsm.setParams(this._state, true)
        }
    }

    addSpriteComponent() {
        const sprite = this.node.addComponent(cc.Sprite)
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
        sprite.node.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, -(this.y * TILE_HEIGHT))
    }
}

