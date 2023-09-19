import EnemyManager from "../base/EnemyManager";
import Singleton from "../base/Singleton";
import BurstManager from "../script/Burst/BurstManager";
import DoorManager from "../script/Door/DoorManager";
import SmokeManager from "../script/Smoke/SmokeManager";
import SpikesManager from "../script/Spikes/SpikesManager";
import WoodenSkeletonManager from "../script/WoodenSkeleton/WoodenSkeletonManager";
import { ENTITY_STATE_ENUM } from "../script/enums/Enums";
import { ILevel, ITile } from "../script/levels/Levels";
import PlayerManager from "../script/player/PlayerManager";
import TileManager from "../script/tile/TileManager";

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>()
    }

    tileInfo: Array<Array<TileManager>>
    mapInfo: Array<Array<ITile>>
    mapRowCount: number = 0
    mapColumnCount: number = 0
    levelIndex: number = 1

    player: PlayerManager
    door: DoorManager

    // 敌人数组
    enemies: EnemyManager[]
    // 地裂数组
    bursts: BurstManager[]
    // 地刺数组
    spikes: SpikesManager[]
    // 烟雾数组
    smokes: SmokeManager[]
    // 撤回数据
    records: IRecord[]

    reset() {
        this.mapInfo = []
        this.tileInfo = []
        this.enemies = []
        this.bursts = []
        this.spikes = []
        this.smokes = []
        this.records = []
        this.player = null
        this.door = null
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }

    // 过滤出没有死的敌人
    filterEnemies() {
        return DataManager.Instance.enemies.filter(
            (enemy: EnemyManager) => enemy.state !== ENTITY_STATE_ENUM.DEATH
        )
    }

    // 过滤出没有死的地裂
    filterBursts() {
        return DataManager.Instance.bursts.filter(
            (burst: BurstManager) => burst.state !== ENTITY_STATE_ENUM.DEATH
        )
    }


}
