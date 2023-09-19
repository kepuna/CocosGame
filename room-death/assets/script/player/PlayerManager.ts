import EnemyManager from "../../base/EnemyManager";
import EntityManager from "../../base/EntityManager";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import BurstManager from "../Burst/BurstManager";
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SHAKE_TYPE_ENUM } from "../enums/Enums";
import { IEntity } from "../levels/Levels";
import { Collision } from "./Collision/Collision";
import { CollisionBottom } from "./Collision/CollisionBottom";
import { CollisionLeft } from "./Collision/CollisionLeft";
import { CollisionRight } from "./Collision/CollisionRight";
import { CollisionTop } from "./Collision/CollisionTop";
import { CollisionTurnLeft } from "./Collision/CollisionTurnLeft";
import { CollisionTurnRight } from "./Collision/CollisionTurnRight";
import { PlayerStateMachine } from "./PlayerStateMachine";

const { ccclass, property } = cc._decorator;

const CollisionDict: Record<string, Collision> = {
    "LEFT": new CollisionLeft(),
    "RIGHT": new CollisionRight(),
    "TOP": new CollisionTop(),
    "BOTTOM": new CollisionBottom(),
    "TURN_LEFT": new CollisionTurnLeft(),
    "TURN_RIGHT": new CollisionTurnRight(),
}

@ccclass
export default class PlayerManager extends EntityManager {

    targetX: number = 0
    targetY: number = 0
    isMoving = false // 当前人物是否正在移动

    collision: Collision

    private readonly speed = 1 / 10 // 移动速度

    async init(params: IEntity) {

        this.fsm = this.addComponent(PlayerStateMachine) // Player状态机
        await this.fsm.init()

        super.init(params)

        this.targetX = this.x
        this.targetY = this.y

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandler, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
        EventManager.Instance.on(EVENT_ENUM.UPDATE_PLAYER_STATE, this.updateState, this)
    }
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandler)
        EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDead)
        EventManager.Instance.off(EVENT_ENUM.UPDATE_PLAYER_STATE, this.updateState)
    }

    update() {
        this.updateXY()
        super.update()
    }

    updateState() {
        this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.speed
        } else if (this.targetX > this.x) {
            this.x += this.speed
        }

        if (this.targetY < this.y) {
            this.y -= this.speed
        } else if (this.targetY > this.y) {
            this.y += this.speed
        }

        // 容错处理，防止人物鬼畜
        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoving) {
            this.isMoving = false
            this.x = this.targetX
            this.y = this.targetY
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }

    // 6个控制按钮，控制玩家操作
    inputHandler(contrlType: CONTROLLER_ENUM) {
        if (this.isMoving) {
            return
        }
        if (this.state === ENTITY_STATE_ENUM.DEATH ||
            this.state === ENTITY_STATE_ENUM.AIRDEATH ||
            this.state === ENTITY_STATE_ENUM.ATTACK) { // 死亡、攻击中都不让人物移动
            return
        }

        // 攻击敌人
        const enemyId = this.willAttack(contrlType)
        if (enemyId) {
            // 攻击前记录一下
            EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId)
            EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
            return
        }
        this.collision = CollisionDict[contrlType]
        if (this.collision.check(this.direction)) {
            return
        }
        this.move(contrlType)
    }

    // 玩家死亡
    onDead(deathType: ENTITY_STATE_ENUM.DEATH) {
        console.log('onDead===', deathType)
        this.state = deathType
    }

    move(inputDirection: CONTROLLER_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
        if (inputDirection === CONTROLLER_ENUM.TOP) {
            this.targetY -= 1
            this.isMoving = true
            this.showSmoke(DIRECTION_ENUM.TOP)
        } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
            this.targetY += 1
            this.isMoving = true
            this.showSmoke(DIRECTION_ENUM.BOTTOM)

        } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
            this.targetX -= 1
            this.isMoving = true
            this.showSmoke(DIRECTION_ENUM.LEFT)

        } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
            this.targetX += 1
            this.isMoving = true
            this.showSmoke(DIRECTION_ENUM.RIGHT)

        } else if (inputDirection === CONTROLLER_ENUM.TURN_LEFT) { // 左转, 旋转不算移动，不用 isMoving = true

            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.TOP
            }
            // 在set state 方法内会调用 this.fsm.setParams(。。。)
            this.state = ENTITY_STATE_ENUM.TURN_LEFT
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)

        } else if (inputDirection === CONTROLLER_ENUM.TURN_RIGHT) { // 右转

            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.TOP
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            }
            this.state = ENTITY_STATE_ENUM.TURN_RIGHT
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }

    // 显示烟雾效果
    showSmoke(type: DIRECTION_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, type)
    }

    // 攻击敌人时震动
    onAttackShake(type: SHAKE_TYPE_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, type)
    }

    willAttack(controlType: CONTROLLER_ENUM): string {
        // 从数据中心拿到敌人
        const enemies = DataManager.Instance.filterEnemies() //DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)

        for (let i = 0; i < enemies.length; i++) {
            const { x: enemyX, y: enemyY, id: enemyId } = enemies[i];
            // 如果Contrl按钮输入的方向是向上，并且人物朝向也是向上，
            if (controlType === CONTROLLER_ENUM.TOP && this.direction === DIRECTION_ENUM.TOP
                && enemyX === this.x && enemyY === this.targetY - 2) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (controlType === CONTROLLER_ENUM.LEFT && this.direction === DIRECTION_ENUM.LEFT
                && enemyX === this.x - 2 && enemyY === this.targetY) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (controlType === CONTROLLER_ENUM.BOTTOM && this.direction === DIRECTION_ENUM.BOTTOM
                && enemyX === this.x && enemyY === this.targetY + 2) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            } else if (controlType === CONTROLLER_ENUM.RIGHT && this.direction === DIRECTION_ENUM.RIGHT
                && enemyX === this.x + 2 && enemyY === this.targetY) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }
        }
        return ''
    }

    // 是否撞了（碰撞检测）
    willBlock(inputDirection: CONTROLLER_ENUM): boolean {
        const { targetX, targetY, direction } = this
        const { tileInfo } = DataManager.Instance
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door

        // 过滤出没有死的敌人
        const enemies: EnemyManager[] = DataManager.Instance.enemies.filter(
            (enemy: EnemyManager) => enemy.state !== ENTITY_STATE_ENUM.DEATH
        )

        // 过滤出没有死的地裂
        const bursts: BurstManager[] = DataManager.Instance.bursts.filter(
            (burst: BurstManager) => burst.state !== ENTITY_STATE_ENUM.DEATH
        )

        if (inputDirection === CONTROLLER_ENUM.TOP) {
            // 如果输入的 top,此时人物本身也是top
            if (direction === DIRECTION_ENUM.TOP) {
                const playerNextY = this.y - 1
                const weaponNextY = this.y - 2
                if (playerNextY < 0) {    // 判断是否超出地图
                    this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
                    return true
                }

                // 拿到人物的下一个瓦片
                const nextPlayerTile = tileInfo[this.x][playerNextY]
                const nextWeaponTile = tileInfo[this.x][weaponNextY]

                // console.log(nextWeaponTile)

                // 如果人站的地方，或者枪站的地方，有一个地方有门的话，人物就不能往前走
                if (
                    ((this.x === doorX && playerNextY === doorY) || (this.x === doorX && weaponNextY === doorY)) &&
                    (doorState !== ENTITY_STATE_ENUM.DEATH)
                ) {
                    this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
                    return true
                }

                // 和敌人的碰撞检测
                for (let i = 0; i < enemies.length; i++) {
                    const { x: enemyX, y: enemyY } = enemies[i];
                    if (
                        ((this.x === enemyX && playerNextY === enemyY) || (this.x === enemyX && weaponNextY === enemyY))
                    ) {
                        this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
                        return true
                    }
                }

                // 地裂
                for (let i = 0; i < bursts.length; i++) {
                    const { x: burstX, y: burstY } = bursts[i];
                    if (
                        ((this.x === burstX && playerNextY === burstY) && (!nextWeaponTile || nextWeaponTile.turnable))
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
                    this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
                    return true
                }
            }

        } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
            if (direction === DIRECTION_ENUM.LEFT) {
                const playerNextX = this.x - 1
                const weaponNextX = this.x - 2

                if (playerNextX < 0) {   // 判断是否超出地图
                    this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
                    return true
                }

                // 拿到人物的下一个瓦片
                const nextPlayerTile = tileInfo[playerNextX][this.y]
                const nextWeaponTile = tileInfo[weaponNextX][this.y]

                // 如果人站的地方，或者枪站的地方，有一个地方有门的话，人物就不能往前走
                if (
                    ((this.y === doorY && playerNextX === doorX) || (this.y === doorY && weaponNextX === doorX)) &&
                    (doorState !== ENTITY_STATE_ENUM.DEATH)
                ) {
                    this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
                    return true
                }

                // 和敌人的碰撞检测
                for (let i = 0; i < enemies.length; i++) {
                    const { x: enemyX, y: enemyY } = enemies[i];
                    if (
                        ((this.y === enemyY && playerNextX === enemyX) || (this.y === enemyY && weaponNextX === enemyX))
                    ) {
                        this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
                        return true
                    }
                }


                // 最后判断地图元素
                if (nextPlayerTile && nextPlayerTile.moveable &&
                    (!nextWeaponTile || nextWeaponTile.turnable)) {
                    // empty
                } else {
                    this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
                    return true
                }
            }
        }

        else if (inputDirection === CONTROLLER_ENUM.TURN_LEFT) {
            let nextX
            let nextY
            // 如果人物面向是朝上的话，需要的瓦片就是 y-1，x-1
            if (direction === DIRECTION_ENUM.TOP) {
                nextX = this.x - 1
                nextY = this.y - 1
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                nextX = this.x + 1
                nextY = this.y + 1
            } else if (direction === DIRECTION_ENUM.LEFT) {
                nextX = this.x - 1
                nextY = this.y + 1
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                nextX = this.x + 1
                nextY = this.y - 1
            }

            // 人物旋转时，也要判断3个方向上有没有门，有的话，也不能旋转
            if (((this.x === doorX && nextY === doorY) || (nextX === doorX && this.y === doorY) || (nextX === doorX && nextY === doorY)) &&
                doorState !== ENTITY_STATE_ENUM.DEATH
            ) {
                this.state = ENTITY_STATE_ENUM.BLOCK_TURN_LEFT
                return true
            }

            for (let i = 0; i < enemies.length; i++) {
                const { x: enemyX, y: enemyY } = enemies[i];
                if (((this.x === enemyX && nextY === enemyY) ||
                    (nextX === enemyX && this.y === enemyY) ||
                    (nextX === enemyX && nextY === enemyY))) {
                    this.state = ENTITY_STATE_ENUM.BLOCK_TURN_LEFT
                    return true
                }
            }


            // 最后判断地图元素
            // 接着判断3个瓦片是否 turnable，moveable
            if ((!tileInfo[this.x]?.[nextY] || tileInfo[this.x]?.[nextY].turnable) &&
                (!tileInfo[nextX]?.[this.y] || tileInfo[nextX]?.[this.y].turnable) &&
                (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)) {
                // empty
            } else {
                this.state = ENTITY_STATE_ENUM.BLOCK_TURN_LEFT
                return true
            }
        }
        return false
    }
}

