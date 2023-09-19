
import DataManager from "../runtime/DataManager";
import EventManager from "../runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from "../script/enums/Enums";
import { IEntity } from "../script/levels/Levels";
import EntityManager from "./EntityManager";



const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyManager extends EntityManager {

    async init(params: IEntity) {
// console.log("EnemyManager  params---",params)
        super.init(params)

        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

        // 保证不论敌人先生成，还是玩家先生成，都能让敌人朝向玩家
        this.onChangeDirection(true)
    }
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
    }

    // 敌人死亡
    onDead(enemyId: string) {
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return
        }
        if (this.id === enemyId) {
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }

    // 敌人改变朝向
    onChangeDirection(isInit: boolean = false) {
        if (!DataManager.Instance.player || this.state === ENTITY_STATE_ENUM.DEATH) {
            return
        }

        // 拿到player的坐标，解构出targetX，targetY ,付给playerX和playerY
        const { targetX: playerX, targetY: playerY } = DataManager.Instance.player
        const disX = Math.abs(this.x - playerX)
        const disY = Math.abs(this.y - playerY)

        if (disX === disY && !isInit) {
            return
        }
        // 根据player的坐标，改变敌人的朝向
        if (playerX >= this.x && playerY <= this.y) {
            // 第一象限
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
        } else if (playerX <= this.x && playerY <= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
        } else if (playerX >= this.x && playerY >= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
        } else if (playerX <= this.x && playerY >= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
        }
    }
}

