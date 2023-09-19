
import EnemyManager from "../../../base/EnemyManager";
import DataManager from "../../../runtime/DataManager";
import EventManager from "../../../runtime/EventManager";
import BurstManager from "../../Burst/BurstManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../../enums/Enums";
import { Collision } from "./Collision";

export class CollisionTurnRight implements Collision {
    check(direction: DIRECTION_ENUM): boolean {

        const { tileInfo } = DataManager.Instance
        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door

        // 过滤出没有死的敌人
        const enemies: EnemyManager[] = DataManager.Instance.filterEnemies()
        // 过滤出没有死的地裂
        const bursts: BurstManager[] = DataManager.Instance.filterBursts()

        let nextX, nextY
        if (direction === DIRECTION_ENUM.TOP) {
            //朝上右转的话，右上角三个tile都必须turnable为true
            nextY = playerY - 1
            nextX = playerX + 1
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
            nextY = playerY + 1
            nextX = playerX - 1
        } else if (direction === DIRECTION_ENUM.LEFT) {
            nextY = playerY - 1
            nextX = playerX - 1
        } else if (direction === DIRECTION_ENUM.RIGHT) {
            nextY = playerY + 1
            nextX = playerX + 1
        }
        if (
            ((doorX === playerX && doorY === nextY) ||
                (doorX === nextX && doorY === playerY) ||
                (doorX === nextX && doorY === nextY)) &&
            doorState !== ENTITY_STATE_ENUM.DEATH
        ) {
            this.collision(direction)
            return true
        }
        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i]
            const { x: enemyX, y: enemyY } = enemy
            if (enemyX === nextX && enemyY === playerY) {
                this.collision(direction)
                return true
            } else if (enemyX === nextX && enemyY === nextY) {
                this.collision(direction)
                return true
            } else if (enemyX === playerX && enemyY === nextY) {
                this.collision(direction)
                return true
            }
        }
        //最后判断地图元素
        if (
            (!tileInfo[playerX]?.[nextY] || tileInfo[playerX]?.[nextY].turnable) &&
            (!tileInfo[nextX]?.[playerY] || tileInfo[nextX]?.[playerY].turnable) &&
            (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
        ) {
            // empty
        } else {
            this.collision(direction)
            return true
        }
        return false
    }

    private collision(direction: DIRECTION_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
        if (direction === DIRECTION_ENUM.TOP) {
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.LEFT)
        } else if (direction === DIRECTION_ENUM.LEFT) {
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
        } else if (direction === DIRECTION_ENUM.RIGHT) {
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
        }
    }
}