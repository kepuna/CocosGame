import EventManager from "../../runtime/EventManager";
import { CONTROLLER_ENUM, EVENT_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ControllerManager extends cc.Component {
    handleControl(event: Event, type: string) {
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM)
    }
}
