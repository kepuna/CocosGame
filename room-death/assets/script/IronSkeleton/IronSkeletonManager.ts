import EnemyManager from "../../base/EnemyManager";
import { IEntity } from "../levels/Levels";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IronSkeletonManager extends EnemyManager {

    async init(params: IEntity) {
        this.fsm = this.addComponent(IronSkeletonStateMachine)
        await this.fsm.init()
        super.init(params)
    }
}

