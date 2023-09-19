import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from "../enums/Enums";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";
import level4 from "./level4";
import level5 from "./level5";

// 
export interface IEntity {
    x: number
    y: number
    type: ENTITY_TYPE_ENUM
    direction: DIRECTION_ENUM
    state: ENTITY_STATE_ENUM
}

export interface ISpikes {
    x: number
    y: number
    type: ENTITY_TYPE_ENUM // 地刺类型
    count: number
}

// 接口
export interface ITile {
    src: number | null
    type: TILE_TYPE_ENUM | null
}

export interface ILevel {
    mapInfo: Array<Array<ITile>> // mapInfo：是个二维数组
    player: IEntity,
    enemies: Array<IEntity>
    spikes: Array<ISpikes>
    bursts: Array<IEntity>
    door: IEntity
}

// Record是一个内置的泛型类型，用于表示由指定键类型映射到相应值类型的对象。
// 类似Map的作用
const Levels: Record<string, ILevel> = {
    level1,
    level2,
    level3,
    level4,
    level5,
}
export default Levels