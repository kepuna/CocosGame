

import { createUINode } from "../../Utils/Utils";
import DataManager, { IRecord } from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import FaderManager from "../../runtime/FaderManager";
import BurstManager from "../Burst/BurstManager";
import DoorManager from "../Door/DoorManager";
import IronSkeletonManager from "../IronSkeleton/IronSkeletonManager";
import SmokeManager from "../Smoke/SmokeManager";
import SpikesManager from "../Spikes/SpikesManager";
import { ShakeManager } from "../UI/ShakeManager";
import WoodenSkeletonManager from "../WoodenSkeleton/WoodenSkeletonManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from "../enums/Enums";
import Levels, { ILevel } from "../levels/Levels";
import PlayerManager from "../player/PlayerManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../tile/TileManager";
import TileMapManager from "../tile/TileMapManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleManager extends cc.Component {
    // 游戏等级
    private level: ILevel
    // 舞台节点
    private stageNode: cc.Node = null
    private smokeLayer: cc.Node = null
    // 是否init完
    private inited: boolean = false


    onLoad() {
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this)
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
        EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
        EventManager.Instance.on(EVENT_ENUM.QUIT_BATTLE, this.quitBattle, this)
    }
    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel)
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
        EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
        EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
        EventManager.Instance.off(EVENT_ENUM.QUIT_BATTLE, this.quitBattle)
    }

    start() {
        this.generateStageNode()
        this.initLevel()
    }

    async initLevel() {
        const level = Levels[`level${DataManager.Instance.levelIndex}`]
        if (level) {
            if (this.inited) {
                await FaderManager.Instance.fadeIn()
            } else {
                await FaderManager.Instance.mask()
            }
            this.clearLevel() // 先清理下之前的关卡
            this.level = level
            // 将数据存入DataManager
            DataManager.Instance.mapInfo = this.level.mapInfo
            DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

            await Promise.all([
                this.generateTileMap(),
                this.generateBursts(),
                this.generateSpikes(),
                this.generateSmokeLayer(),
                this.generatePlayer(),
                this.generateEnemies(),
                this.generateDoor(),
            ])
            await FaderManager.Instance.fadeOut()
            this.inited = true
        } else {
            this.quitBattle()  // 加载不到关卡也执行quitBattle
        }
    }

    // 下一关
    nextLevel() {
        DataManager.Instance.levelIndex++
        this.initLevel()
    }

    // 清空下关卡
    clearLevel() {
        this.stageNode.destroyAllChildren()
        DataManager.Instance.reset()
    }

    // 检测玩家是否到达本关卡终点，切换下一关
    checkArrived() {
        if (!DataManager.Instance.player || !DataManager.Instance.door) {
            return
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
        if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }

    quitBattle() {
        this.node.destroy()
        cc.director.loadScene(SCENE_ENUM.Start)
    }

    // 生成舞台节点
    generateStageNode() {
        // 创建舞台：因为人物和地图都是放在同一个容器，这个容器叫做舞台（`stage`）
        this.stageNode = createUINode("stage")
        this.stageNode.setParent(this.node)
        this.stageNode.addComponent(ShakeManager)
    }
    // 生成瓦片地图
    async generateTileMap() {
        // 瓦片地图节点
        const tileMap: cc.Node = createUINode("map")
        tileMap.setParent(this.stageNode)
        // 给节点上挂脚本
        const tileMapManager = tileMap.addComponent(TileMapManager)
        await tileMapManager.init()
        this.adaptPostion()
    }

    // 生成Player
    async generatePlayer() {
        const player = createUINode()
        player.setParent(this.stageNode)

        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init(this.level.player)
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    // 生成敌人
    async generateEnemies() {
        const promise = []
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];

            const node = createUINode(`enemy${i}`)
            node.setParent(this.stageNode)
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
            const enemyManager = node.addComponent(Manager)
            promise.push(enemyManager.init(enemy))
            DataManager.Instance.enemies.push(enemyManager)
        }
        await Promise.all(promise)
    }

    // 生成门
    async generateDoor() {
        const door = createUINode('door')
        door.setParent(this.stageNode)

        const doorManager = door.addComponent(DoorManager)
        await doorManager.init(this.level.door)
        DataManager.Instance.door = doorManager
    }

    // 生成地裂节点
    async generateBursts() {
        const promise = []
        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];
            const node = createUINode(`burst${i}`)
            node.setParent(this.stageNode)
            const burstManager = node.addComponent(BurstManager)
            promise.push(burstManager.init(burst))
            DataManager.Instance.bursts.push(burstManager)
        }
        await Promise.all(promise)
    }

    // 生成地刺
    async generateSpikes() {
        const promise = []
        for (let i = 0; i < this.level.spikes.length; i++) {
            const spike = this.level.spikes[i];
            const node = createUINode(`spike${i}`)
            node.setParent(this.stageNode)
            const spikesManager = node.addComponent(SpikesManager)
            promise.push(spikesManager.init(spike))
            DataManager.Instance.spikes.push(spikesManager)
        }
        await Promise.all(promise)
    }

    async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
        if (item) { // 缓冲池，实现烟雾重用
            item.x = x
            item.y = y
            item.direction = direction
            item.state = ENTITY_STATE_ENUM.IDLE
            item.node.setPosition(x * TILE_WIDTH, -(y * TILE_HEIGHT))
        } else {
            const smoke = createUINode('smoke')
            smoke.setParent(this.smokeLayer)
            const smokeManager = smoke.addComponent(SmokeManager)
            await smokeManager.init({
                x,
                y,
                direction,
                state: ENTITY_STATE_ENUM.IDLE,
                type: ENTITY_TYPE_ENUM.SMOKE,
            })
            DataManager.Instance.smokes.push(smokeManager)
        }
    }

    async generateSmokeLayer() {
        this.smokeLayer = createUINode('smokeLayer')
        this.smokeLayer.setParent(this.stageNode)
    }

    // 调整地图的位置
    adaptPostion() {
        const { mapRowCount, mapColumnCount } = DataManager.Instance
        const disX = (TILE_WIDTH * mapColumnCount) * 0.5 - TILE_WIDTH * 0.5
        const disY = (TILE_HEIGHT * mapColumnCount) * 0.5 - TILE_HEIGHT * 0.5
        this.stageNode.setPosition(-disX, disY)
        this.stageNode.getComponent(ShakeManager).stop()
    }


    record() {  // 数据存档
        const item: IRecord = {
            player: {
                x: DataManager.Instance.player.targetX,
                y: DataManager.Instance.player.targetY,
                state:
                    DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
                        DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ||
                        DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
                        ? DataManager.Instance.player.state
                        : ENTITY_STATE_ENUM.IDLE,
                direction: DataManager.Instance.player.direction,
                type: DataManager.Instance.player.type,
            },
            door: {
                x: DataManager.Instance.door.x,
                y: DataManager.Instance.door.y,
                state: DataManager.Instance.door.state,
                direction: DataManager.Instance.door.direction,
                type: DataManager.Instance.door.type,
            },
            enemies: DataManager.Instance.enemies.map(({ x, y, state, direction, type }) => {
                return {
                    x,
                    y,
                    state,
                    direction,
                    type,
                }
            }),
            spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => {
                return {
                    x,
                    y,
                    count,
                    type,
                }
            }),
            bursts: DataManager.Instance.bursts.map(({ x, y, state, direction, type }) => {
                return {
                    x,
                    y,
                    state,
                    direction,
                    type,
                }
            }),
        }
        DataManager.Instance.records.push(item)
    }


    revoke() {  // 撤回操作
        const data = DataManager.Instance.records.pop()
        if (data) {
            DataManager.Instance.player.x = DataManager.Instance.player.targetX = data.player.x
            DataManager.Instance.player.y = DataManager.Instance.player.targetY = data.player.y
            DataManager.Instance.player.state = data.player.state
            DataManager.Instance.player.direction = data.player.direction

            for (let i = 0; i < data.enemies.length; i++) {
                const item = data.enemies[i]
                DataManager.Instance.enemies[i].x = item.x
                DataManager.Instance.enemies[i].y = item.y
                DataManager.Instance.enemies[i].state = item.state
                DataManager.Instance.enemies[i].direction = item.direction
            }

            for (let i = 0; i < data.spikes.length; i++) {
                const item = data.spikes[i]
                DataManager.Instance.spikes[i].x = item.x
                DataManager.Instance.spikes[i].y = item.y
                DataManager.Instance.spikes[i].count = item.count
            }

            for (let i = 0; i < data.bursts.length; i++) {
                const item = data.bursts[i]
                DataManager.Instance.bursts[i].x = item.x
                DataManager.Instance.bursts[i].y = item.y
                DataManager.Instance.bursts[i].state = item.state
            }

            DataManager.Instance.door.x = data.door.x
            DataManager.Instance.door.y = data.door.y
            DataManager.Instance.door.state = data.door.state
            DataManager.Instance.door.direction = data.door.direction
        } else {
            //TODO 播放游戏音频嘟嘟嘟
        }
    }

}
