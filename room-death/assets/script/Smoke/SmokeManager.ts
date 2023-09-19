import EntityManager from "../../base/EntityManager";
import { IEntity } from "../levels/Levels";
import { SmokeStateMachine } from "./SmokeStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SmokeManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(SmokeStateMachine)
        await this.fsm.init()
        super.init(params)
    }
}

