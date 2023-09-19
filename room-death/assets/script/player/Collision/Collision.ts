

// 定义状态抽象类 AbstractBlock
// 需要包含上下文 Context, 以及所有的抽象事件（event）对象的方法
// export abstract class AbstractBlock {
//     // 上下文信息
//     private _context: Context

import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from "../../enums/Enums";

export interface Collision {
    check(direction: DIRECTION_ENUM): boolean
}