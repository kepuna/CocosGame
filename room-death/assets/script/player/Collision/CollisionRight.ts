
import EnemyManager from "../../../base/EnemyManager";
import DataManager from "../../../runtime/DataManager";
import EventManager from "../../../runtime/EventManager";
import BurstManager from "../../Burst/BurstManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../../enums/Enums";
import { Collision } from "./Collision";

export class CollisionRight implements Collision {
    check(direction: DIRECTION_ENUM): boolean {
        const { tileInfo } = DataManager.Instance
        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
        const { mapRowCount: row, mapColumnCount: column } = DataManager.Instance

        // 过滤出没有死的敌人
        const enemies: EnemyManager[] = DataManager.Instance.filterEnemies()
        // 过滤出没有死的地裂
        const bursts: BurstManager[] = DataManager.Instance.filterBursts()

        const playerNextX = playerX + 1

        if (direction === DIRECTION_ENUM.TOP) {
            if (playerNextX > row - 1) {
                this.collisionRight()
                return true
            }
            const weaponNextX = playerX + 1
            const weaponNextY = playerY - 1
            const nextPlayerTile = tileInfo[playerNextX]?.[playerY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]
            if (
                ((doorX === playerNextX && doorY === playerY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionRight()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerNextX && enemyY === playerY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionRight()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerNextX && burst.y === playerY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionRight()
                return true
            }

        } else if (direction === DIRECTION_ENUM.LEFT) {
            if (playerNextX > row - 1) {
                this.collisionBack()
                return true
            }
            const weaponNextX = playerX
            const nextPlayerTile = tileInfo[playerNextX]?.[playerY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[playerY]
            if (
                ((doorX === playerNextX && doorY === playerY) || (doorX === weaponNextX && doorY === y)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionBack()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if (enemyX === playerNextX && enemyY === playerY) {
                    this.collisionBack()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerNextX && burst.y === playerY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }

            //最后判断地图元素
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionBack()
                return true
            }

        } else if (direction === DIRECTION_ENUM.BOTTOM) {
            if (playerNextX > row - 1) {
                this.collisionLeft()
                return true
            }
            const weaponNextX = playerX + 1
            const weaponNextY = playerY + 1
            const nextPlayerTile = tileInfo[playerNextX]?.[playerY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]
            if (
                ((doorX === playerNextX && doorY === playerY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionLeft()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerNextX && enemyY === playerY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionLeft()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerNextX && burst.y === playerY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionLeft()
                return true
            }

        } else if (direction === DIRECTION_ENUM.RIGHT) {
            if (playerNextX > row - 1) {
                this.collisionFront()
                return true
            }
            const weaponNextX = playerX + 2
            const nextPlayerTile = tileInfo[playerNextX]?.[playerY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[playerY]
            if (
                ((doorX === playerNextX && doorY === playerY) || (doorX === weaponNextX && doorY === playerY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionFront()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerNextX && enemyY === playerY) || (enemyX === weaponNextX && enemyY === playerY)) {
                    this.collisionFront()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerNextX && burst.y === playerY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionFront()
                return true
            }
        }
        return false
    }

    private collisionFront() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_FRONT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
    }

    private collisionBack() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_BACK)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
    }
    private collisionLeft() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_LEFT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
    }
    private collisionRight() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_RIGHT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
    }
}