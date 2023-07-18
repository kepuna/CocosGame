// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Cell extends cc.Component {
    // onLoad () {}

    @property(cc.Node)
    innerCell: cc.Node = null;

    // 0表示细胞死亡
    state: number = 0;

    setState(state = 0) {
        this.state = state;
        if (this.state == 0) {
            this.innerCell.color = new cc.Color(255, 255, 255);
        } else {
            this.innerCell.color = new cc.Color(0, 0, 0);
        }
    }

    switchState() {
        let state = this.state == 0 ? 1 : 0;
        this.setState(state);
    }

    onLoad() {

    }

    // update (dt) {}
}
