/***
 * 全局枚举
 */


/***
 * 地图瓦片枚举 10种瓦片,3种类型：1、可走可转 2、不可走可转 3、不可走不可转
 */
export enum TILE_TYPE_ENUM {
    WALL_ROW = "WALL_ROW",
    WALL_COLUMN = "WALL_COLUMN",
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    CLIFF_LEFT = 'CLIFF_ROW_START', // cliff  悬崖; 峭壁
    CLIFF_CENTER = 'CLIFF_ROW_CENTER',
    CLIFF_RIGHT = 'CLIFF_ROW_END',
    FLOOR = 'FLOOR',
}

/***
 * 事件类型枚举
 */
export enum EVENT_ENUM {
    NEXT_LEVEL = "NEXT_LEVEL",
    PLAYER_CTRL = "PLAYER_CTRL",
    PLAYER_MOVE_END = "PLAYER_MOVE_END", // 玩家移动结束
    PLAYER_BORN = "PLAYER_BORN", // 玩家生成完
    ATTACK_PLAYER = "ATTACK_PLAYER", // 敌人攻击玩家
    ATTACK_ENEMY = "ATTACK_ENEMY", // 玩家攻击敌人
    DOOR_OPEN = "DOOR_OPEN", // 打开门
    SHOW_SMOKE = "SHOW_SMOKE", // 显示烟雾
    SCREEN_SHAKE = "SCREEN_SHAKE", // screen shake
    RECORD_STEP = "RECORD_STEP", // 记录操作
    REVOKE_STEP = "REVOKE_STEP", // 撤销操作
    RESTART_LEVEL = "RESTART_LEVEL", // 
    QUIT_BATTLE = "QUIT_BATTLE",


    UPDATE_PLAYER_STATE = 'UPDATE_PLAYER_STATE', // update player state
}

/***
 * 底部6个控制按钮枚举
 */
export enum CONTROLLER_ENUM {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    TURN_LEFT = "TURN_LEFT",
    TURN_RIGHT = "TURN_RIGHT",
}

/***
 * 有限状态机 参数类型 枚举
 */
export enum FSM_PARAMS_TYPE_ENUM {
    NUMBER = "NUMBER",
    TRIGGER = "TRIGGER",
}

/***
 * 有限状态机 参数 枚举
 */
export enum PARAMS_NAME_ENUM {
    IDLE = "IDLE",
    TURN_LEFT = "TURN_LEFT",
    TURN_RIGHT = "TURN_RIGHT",
    DIRECTION = "DIRECTION", // 方向
    BLOCK_FRONT = "BLOCK_FRONT", // 向前撞
    BLOCK_LEFT = "BLOCK_LEFT",
    BLOCK_TURN_LEFT = "BLOCK_TURN_LEFT", // 左转撞
    ATTACK = "ATTACK", // 攻击
    DEATH = 'DEATH', // 地面死
    AIRDEATH = 'AIRDEATH', // 空中死

    SKIKES_CURRENT_COUNT = "SKIKES_CURRENT_COUNT",
    SKIKES_TOTAL_COUNT = "SKIKES_TOTAL_COUNT",
}

/***
 * 玩家朝向枚举
 */
export enum DIRECTION_ENUM {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

/***
 * 角色状态枚举
 */
export enum ENTITY_STATE_ENUM {
    IDLE = "IDLE",
    TURN_LEFT = "TURN_LEFT",
    TURN_RIGHT = "TURN_RIGHT",
    BLOCK_FRONT = "BLOCK_FRONT",
    BLOCK_BACK = "BLOCK_BACK",
    BLOCK_LEFT = "BLOCK_LEFT",
    BLOCK_RIGHT = "BLOCK_RIGHT",

    BLOCK_TURN_LEFT = "BLOCK_TURN_LEFT", // 左转撞
    BLOCK_TURN_RIGHT = "BLOCK_TURN_RIGHT", // right转撞
    ATTACK = "ATTACK", // 攻击
    DEATH = 'DEATH', // 地面死
    AIRDEATH = 'AIRDEATH', // 空中死
}

/***
 * 方向顺序
 */
export enum DIRECTION_ORDER_ENUM {
    TOP = 1,
    BOTTOM = 2,
    LEFT = 3,
    RIGHT = 4,
}

// 实体枚举
export enum ENTITY_TYPE_ENUM {
    PLAYER = 'PLAYER',
    DOOR = 'DOOR',
    SKELETON_WOODEN = 'SKELETON_WOODEN',
    SKELETON_IRON = 'SKELETON_IRON',
    BURST = 'BURST',
    SPIKES_ONE = 'SPIKES_ONE',
    SPIKES_TWO = 'SPIKES_TWO',
    SPIKES_THREE = 'SPIKES_THREE',
    SPIKES_FOUR = 'SPIKES_FOUR',
    SMOKE = 'SMOKE', // 烟雾
}

// 把Spikes的类型映射成总点数
export enum SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM {
    SPIKES_ONE = 2, // 1刺类型 总点数有2个点
    SPIKES_TWO = 3, // 2刺类型 总点数有3个点
    SPIKES_THREE = 4, // 3刺类型 总点数有4个点
    SPIKES_FOUR = 5, // 4刺类型 总点数有5个点
}

// key
export enum SPIKE_COUNT_ENUM {
    ZERO = 'ZERO',
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
    FOUR = 'FOUR',
    FIVE = 'FIVE',
}
export enum SPIKE_COUNT_MAP_NUMBER_ENUM {
    ZERO = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export enum SHAKE_TYPE_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}


export enum SCENE_ENUM {
    Loading = 'Loading',
    Start = 'Start',
    Battle = 'Battle',
}