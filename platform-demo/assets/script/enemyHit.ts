// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyHit extends cc.Component {

    private enemyScript = null;
    onLoad() {
        this.enemyScript = this.node.parent.getComponent('enemy');
    }

    // 碰撞回调
    onCollisionEnter(other, self) {

        // FIX：Cocos的一个bug，
        if (other.size.width == 0 || other.size.height == 0) {
            return;
        }

        // tag 为1时才是 hero的攻击区域才发生碰撞，如果不加这个，hero身体和敌人接触时，也会发生碰撞
        if (other.node.group == 'hero' && other.tag == 1) {
            this.enemyScript.hurt();
        }
    }

    // update (dt) {}
}
