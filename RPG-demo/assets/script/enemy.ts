// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "./game";
import Player from "./player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property(cc.Label)
    hpLabel: cc.Label = null;

    private hp: number = 0;
    private animation: cc.Animation = null;
    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
    }

    init(hp) {
        this.setHP(hp);
    }

    setHP(hp) {
        this.hp = hp;
        this.updateHP();
    }

    updateHP() {
        this.hpLabel.string = `${this.hp} HP`;
    }

    hurt(num) {
        this.hp -= num;
        this.updateHP();
        this.animation.play('hurt');
    }
    attack() {
        console.log('attack')
        this.animation.play('attack');
    }

    // hurt动画结束的回调
    onHurtEnd() {
        let player = cc.find('Canvas/bg/playerStatus').getComponent('player');
        if (player.ap <= 0) {
            this.attack();
        }
    }

    // attack 动画结束回调
    
}
