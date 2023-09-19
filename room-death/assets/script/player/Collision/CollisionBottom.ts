import EnemyManager from "../../../base/EnemyManager";
import DataManager from "../../../runtime/DataManager";
import EventManager from "../../../runtime/EventManager";
import BurstManager from "../../Burst/BurstManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../../enums/Enums";
import { Collision } from "./Collision";

export class CollisionBottom implements Collision {
    check(direction: DIRECTION_ENUM): boolean {

        const { tileInfo } = DataManager.Instance
        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door

        // 过滤出没有死的敌人
        const enemies: EnemyManager[] = DataManager.Instance.filterEnemies()
        // 过滤出没有死的地裂
        const bursts: BurstManager[] = DataManager.Instance.filterBursts()
        const { mapRowCount: row, mapColumnCount: column } = DataManager.Instance

        const playerNextY = playerY + 1

        if (direction === DIRECTION_ENUM.TOP) {
            if (playerNextY > column - 1) {
                this.collisionBack()
                return true
            }
            const weaponNextY = playerY
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[playerX]?.[weaponNextY]
            //判断门
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === playerX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionBack()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy
                if (enemyX === playerX && enemyY === playerNextY) {
                    this.collisionBack()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionBack()
                return true
            }

        } else if (direction === DIRECTION_ENUM.LEFT) {
            if (playerNextY > column - 1) {
                this.collisionLeft()
                return true
            }
            const weaponNextX = playerX - 1
            const weaponNextY = playerY + 1
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionLeft()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerX && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionLeft()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
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
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
            if (playerNextY > column - 1) {
                this.collisionFront()
                return true
            }
            const weaponNextY = playerY + 2
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[playerX]?.[weaponNextY]
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === playerX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionFront()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerX && enemyY === weaponNextY) || (enemyX === playerX && enemyY === playerNextY)) {
                    this.collisionFront()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
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
        } else if (direction === DIRECTION_ENUM.RIGHT) {
            if (playerNextY > column - 1) {
                this.collisionRight()
                return true
            }
            const weaponNextX = playerX + 1
            const weaponNextY = playerY + 1
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionRight()
                return true
            }
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerX && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionRight()
                    return true
                }
            }
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
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
        }
        return false
    }

    private collisionFront() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_FRONT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
    }

    private collisionBack() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_BACK)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
    }
    private collisionLeft() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_LEFT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
    }
    private collisionRight() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_RIGHT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
    }
}