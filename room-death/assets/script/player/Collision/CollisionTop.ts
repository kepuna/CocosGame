
import EnemyManager from "../../../base/EnemyManager";
import DataManager from "../../../runtime/DataManager";
import EventManager from "../../../runtime/EventManager";
import BurstManager from "../../Burst/BurstManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../../enums/Enums";
import { Collision } from "./Collision";

export class CollisionTop implements Collision {
    check(direction: DIRECTION_ENUM): boolean {

        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { tileInfo } = DataManager.Instance
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door

        // 过滤出没有死的敌人
        const enemies: EnemyManager[] = DataManager.Instance.filterEnemies()
        // const enemies: EnemyManager[] = DataManager.Instance.enemies.filter(
        //     (enemy: EnemyManager) => enemy.state !== ENTITY_STATE_ENUM.DEATH
        // )

        // 过滤出没有死的地裂
        const bursts: BurstManager[] = DataManager.Instance.filterBursts()
        // const bursts: BurstManager[] = DataManager.Instance.bursts.filter(
        //     (burst: BurstManager) => burst.state !== ENTITY_STATE_ENUM.DEATH
        // )

        const playerNextY = playerY - 1

        if (direction === DIRECTION_ENUM.TOP) { // 人物本身面朝 TOP
            const weaponNextY = playerY - 2
            if (playerNextY < 0) {    // 判断是否超出地图
                this.collisionFront()
                return true
            }

            // 拿到人物的下一个瓦片
            const nextPlayerTile = tileInfo[playerX][playerNextY]
            const nextWeaponTile = tileInfo[playerX][weaponNextY]

            // 如果人站的地方，或者枪站的地方，有一个地方有门的话，人物就不能往前走
            if (
                ((playerX === doorX && playerNextY === doorY) || (playerX === doorX && weaponNextY === doorY)) &&
                (doorState !== ENTITY_STATE_ENUM.DEATH)
            ) {
                this.collisionFront()
                return true
            }

            // 和敌人的碰撞检测
            for (let i = 0; i < enemies.length; i++) {
                const { x: enemyX, y: enemyY } = enemies[i];
                if (
                    ((playerX === enemyX && playerNextY === enemyY) || (playerX === enemyX && weaponNextY === enemyY))
                ) {
                    this.collisionFront()
                    return true
                }
            }

            // 地裂
            for (let i = 0; i < bursts.length; i++) {
                const { x: burstX, y: burstY } = bursts[i];
                if (
                    ((playerX === burstX && playerNextY === burstY) && (!nextWeaponTile || nextWeaponTile.turnable))
                ) {
                    // 人能走，枪也能走
                    return false
                }
            }

            // 最后判断地图元素
            if (nextPlayerTile && nextPlayerTile.moveable &&
                (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty

            } else {
                this.collisionFront()
                return true
            }
        } else if (direction === DIRECTION_ENUM.LEFT) { // 人物本身面朝 LEFT
            if (playerNextY < 0) {
                this.collisionRight()
                return true
            }
            const weaponNextX = playerX - 1
            const weaponNextY = playerY - 1
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

            //判断门
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionRight()
                return true
            }
            //判断敌人
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy
                if ((enemyX === playerX && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionRight()
                    return true
                }
            }
            //判断地裂陷阱
            if (bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)) {
                return false
            }
            //最后判断地图元素
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionRight()
                return true
            }
        } else if (direction === DIRECTION_ENUM.BOTTOM) { // 人物本身面朝 BOTTOM
            if (playerNextY < 0) {
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
            //判断敌人
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy
                if (enemyX === playerX && enemyY === playerNextY) {
                    this.collisionBack()
                    return true
                }
            }
            //判断地裂陷阱
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
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

        } else if (direction === DIRECTION_ENUM.RIGHT) { // 人物本身面朝 RIGHT
            if (playerNextY < 0) {
                this.collisionLeft()
                return true
            }
            const weaponNextX = playerX + 1
            const weaponNextY = playerY - 1
            const nextPlayerTile = tileInfo[playerX]?.[playerNextY]
            const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

            //判断门
            if (
                ((doorX === playerX && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.collisionLeft()
                return true
            }

            //判断敌人
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i]
                const { x: enemyX, y: enemyY } = enemy

                if ((enemyX === playerX && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
                    this.collisionLeft()
                    return true
                }
            }
            // 判断地裂陷阱
            if (
                bursts.some(burst => burst.x === playerX && burst.y === playerNextY) &&
                (!nextWeaponTile || nextWeaponTile.turnable)
            ) {
                return false
            }
            //最后判断地图元素
            if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
                // empty
            } else {
                this.collisionLeft()
                return true
            }
        }
        return false
    }

    private collisionFront() {
        EventManager.Instance.emit(EVENT_ENUM.UPDATE_PLAYER_STATE, ENTITY_STATE_ENUM.BLOCK_FRONT)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
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
