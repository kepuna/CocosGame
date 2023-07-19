// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import Config from './config';
import Enemy from './enemy';
import Player from './player';

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    enemyNode: cc.Node = null;
    @property(cc.Node)
    playerNode: cc.Node = null;

    enemy: Enemy = null;
    player: Player = null;

    onLoad() {
        this.enemy = this.enemyNode.getComponent('enemy');
        this.player = this.playerNode.getComponent('player');
    }

    start() {
        this.enemy.init(Config.enemyHpMax);
        this.player.init(Config.playerHpMax, Config.playerApMax, Config.playerMpMax);
    }

    playerAttack() {
        if (this.player.ap >= Config.apCost) {
            this.enemy.hurt(Config.playerAttack);
            this.player.costAP(Config.apCost);
        } else {
            console.log('没有行动点了');
        }
    }

    // update (dt) {}
}
