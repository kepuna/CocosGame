import EntityManager from "../../base/EntityManager";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../enums/Enums";
import { IEntity } from "../levels/Levels";
import { DoorStateMachine } from "./DoorStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DoorManager extends EntityManager {

    private readonly speed = 1 / 10 // 移动速度

    async init(params: IEntity) {
        this.fsm = this.addComponent(DoorStateMachine)
        await this.fsm.init()
        super.init(params)
        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
    }
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
    }

    onOpen() {
        if (DataManager.Instance.enemies.every(enmey => enmey.state === ENTITY_STATE_ENUM.DEATH) &&
            this.state !== ENTITY_STATE_ENUM.DEATH) {
            // 所有敌人都死了，并且门的状态不是DEATH状态，才设置成DEATH
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }
}

