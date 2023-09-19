import EventManager from "../../runtime/EventManager";
import FaderManager from "../../runtime/FaderManager";
import { CONTROLLER_ENUM, EVENT_ENUM, SCENE_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartManager extends cc.Component {
    onLoad() {
        FaderManager.Instance.fadeOut(1000)
        this.node.once(cc.Node.EventType.TOUCH_END, this.handleStart, this)
    }
    async handleStart() {
        await FaderManager.Instance.fadeIn(300)
        cc.director.loadScene(SCENE_ENUM.Battle)
    }
}
