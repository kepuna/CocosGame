// namespace RPGConfig  {
//     export let playerHpMax:number = 25; // 玩家最大hp
//     export let playerAttack:number = 5; // 玩家攻击力
//     export let enemyHpMax:number = 25; // 敌人最大hp
// }

const playerHpMax: number = 25; // 玩家最大hp
const playerApMax: number = 3; // 玩家最大行动点
const playerMpMax: number = 10; // 玩家法力值上限
const playerAttack: number = 5; // 玩家攻击力
const apCost = 1; // 玩家行动点消耗

const enemyHpMax: number = 25; // 敌人最大hp
const enemyAttack: number = 3; // 敌人攻击力

export default { playerHpMax, playerApMax, playerMpMax, playerAttack, apCost, enemyHpMax }; // 重命名模块导出