import EventManager from "../../runtime/EventManager";
import { CONTROLLER_ENUM, EVENT_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuManager extends cc.Component {
    handleRevoke() {
        EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
    }

    handleRestart() {
        EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
    }

    handleOut() {
        EventManager.Instance.emit(EVENT_ENUM.QUIT_BATTLE)
    }
}
